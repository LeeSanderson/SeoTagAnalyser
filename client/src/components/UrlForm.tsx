import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { UrlAnalysisRequest, urlAnalysisRequestSchema } from "@shared/schema";
import { z } from "zod";

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Add https:// prefix if not present
    const formattedUrl = url.trim().match(/^https?:\/\//) ? url.trim() : `https://${url.trim()}`;

    try {
      // Validate URL format
      urlAnalysisRequestSchema.parse({ url: formattedUrl });
      onSubmit(formattedUrl);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = err.errors[0]?.message || "Please enter a valid URL";
        setError(errorMessage);
        toast({
          title: "Invalid URL",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">SEO Meta Tag Analyzer</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="urlInput" className="block text-sm font-medium text-gray-700 mb-2">
            Enter a website URL to analyze:
          </label>
          
          {/* Input with attached analyze button */}
          <div className="flex">
            <div className="flex-grow flex rounded-l-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                https://
              </span>
              <Input
                type="text"
                id="urlInput"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 block w-full rounded-none text-sm border-r-0"
                placeholder="example.com"
                aria-invalid={error ? "true" : "false"}
                aria-label="Enter website URL"
              />
            </div>
            
            {/* Analyze button positioned right after the input */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="rounded-l-none rounded-r-md bg-black hover:bg-gray-800 text-white px-4 py-2 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:outline-none"
              aria-label="Analyze URL for SEO meta tags"
            >
              <Search className="mr-2 h-4 w-4 text-white" />
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
          
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
        
        <div className="text-sm text-gray-600 mt-2">
          Enter any website URL and click the <strong>Analyze</strong> button to check SEO meta tags and receive recommendations.
        </div>
      </form>
      
      {/* Instructions section with improved accessibility */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg" aria-labelledby="how-to-use-heading">
        <h3 id="how-to-use-heading" className="text-sm font-medium text-gray-800 mb-2">How to use this tool:</h3>
        <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
          <li>Enter a valid website URL in the field above</li>
          <li>Click the <strong>Analyze</strong> button</li>
          <li>Review the SEO analysis results and recommendations</li>
        </ol>
      </div>
    </div>
  );
}
