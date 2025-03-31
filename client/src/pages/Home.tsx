import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SeoAnalysis } from "@shared/schema";
import { processMetaTags } from "@/lib/calculateScore";
import UrlForm from "@/components/UrlForm";
import ResultsSection from "@/components/ResultsSection";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function Home() {
  const [analysis, setAnalysis] = useState<SeoAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeUrl = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json();
    },
    onSuccess: (rawData: SeoAnalysis) => {
      // Fully process the raw data on the client side
      // - Extract specific meta tags into appropriate categories
      // - Calculate scores based on the structured data
      const processedData = processMetaTags(rawData);
      
      // Update state with fully processed data
      setAnalysis(processedData);
      
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${rawData.url}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze the URL. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (url: string) => {
    analyzeUrl.mutate(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <UrlForm onSubmit={handleSubmit} isLoading={analyzeUrl.isPending} />
      
      {analyzeUrl.isPending && <LoadingIndicator />}
      
      {!analyzeUrl.isPending && analysis && (
        <ResultsSection analysis={analysis} />
      )}
    </div>
  );
}
