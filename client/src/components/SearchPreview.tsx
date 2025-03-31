import { SeoAnalysis } from "@shared/schema";
import { AlertCircle, AlertTriangle } from "lucide-react";

interface SearchPreviewProps {
  analysis: SeoAnalysis;
}

export default function SearchPreview({ analysis }: SearchPreviewProps) {
  const { url, title, description } = analysis;
  
  // Format URL for display
  const displayUrl = url.replace(/^https?:\/\//, '');
  
  // Calculate optimal content
  const sampleTitle = title && title.length >= 50 
    ? title 
    : title && title.length > 0
      ? `${title} | Official Website for Your Business Needs`
      : "Example Domain | Official Website for Your Business Needs";
  
  const sampleDescription = description && description.length >= 150 
    ? description 
    : "Example Domain provides comprehensive solutions for your business needs. Explore our services, resources, and tools designed to help you succeed in today's competitive market.";
  
  // Calculate title and description status
  const titleStatus = !title 
    ? { icon: <AlertCircle className="text-error h-4 w-4" />, text: "Missing title", severity: "error" }
    : title.length < 50 
      ? { icon: <AlertTriangle className="text-warning h-4 w-4" />, text: `Title is shorter than optimal (${title.length} of recommended 50-60 characters)`, severity: "warning" }
      : title.length > 60
        ? { icon: <AlertTriangle className="text-warning h-4 w-4" />, text: `Title is longer than optimal (${title.length} of recommended 50-60 characters)`, severity: "warning" }
        : null;
        
  const descriptionStatus = !description
    ? { icon: <AlertCircle className="text-error h-4 w-4" />, text: "Missing description", severity: "error" }
    : description.length < 150
      ? { icon: <AlertTriangle className="text-warning h-4 w-4" />, text: `Description is significantly shorter than optimal (${description.length} of recommended 150-160 characters)`, severity: "warning" }
      : description.length > 160
        ? { icon: <AlertTriangle className="text-warning h-4 w-4" />, text: `Description is longer than optimal (${description.length} of recommended 150-160 characters)`, severity: "warning" }
        : null;

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Search Engine Result Preview</h3>
      
      <div className="border rounded-lg overflow-hidden bg-white p-6 mb-6">
        <h4 className="font-medium text-gray-700 mb-4">Google Search Result</h4>
        
        <div className="google-preview bg-white p-4 border rounded">
          <div className="google-title text-blue-700 text-lg hover:underline cursor-pointer">
            {title || "No Title"}
          </div>
          <div className="google-url text-green-700 text-sm">
            {displayUrl}
          </div>
          <div className="google-description mt-1 text-gray-600 text-sm">
            {description || "No description available"}
          </div>
        </div>
        
        <div className="mt-4 text-sm">
          <ul className="space-y-2 text-gray-600">
            {titleStatus && (
              <li className="flex items-start">
                {titleStatus.icon}
                <span className="ml-2">{titleStatus.text}</span>
              </li>
            )}
            {descriptionStatus && (
              <li className="flex items-start">
                {descriptionStatus.icon}
                <span className="ml-2">{descriptionStatus.text}</span>
              </li>
            )}
            {!titleStatus && !descriptionStatus && (
              <li className="flex items-start text-green-600">
                <AlertCircle className="text-success h-4 w-4" />
                <span className="ml-2">Your title and description look great!</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-white p-6">
        <h4 className="font-medium text-gray-700 mb-2">Title & Description Optimization</h4>
        
        <div className="bg-gray-50 border rounded-lg p-4 mb-4">
          <h5 className="font-medium text-sm text-gray-700 mb-2">Sample Optimized Title</h5>
          <p className="text-gray-800 mb-1">{sampleTitle}</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`${sampleTitle.length >= 50 && sampleTitle.length <= 60 ? "bg-success" : "bg-warning"} rounded-full h-2`} 
              style={{ width: `${Math.min(100, (sampleTitle.length / 60) * 100)}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {sampleTitle.length} characters 
            ({sampleTitle.length >= 50 && sampleTitle.length <= 60 ? "Good length" : 
              sampleTitle.length < 50 ? "Too short" : "Too long"})
          </p>
        </div>
        
        <div className="bg-gray-50 border rounded-lg p-4">
          <h5 className="font-medium text-sm text-gray-700 mb-2">Sample Optimized Description</h5>
          <p className="text-gray-800 mb-1">{sampleDescription}</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`${sampleDescription.length >= 150 && sampleDescription.length <= 160 ? "bg-success" : "bg-warning"} rounded-full h-2`} 
              style={{ width: `${Math.min(100, (sampleDescription.length / 160) * 100)}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {sampleDescription.length} characters 
            ({sampleDescription.length >= 150 && sampleDescription.length <= 160 ? "Optimal length" : 
              sampleDescription.length < 150 ? "Too short" : "Too long"})
          </p>
        </div>
      </div>
    </div>
  );
}
