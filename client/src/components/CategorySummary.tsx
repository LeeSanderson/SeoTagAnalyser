import { SeoAnalysis } from "@shared/schema";
import { 
  getDescriptionFeedback, 
  getOgTagsFeedback, 
  getTitleFeedback, 
  getTwitterTagsFeedback 
} from "@/lib/analyzeTags";
import { CheckCircle, AlertTriangle, AlertCircle, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CategorySummaryProps {
  analysis: SeoAnalysis;
}

export default function CategorySummary({ analysis }: CategorySummaryProps) {
  const {
    title,
    description,
    canonical,
    robots,
    viewport,
    ogTags = {},
    twitterTags = {}
  } = analysis;

  // Calculate meta tags scores
  const titleFeedback = getTitleFeedback(title);
  const descriptionFeedback = getDescriptionFeedback(description);
  const ogTagsFeedback = getOgTagsFeedback(ogTags);
  const twitterTagsFeedback = getTwitterTagsFeedback(twitterTags);
  
  // Check essential tags
  const hasCanonical = Boolean(canonical);
  const hasRobots = Boolean(robots);
  const hasViewport = Boolean(viewport);
  
  // Calculate core meta tags completion percentage
  const coreTags = [
    { name: "Title", exists: Boolean(title), optimal: titleFeedback.isOptimal },
    { name: "Description", exists: Boolean(description), optimal: descriptionFeedback.isOptimal },
    { name: "Canonical", exists: hasCanonical, optimal: hasCanonical },
    { name: "Robots", exists: hasRobots, optimal: hasRobots },
    { name: "Viewport", exists: hasViewport, optimal: hasViewport }
  ];
  
  const coreTagsTotal = coreTags.length;
  const coreTagsPresent = coreTags.filter(tag => tag.exists).length;
  const coreTagsOptimal = coreTags.filter(tag => tag.optimal).length;
  const coreTagsPercentage = Math.round((coreTagsPresent / coreTagsTotal) * 100);
  const coreTagsOptimalPercentage = Math.round((coreTagsOptimal / coreTagsTotal) * 100);
  
  // Determine status icons and colors
  const getStatusInfo = (percentage: number) => {
    if (percentage >= 80) {
      return { 
        icon: <CheckCircle className="h-5 w-5 text-success" />, 
        color: "text-success",
        className: "bg-green-500"
      };
    } else if (percentage >= 40) {
      return { 
        icon: <AlertTriangle className="h-5 w-5 text-warning" />, 
        color: "text-warning",
        className: "bg-yellow-500"
      };
    } else {
      return { 
        icon: <AlertCircle className="h-5 w-5 text-error" />, 
        color: "text-error",
        className: "bg-red-500"
      };
    }
  };
  
  const coreStatus = getStatusInfo(coreTagsPercentage);
  const ogStatus = getStatusInfo(ogTagsFeedback.completionPercentage);
  const twitterStatus = getStatusInfo(twitterTagsFeedback.completionPercentage);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Core Meta Tags Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Core Meta Tags
            </CardTitle>
            {coreStatus.icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion:</span> 
              <span className={coreStatus.color}>{coreTagsPercentage}%</span>
            </div>
            <Progress 
              value={coreTagsPercentage} 
              className="h-2"
              indicatorClassName={coreStatus.className}
            />
            <div className="text-xs text-gray-500 mt-2">
              {coreTagsPresent} of {coreTagsTotal} tags implemented
              {coreTagsOptimal < coreTagsPresent && 
                `, ${coreTagsOptimal} optimally`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Graph Tags Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Social Media (OG)
            </CardTitle>
            {ogStatus.icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion:</span> 
              <span className={ogStatus.color}>
                {ogTagsFeedback.completionPercentage}%
              </span>
            </div>
            <Progress 
              value={ogTagsFeedback.completionPercentage} 
              className="h-2"
              indicatorClassName={ogStatus.className}
            />
            <div className="text-xs text-gray-500 mt-2">
              {ogTagsFeedback.missingTags.length === 0 
                ? "All required OG tags present" 
                : `Missing: ${ogTagsFeedback.missingTags.length} tags`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Twitter Card Tags */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Twitter Cards
            </CardTitle>
            {twitterStatus.icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion:</span> 
              <span className={twitterStatus.color}>
                {twitterTagsFeedback.completionPercentage}%
              </span>
            </div>
            <Progress 
              value={twitterTagsFeedback.completionPercentage} 
              className="h-2"
              indicatorClassName={twitterStatus.className}
            />
            <div className="text-xs text-gray-500 mt-2">
              {twitterTagsFeedback.missingTags.length === 0 
                ? "All required Twitter tags present" 
                : `Missing: ${twitterTagsFeedback.missingTags.length} tags`}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}