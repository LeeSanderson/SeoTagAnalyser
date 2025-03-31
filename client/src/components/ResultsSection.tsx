import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeoAnalysis } from "@shared/schema";
import ScoreOverview from "./ScoreOverview";
import CategorySummary from "./CategorySummary";
import TagAnalysis from "./TagAnalysis";
import SearchPreview from "./SearchPreview";
import SocialPreview from "./SocialPreview";
import { Code, Search, Share, PieChart, BarChart, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsSectionProps {
  analysis: SeoAnalysis;
}

export default function ResultsSection({ analysis }: ResultsSectionProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="space-y-8">
      {/* Overall Score Card */}
      <ScoreOverview analysis={analysis} />
      
      {/* Category Summaries - at-a-glance view of tag categories */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart className="mr-2 h-5 w-5 text-primary-600" />
            SEO Category Breakdown
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm flex items-center gap-1"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show Details
              </>
            )}
          </Button>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          Quick overview of how your site performs across key SEO categories.
        </div>
        
        <CategorySummary analysis={analysis} />
        
        {showDetails && (
          <div className="text-sm text-gray-700 mt-2 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">SEO Best Practices Breakdown:</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li><span className="font-medium">Core Meta Tags:</span> Include title, description, canonical URL, robots, and viewport tags.</li>
              <li><span className="font-medium">Open Graph:</span> Required for proper social sharing on Facebook, LinkedIn, etc. Include og:title, og:description, og:url, and og:image.</li>
              <li><span className="font-medium">Twitter Cards:</span> Optimize how your content appears when shared on Twitter. Include twitter:card, twitter:title, twitter:description, and twitter:image.</li>
            </ul>
          </div>
        )}
      </div>
      
      {/* Detailed Analysis Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <Tabs defaultValue="metaTags" className="w-full">
          <TabsList className="border-b border-gray-200 w-full flex rounded-none h-auto">
            <TabsTrigger 
              value="metaTags" 
              className="px-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 rounded-none font-medium text-sm transition-none"
            >
              <Code className="mr-1 h-4 w-4" />
              Meta Tags
            </TabsTrigger>
            <TabsTrigger 
              value="searchPreview" 
              className="px-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 rounded-none font-medium text-sm transition-none"
            >
              <Search className="mr-1 h-4 w-4" />
              Search Preview
            </TabsTrigger>
            <TabsTrigger 
              value="socialPreview" 
              className="px-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=inactive]:hover:border-gray-300 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 rounded-none font-medium text-sm transition-none"
            >
              <Share className="mr-1 h-4 w-4" />
              Social Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="metaTags" className="p-6">
            <TagAnalysis analysis={analysis} />
          </TabsContent>
          
          <TabsContent value="searchPreview" className="p-6">
            <SearchPreview analysis={analysis} />
          </TabsContent>
          
          <TabsContent value="socialPreview" className="p-6">
            <SocialPreview analysis={analysis} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
