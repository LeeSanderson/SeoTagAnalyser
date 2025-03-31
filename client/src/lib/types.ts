// This file defines types used in the client application

import { SeoAnalysis } from "@shared/schema";

// Feedback type for tag analysis
export interface TagFeedback {
  isOptimal: boolean;
  message: string;
  percentComplete: number;
}

// Result categories for tags
export type TagStatus = 'optimal' | 'needsImprovement' | 'missing';

// Props for a tag analysis component
export interface TagAnalysisCardProps {
  title: string;
  value: string | undefined;
  status: TagStatus;
  recommendation: string;
  content?: React.ReactNode;
}

// Extension of SeoAnalysis with UI-specific properties
export interface ExtendedSeoAnalysis extends SeoAnalysis {
  titleFeedback?: TagFeedback;
  descriptionFeedback?: TagFeedback;
  ogTagsFeedback?: {
    isComplete: boolean;
    missingTags: string[];
    completionPercentage: number;
  };
  twitterTagsFeedback?: {
    isComplete: boolean;
    missingTags: string[];
    completionPercentage: number;
  };
}
