import { SeoAnalysis } from "@shared/schema";

// Process raw meta tags from server into structured format
export function processMetaTags(rawData: SeoAnalysis): SeoAnalysis {
  // Extract meta tags from the raw data
  const metaTags = rawData.metaTags || {};
  
  // Extract common meta tags
  const description = metaTags['description'];
  const robots = metaTags['robots'];
  const viewport = metaTags['viewport'];
  
  // Extract canonical URL - server now includes this in the metaTags
  // even though it's technically from a link element, not a meta tag
  const canonical = metaTags['canonical'];
  
  // Categorize Open Graph tags
  const ogTags: Record<string, string> = {};
  // Twitter Card tags
  const twitterTags: Record<string, string> = {};
  // Other meta tags
  const otherTags: Record<string, string> = {};
  
  // Process all meta tags into appropriate categories
  Object.entries(metaTags).forEach(([key, value]) => {
    if (key.startsWith('og:')) {
      ogTags[key] = value;
    } else if (key.startsWith('twitter:')) {
      twitterTags[key] = value;
    } else if (!['description', 'viewport', 'robots', 'canonical'].includes(key)) {
      otherTags[key] = value;
    }
  });
  
  // Create a structured data object with all the processed tags
  const structuredData: SeoAnalysis = {
    ...rawData,
    description,
    canonical,
    robots,
    viewport,
    ogTags,
    twitterTags,
    otherTags
  };
  
  // Calculate scores
  const { score, passing, warnings, missing } = calculateScore(structuredData);
  
  // Return fully processed data
  return {
    ...structuredData,
    score,
    passing,
    warnings,
    missing
  };
}

// Calculate SEO score based on meta tag presence and quality
export function calculateScore(analysis: Partial<SeoAnalysis>): {
  score: number;
  passing: number;
  warnings: number;
  missing: number;
} {
  let totalPoints = 0;
  let earnedPoints = 0;
  let passing = 0;
  let warnings = 0;
  let missing = 0;
  
  // Title checks (20 points)
  totalPoints += 20;
  if (analysis.title) {
    const titleLength = analysis.title.length;
    if (titleLength >= 50 && titleLength <= 60) {
      earnedPoints += 20;
      passing++;
    } else if (titleLength > 0) {
      earnedPoints += 10;
      warnings++;
    } else {
      missing++;
    }
  } else {
    missing++;
  }
  
  // Description checks (20 points)
  totalPoints += 20;
  if (analysis.description) {
    const descLength = analysis.description.length;
    if (descLength >= 140 && descLength <= 160) {
      earnedPoints += 20;
      passing++;
    } else if (descLength > 0) {
      earnedPoints += 10;
      warnings++;
    } else {
      missing++;
    }
  } else {
    missing++;
  }
  
  // Canonical URL (10 points)
  totalPoints += 10;
  if (analysis.canonical) {
    earnedPoints += 10;
    passing++;
  } else {
    missing++;
  }
  
  // Robots meta (10 points)
  totalPoints += 10;
  if (analysis.robots) {
    earnedPoints += 10;
    passing++;
  } else {
    missing++;
  }
  
  // Viewport meta (10 points)
  totalPoints += 10;
  if (analysis.viewport) {
    earnedPoints += 10;
    passing++;
  } else {
    missing++;
  }
  
  // Open Graph tags (15 points)
  totalPoints += 15;
  const ogCount = Object.keys(analysis.ogTags || {}).length;
  if (ogCount >= 4) {
    earnedPoints += 15;
    passing++;
  } else if (ogCount > 0) {
    earnedPoints += ogCount * 3;
    warnings++;
  } else {
    missing++;
  }
  
  // Twitter Card tags (15 points)
  totalPoints += 15;
  const twitterCount = Object.keys(analysis.twitterTags || {}).length;
  if (twitterCount >= 4) {
    earnedPoints += 15;
    passing++;
  } else if (twitterCount > 0) {
    earnedPoints += twitterCount * 3;
    warnings++;
  } else {
    missing++;
  }
  
  // Calculate final score (0-100)
  const score = Math.round((earnedPoints / totalPoints) * 100);
  
  return { score, passing, warnings, missing };
}