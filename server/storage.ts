import { SeoAnalysis } from "@shared/schema";

// Define the storage interface for SEO analysis results
export interface IStorage {
  saveAnalysis(analysis: SeoAnalysis): Promise<SeoAnalysis>;
  getAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined>;
  getRecentAnalyses(limit: number): Promise<SeoAnalysis[]>;
}

export class MemStorage implements IStorage {
  private analyses: Map<string, SeoAnalysis>;

  constructor() {
    this.analyses = new Map();
  }

  async saveAnalysis(analysis: SeoAnalysis): Promise<SeoAnalysis> {
    // Add fetchedAt timestamp
    const analysisWithTimestamp = {
      ...analysis,
      fetchedAt: analysis.fetchedAt || new Date()
    };
    
    // Use normalized URL as key
    const key = this.normalizeUrl(analysis.url);
    this.analyses.set(key, analysisWithTimestamp);
    return analysisWithTimestamp;
  }

  async getAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined> {
    const key = this.normalizeUrl(url);
    return this.analyses.get(key);
  }

  async getRecentAnalyses(limit: number): Promise<SeoAnalysis[]> {
    // Convert the Map values to an array
    const analysesArray = Array.from(this.analyses.values());
    
    // Sort by fetchedAt (most recent first) and limit to specified number
    return analysesArray
      .sort((a, b) => {
        const dateA = a.fetchedAt || new Date(0);
        const dateB = b.fetchedAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  }

  // Helper method to normalize URLs for consistent storage
  private normalizeUrl(url: string): string {
    // Remove protocol and trailing slashes for consistent keys
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
  }
}

export const storage = new MemStorage();
