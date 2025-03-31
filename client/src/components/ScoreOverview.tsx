import { CircleCheck, CircleAlert, AlertCircle, PieChart, ArrowUp, Trophy } from "lucide-react";
import { SeoAnalysis } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface ScoreOverviewProps {
  analysis: SeoAnalysis;
}

export default function ScoreOverview({ analysis }: ScoreOverviewProps) {
  const { score = 0, passing = 0, warnings = 0, missing = 0 } = analysis;
  
  // Count total checks
  const totalChecks = passing + warnings + missing;
  
  // Calculate percentages for each category
  const passingPercent = totalChecks > 0 ? Math.round((passing / totalChecks) * 100) : 0;
  const warningsPercent = totalChecks > 0 ? Math.round((warnings / totalChecks) * 100) : 0;
  const missingPercent = totalChecks > 0 ? Math.round((missing / totalChecks) * 100) : 0;
  
  // Determine score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-error";
  };
  
  // Get status text and color
  const getScoreStatus = (score: number) => {
    if (score >= 90) return { text: "Excellent", color: "text-success" };
    if (score >= 80) return { text: "Good", color: "text-success" };
    if (score >= 60) return { text: "Needs Improvement", color: "text-warning" };
    return { text: "Poor", color: "text-error" };
  };
  
  const scoreStatus = getScoreStatus(score);

  // Calculate stroke dash offset for circular progress
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-primary-600" />
          SEO Score Overview
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          score >= 80 ? "bg-green-100 text-green-800" : 
          score >= 60 ? "bg-yellow-100 text-yellow-800" : 
          "bg-red-100 text-red-800"
        }`}>
          {scoreStatus.text}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex items-center justify-center">
          <div className="relative w-36 h-36">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="8"/>
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke={score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444"} 
                      strokeWidth="8" 
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 50 50)"
                    />
                    <text 
                      x="50" 
                      y="45" 
                      fontSize="28" 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      fontWeight="bold" 
                      className={getScoreColor(score)}
                    >
                      {score}
                    </text>
                    <text 
                      x="50" 
                      y="65" 
                      fontSize="12" 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      fill="#6B7280"
                    >
                      out of 100
                    </text>
                  </svg>
                </TooltipTrigger>
                <TooltipContent side="right" className="p-4 max-w-xs">
                  <div className="space-y-2">
                    <p className="font-medium">SEO Score Breakdown</p>
                    <p className="text-sm">
                      This score evaluates your page's SEO implementation quality based on meta tags presence and optimization.
                    </p>
                    <ul className="text-xs space-y-1 mt-2">
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span>80-100: Excellent SEO implementation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                        <span>60-79: Needs some improvements</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        <span>0-59: Significant improvements needed</span>
                      </li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <p className="text-sm text-gray-600 mb-2">
            Based on {totalChecks} SEO checkpoints across essential meta tags, Open Graph, and Twitter Card properties.
          </p>
        
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <CircleCheck className="h-5 w-5 text-success" />
                    <span className="font-medium text-sm">{passing} Passing</span>
                  </div>
                  <span className="text-sm font-semibold text-success">{passingPercent}%</span>
                </div>
                <Progress value={passingPercent} className="h-1" indicatorClassName="bg-green-500" />
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <CircleAlert className="h-5 w-5 text-warning" />
                    <span className="font-medium text-sm">{warnings} Warnings</span>
                  </div>
                  <span className="text-sm font-semibold text-warning">{warningsPercent}%</span>
                </div>
                <Progress value={warningsPercent} className="h-1" indicatorClassName="bg-yellow-500" />
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-error" />
                    <span className="font-medium text-sm">{missing} Missing</span>
                  </div>
                  <span className="text-sm font-semibold text-error">{missingPercent}%</span>
                </div>
                <Progress value={missingPercent} className="h-1" indicatorClassName="bg-red-500" />
              </CardContent>
            </Card>
          </div>
          
          {score < 80 && (
            <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
              <ArrowUp className="h-4 w-4" />
              <span>Focus on fixing {missing > 0 ? 'missing tags' : 'warnings'} to improve your SEO score</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
