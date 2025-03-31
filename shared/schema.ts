import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define URL pattern validation
const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

// Define SEO analysis result schema - simplified for minimal server-side processing
export const seoAnalysisSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  metaTags: z.record(z.string(), z.string()).optional(),
  
  // The following fields are computed on the client side
  // and are included here to maintain compatibility with existing components
  description: z.string().optional(),
  canonical: z.string().optional(),
  robots: z.string().optional(),
  viewport: z.string().optional(),
  ogTags: z.record(z.string(), z.string()).optional(),
  twitterTags: z.record(z.string(), z.string()).optional(),
  otherTags: z.record(z.string(), z.string()).optional(),
  score: z.number().min(0).max(100).optional(),
  passing: z.number().min(0).optional(),
  warnings: z.number().min(0).optional(),
  missing: z.number().min(0).optional(),
  fetchedAt: z.date().optional(),
});

export type SeoAnalysis = z.infer<typeof seoAnalysisSchema>;

// Define URL analysis request schema
export const urlAnalysisRequestSchema = z.object({
  url: z.string().regex(urlPattern, { message: "Please enter a valid URL" })
});

export type UrlAnalysisRequest = z.infer<typeof urlAnalysisRequestSchema>;
