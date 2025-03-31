import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import * as cheerio from "cheerio";
import { SeoAnalysis, urlAnalysisRequestSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to analyze a URL
  app.post("/api/analyze", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const { url } = urlAnalysisRequestSchema.parse(req.body);
      
      // Check if we already have an analysis for this URL
      const existingAnalysis = await storage.getAnalysisByUrl(url);
      if (existingAnalysis) {
        // Only return cached results if less than 1 hour old
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (existingAnalysis.fetchedAt && existingAnalysis.fetchedAt > oneHourAgo) {
          return res.json(existingAnalysis);
        }
      }
      
      // Normalize URL to ensure it has a protocol
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Fetch the webpage content
      const response = await axios.get(normalizedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SeoAnalyzer/1.0)',
          'Accept': 'text/html'
        },
        timeout: 10000, // 10 second timeout
        maxRedirects: 5
      });
      
      // Parse the HTML content
      const $ = cheerio.load(response.data);
      
      // Extract meta tags (without scoring)
      const metaTags = extractMetaTags($, normalizedUrl);
      
      // Save the meta tags
      const savedAnalysis = await storage.saveAnalysis(metaTags);
      
      // Return the meta tag data
      res.json(savedAnalysis);
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      } else if (axios.isAxiosError(error)) {
        // Handle network or HTTP errors
        const status = error.response?.status || 500;
        const message = error.response?.statusText || error.message || 'Network error';
        return res.status(status).json({ message: `Failed to fetch URL: ${message}` });
      }
      
      // Handle any other errors
      console.error('Error analyzing URL:', error);
      res.status(500).json({ message: 'An unexpected error occurred while analyzing the URL' });
    }
  });
  
  // API endpoint to get recent analyses
  app.get("/api/recent", async (_req: Request, res: Response) => {
    try {
      const recentAnalyses = await storage.getRecentAnalyses(10);
      res.json(recentAnalyses);
    } catch (error) {
      console.error('Error fetching recent analyses:', error);
      res.status(500).json({ message: 'An error occurred while fetching recent analyses' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to extract title and all meta tags from HTML content
function extractMetaTags($: cheerio.CheerioAPI, url: string): SeoAnalysis {
  // Extract title
  const title = $('title').text();
  
  // Extract all meta tags
  const allMetaTags: Record<string, string> = {};
  $('meta').each((_, el) => {
    const name = $(el).attr('name');
    const property = $(el).attr('property');
    const content = $(el).attr('content');
    
    if ((name || property) && content) {
      const key = name || property || '';
      allMetaTags[key] = content;
    }
  });
  
  // Extract canonical URL (as a special case, since it's a link tag, not a meta tag)
  const canonicalUrl = $('link[rel="canonical"]').attr('href');
  if (canonicalUrl) {
    allMetaTags['canonical'] = canonicalUrl;
  }
  
  // Return only the minimal data needed
  return {
    url,
    title,
    metaTags: allMetaTags,
    fetchedAt: new Date()
  };
}
