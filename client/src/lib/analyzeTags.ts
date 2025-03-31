import { SeoAnalysis } from "@shared/schema";

// Helper functions for analyzing meta tags
export function getTitleFeedback(title: string | undefined): { 
  isOptimal: boolean; 
  message: string;
  percentComplete: number;
} {
  if (!title) {
    return {
      isOptimal: false,
      message: "Missing title tag. Add a descriptive title.",
      percentComplete: 0
    };
  }

  const length = title.length;
  const isOptimal = length >= 50 && length <= 60;
  
  if (length < 50) {
    return {
      isOptimal: false,
      message: `Title is too short (${length} chars). Aim for 50-60 characters.`,
      percentComplete: Math.min(100, (length / 50) * 100)
    };
  }
  
  if (length > 60) {
    return {
      isOptimal: false,
      message: `Title exceeds recommended length (${length} chars). May be truncated in search results.`,
      percentComplete: 100 - Math.min(40, ((length - 60) / 20) * 40)
    };
  }
  
  return {
    isOptimal: true,
    message: `Great! Title length (${length} chars) is optimal.`,
    percentComplete: 100
  };
}

export function getDescriptionFeedback(description: string | undefined): { 
  isOptimal: boolean; 
  message: string;
  percentComplete: number;
} {
  if (!description) {
    return {
      isOptimal: false,
      message: "Missing meta description tag. Add a compelling description.",
      percentComplete: 0
    };
  }

  const length = description.length;
  const isOptimal = length >= 150 && length <= 160;
  
  if (length < 150) {
    return {
      isOptimal: false,
      message: `Description is too short (${length} chars). Aim for 150-160 characters.`,
      percentComplete: Math.min(100, (length / 150) * 100)
    };
  }
  
  if (length > 160) {
    return {
      isOptimal: false,
      message: `Description exceeds recommended length (${length} chars). May be truncated in search results.`,
      percentComplete: 100 - Math.min(40, ((length - 160) / 30) * 40)
    };
  }
  
  return {
    isOptimal: true,
    message: `Great! Description length (${length} chars) is optimal.`,
    percentComplete: 100
  };
}

// Analyze OG tags completeness
export function getOgTagsFeedback(ogTags: Record<string, string> | undefined): {
  isComplete: boolean;
  missingTags: string[];
  completionPercentage: number;
} {
  if (!ogTags || Object.keys(ogTags).length === 0) {
    return {
      isComplete: false,
      missingTags: ['og:title', 'og:description', 'og:url', 'og:image', 'og:type'],
      completionPercentage: 0
    };
  }
  
  const requiredTags = ['og:title', 'og:description', 'og:url', 'og:image'];
  const missingTags = requiredTags.filter(tag => !ogTags[tag]);
  
  const completionPercentage = Math.round(
    ((requiredTags.length - missingTags.length) / requiredTags.length) * 100
  );
  
  return {
    isComplete: missingTags.length === 0,
    missingTags,
    completionPercentage
  };
}

// Analyze Twitter tags completeness
export function getTwitterTagsFeedback(twitterTags: Record<string, string> | undefined): {
  isComplete: boolean;
  missingTags: string[];
  completionPercentage: number;
} {
  if (!twitterTags || Object.keys(twitterTags).length === 0) {
    return {
      isComplete: false,
      missingTags: ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'],
      completionPercentage: 0
    };
  }
  
  const requiredTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
  const missingTags = requiredTags.filter(tag => !twitterTags[tag]);
  
  const completionPercentage = Math.round(
    ((requiredTags.length - missingTags.length) / requiredTags.length) * 100
  );
  
  return {
    isComplete: missingTags.length === 0,
    missingTags,
    completionPercentage
  };
}
