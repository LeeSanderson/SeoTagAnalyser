import { SeoAnalysis } from "@shared/schema";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TagAnalysisProps {
  analysis: SeoAnalysis;
}

export default function TagAnalysis({ analysis }: TagAnalysisProps) {
  const {
    title,
    description,
    canonical,
    robots,
    viewport,
    ogTags = {},
    twitterTags = {}
  } = analysis;

  // Helper functions for tag status
  const getTagStatus = (
    value: string | undefined, 
    criteria: { minLength?: number; maxLength?: number; required?: boolean }
  ): { status: 'optimal' | 'needsImprovement' | 'missing', icon: React.ReactNode, message: string } => {
    if (!value) {
      return { 
        status: 'missing', 
        icon: <AlertCircle className="text-error h-5 w-5" />, 
        message: criteria.required ? 'Required tag is missing' : 'Optional tag is missing' 
      };
    }
    
    if (criteria.minLength && criteria.maxLength) {
      const length = value.length;
      if (length >= criteria.minLength && length <= criteria.maxLength) {
        return { 
          status: 'optimal', 
          icon: <CheckCircle className="text-success h-5 w-5" />, 
          message: 'Optimal length' 
        };
      }
      return { 
        status: 'needsImprovement', 
        icon: <AlertTriangle className="text-warning h-5 w-5" />, 
        message: length < criteria.minLength ? 'Too short' : 'Too long' 
      };
    }
    
    return { 
      status: 'optimal', 
      icon: <CheckCircle className="text-success h-5 w-5" />, 
      message: 'Present' 
    };
  };

  // Get status for each tag
  const titleStatus = getTagStatus(title, { minLength: 50, maxLength: 60, required: true });
  const descriptionStatus = getTagStatus(description, { minLength: 150, maxLength: 160, required: true });
  const canonicalStatus = getTagStatus(canonical, { required: true });
  const robotsStatus = getTagStatus(robots, { required: true });
  const viewportStatus = getTagStatus(viewport, { required: true });

  // Calculate OG and Twitter tag completeness
  const hasBasicOgTags = Boolean(ogTags['og:title'] && ogTags['og:description'] && ogTags['og:url'] && ogTags['og:image']);
  const hasBasicTwitterTags = Boolean(twitterTags['twitter:card'] && twitterTags['twitter:title'] && twitterTags['twitter:description']);
  
  const ogStatus = hasBasicOgTags 
    ? { status: 'optimal', icon: <CheckCircle className="text-success h-5 w-5" />, message: 'Complete' }
    : Object.keys(ogTags).length > 0 
      ? { status: 'needsImprovement', icon: <AlertTriangle className="text-warning h-5 w-5" />, message: 'Incomplete' }
      : { status: 'missing', icon: <AlertCircle className="text-error h-5 w-5" />, message: 'Missing' };
      
  const twitterStatus = hasBasicTwitterTags
    ? { status: 'optimal', icon: <CheckCircle className="text-success h-5 w-5" />, message: 'Complete' }
    : Object.keys(twitterTags).length > 0
      ? { status: 'needsImprovement', icon: <AlertTriangle className="text-warning h-5 w-5" />, message: 'Incomplete' }
      : { status: 'missing', icon: <AlertCircle className="text-error h-5 w-5" />, message: 'Missing' };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Core Meta Tags</h3>
      
      {/* Title Tag */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
          <div className="flex items-center space-x-2">
            {titleStatus.icon}
            <h4 className="font-medium">Title Tag</h4>
          </div>
          <div>
            <Badge className={
              titleStatus.status === 'optimal' ? "bg-green-100 text-success hover:bg-green-100" : 
              titleStatus.status === 'needsImprovement' ? "bg-yellow-100 text-warning hover:bg-yellow-100" : 
              "bg-red-100 text-error hover:bg-red-100"
            }>
              {titleStatus.status === 'optimal' ? 'Optimal' : 
               titleStatus.status === 'needsImprovement' ? 'Needs Improvement' : 
               'Missing'}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-3">
            <code className="font-mono bg-gray-100 text-sm px-2 py-1 rounded">
              {title ? `<title>${title}</title>` : 'No title tag found'}
            </code>
          </div>
          {title && (
            <div className="text-sm text-gray-600 mb-2">
              <div className="flex items-start space-x-2">
                <Info className="text-gray-400 h-4 w-4 mt-0.5" />
                <div>
                  <p>Length: {title.length} characters (Recommended: 50-60 characters)</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className={`${
                      titleStatus.status === 'optimal' ? "bg-success" : 
                      titleStatus.status === 'needsImprovement' ? "bg-warning" : 
                      "bg-error"
                    } rounded-full h-2`} 
                    style={{ width: `${Math.min(100, (title.length / 60) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="text-sm text-gray-700">
            <span className="font-medium">Recommendation:</span> {
              !title ? 'Add a descriptive, keyword-rich title tag between 50-60 characters.' :
              title.length < 50 ? 'Your title is shorter than optimal. Consider expanding to include keywords.' :
              title.length > 60 ? 'Your title is longer than optimal. Search engines may truncate it. Consider shortening it.' :
              'Great! Your title is optimal length.'
            }
          </div>
        </div>
      </div>

      {/* Meta Description */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
          <div className="flex items-center space-x-2">
            {descriptionStatus.icon}
            <h4 className="font-medium">Meta Description</h4>
          </div>
          <div>
            <Badge className={
              descriptionStatus.status === 'optimal' ? "bg-green-100 text-success hover:bg-green-100" : 
              descriptionStatus.status === 'needsImprovement' ? "bg-yellow-100 text-warning hover:bg-yellow-100" : 
              "bg-red-100 text-error hover:bg-red-100"
            }>
              {descriptionStatus.status === 'optimal' ? 'Optimal' : 
               descriptionStatus.status === 'needsImprovement' ? 'Needs Improvement' : 
               'Missing'}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-3">
            <code className="font-mono bg-gray-100 text-sm px-2 py-1 rounded">
              {description 
                ? `<meta name="description" content="${description}">` 
                : 'No meta description found'}
            </code>
          </div>
          {description && (
            <div className="text-sm text-gray-600 mb-2">
              <div className="flex items-start space-x-2">
                <Info className="text-gray-400 h-4 w-4 mt-0.5" />
                <div>
                  <p>Length: {description.length} characters (Recommended: 150-160 characters)</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className={`${
                      descriptionStatus.status === 'optimal' ? "bg-success" : 
                      descriptionStatus.status === 'needsImprovement' ? "bg-warning" : 
                      "bg-error"
                    } rounded-full h-2`} 
                    style={{ width: `${Math.min(100, (description.length / 160) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="text-sm text-gray-700">
            <span className="font-medium">Recommendation:</span> {
              !description ? 'Add a compelling meta description tag between 150-160 characters that summarizes your page content.' :
              description.length < 150 ? 'Description is too short. Add more detailed, keyword-rich content that accurately describes your page.' :
              description.length > 160 ? 'Description is too long. Search engines may truncate it. Consider shortening it.' :
              'Great! Your description is optimal length.'
            }
          </div>
        </div>
      </div>

      {/* Canonical Tag */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
          <div className="flex items-center space-x-2">
            {canonicalStatus.icon}
            <h4 className="font-medium">Canonical URL</h4>
          </div>
          <div>
            <Badge className={
              canonicalStatus.status === 'optimal' ? "bg-green-100 text-success hover:bg-green-100" : 
              canonicalStatus.status === 'needsImprovement' ? "bg-yellow-100 text-warning hover:bg-yellow-100" : 
              "bg-red-100 text-error hover:bg-red-100"
            }>
              {canonicalStatus.status === 'optimal' ? 'Optimal' : 
               canonicalStatus.status === 'needsImprovement' ? 'Needs Improvement' : 
               'Missing'}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-3">
            <code className="font-mono bg-gray-100 text-sm px-2 py-1 rounded">
              {canonical 
                ? `<link rel="canonical" href="${canonical}">` 
                : 'No canonical link found'}
            </code>
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-medium">Notes:</span> {
              canonical 
                ? 'Canonical tag correctly implemented to avoid duplicate content issues.' 
                : 'Add a canonical tag to specify the preferred URL for this page and avoid duplicate content issues.'
            }
          </div>
        </div>
      </div>

      {/* Robots Tag */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
          <div className="flex items-center space-x-2">
            {robotsStatus.icon}
            <h4 className="font-medium">Robots Tag</h4>
          </div>
          <div>
            <Badge className={
              robotsStatus.status === 'optimal' ? "bg-green-100 text-success hover:bg-green-100" : 
              robotsStatus.status === 'needsImprovement' ? "bg-yellow-100 text-warning hover:bg-yellow-100" : 
              "bg-red-100 text-error hover:bg-red-100"
            }>
              {robotsStatus.status === 'optimal' ? 'Present' : 'Missing'}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-3">
            <code className="font-mono bg-gray-100 text-sm px-2 py-1 rounded text-gray-800">
              {robots ? `<meta name="robots" content="${robots}">` : 'No robots meta tag found'}
            </code>
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-medium">Recommendation:</span> {
              robots 
                ? `Current setting "${robots}" ${robots.includes('noindex') ? 'prevents search engines from indexing this page.' : 'allows search engines to index and follow links on this page.'}` 
                : 'Add a robots meta tag to control search engine crawling and indexing:'
            }
            {!robots && (
              <code className="font-mono block bg-gray-100 text-sm px-2 py-1 rounded mt-2">
                &lt;meta name="robots" content="index, follow"&gt;
              </code>
            )}
          </div>
        </div>
      </div>

      {/* Viewport Tag */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
          <div className="flex items-center space-x-2">
            {viewportStatus.icon}
            <h4 className="font-medium">Viewport Tag</h4>
          </div>
          <div>
            <Badge className={
              viewportStatus.status === 'optimal' ? "bg-green-100 text-success hover:bg-green-100" :
              "bg-red-100 text-error hover:bg-red-100"
            }>
              {viewportStatus.status === 'optimal' ? 'Present' : 'Missing'}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-3">
            <code className="font-mono bg-gray-100 text-sm px-2 py-1 rounded">
              {viewport 
                ? `<meta name="viewport" content="${viewport}">` 
                : 'No viewport meta tag found'}
            </code>
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-medium">Notes:</span> {
              viewport 
                ? 'Viewport meta tag is properly set for responsive design.' 
                : 'Add a viewport meta tag to ensure proper display on mobile devices:'
            }
            {!viewport && (
              <code className="font-mono block bg-gray-100 text-sm px-2 py-1 rounded mt-2">
                &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
              </code>
            )}
          </div>
        </div>
      </div>

      {/* Open Graph Tags Summary */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
          <div className="flex items-center space-x-2">
            {ogStatus.icon}
            <h4 className="font-medium">Open Graph Tags (Facebook/LinkedIn)</h4>
          </div>
          <div>
            <Badge className={
              ogStatus.status === 'optimal' ? "bg-green-100 text-success hover:bg-green-100" : 
              ogStatus.status === 'needsImprovement' ? "bg-yellow-100 text-warning hover:bg-yellow-100" : 
              "bg-red-100 text-error hover:bg-red-100"
            }>
              {ogStatus.message}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-700 mb-4">
            <span className="font-medium">Found Tags:</span>
            {Object.keys(ogTags).length > 0 ? (
              <ul className="mt-2 space-y-2">
                {Object.entries(ogTags).map(([key, value]) => (
                  <li key={key}>
                    <code className="font-mono bg-gray-100 px-2 py-1 rounded">
                      &lt;meta property="{key}" content="{value.length > 50 ? value.slice(0, 50) + '...' : value}"&gt;
                    </code>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-gray-500">No Open Graph tags found</p>
            )}
          </div>
          
          {!hasBasicOgTags && (
            <div className="text-sm text-gray-700 mb-4">
              <span className="font-medium">Missing Tags:</span>
              <ul className="mt-2 space-y-2 text-gray-500">
                {!ogTags['og:title'] && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta property="og:title" content="..."&gt;</code></li>
                )}
                {!ogTags['og:description'] && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta property="og:description" content="..."&gt;</code></li>
                )}
                {!ogTags['og:url'] && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta property="og:url" content="..."&gt;</code></li>
                )}
                {!ogTags['og:image'] && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta property="og:image" content="..."&gt;</code></li>
                )}
                {!ogTags['og:type'] && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta property="og:type" content="..."&gt;</code></li>
                )}
              </ul>
            </div>
          )}
          
          <div className="text-sm text-gray-700">
            <span className="font-medium">Recommendation:</span> {
              hasBasicOgTags 
                ? 'All essential Open Graph tags are present. Good job!' 
                : Object.keys(ogTags).length > 0
                  ? 'Complete the missing Open Graph tags to improve sharing on Facebook, LinkedIn, and other platforms.' 
                  : 'Add Open Graph tags to control how your content appears when shared on social media.'
            }
          </div>
        </div>
      </div>

      {/* Twitter Card Tags Summary */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
          <div className="flex items-center space-x-2">
            {twitterStatus.icon}
            <h4 className="font-medium">Twitter Card Tags</h4>
          </div>
          <div>
            <Badge className={
              twitterStatus.status === 'optimal' ? "bg-green-100 text-success hover:bg-green-100" : 
              twitterStatus.status === 'needsImprovement' ? "bg-yellow-100 text-warning hover:bg-yellow-100" : 
              "bg-red-100 text-error hover:bg-red-100"
            }>
              {twitterStatus.message}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-700 mb-4">
            <span className="font-medium">Found Tags:</span>
            {Object.keys(twitterTags).length > 0 ? (
              <ul className="mt-2 space-y-2">
                {Object.entries(twitterTags).map(([key, value]) => (
                  <li key={key}>
                    <code className="font-mono bg-gray-100 px-2 py-1 rounded">
                      &lt;meta name="{key}" content="{value.length > 50 ? value.slice(0, 50) + '...' : value}"&gt;
                    </code>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-gray-500">No Twitter Card tags found</p>
            )}
          </div>
          
          {!hasBasicTwitterTags && (
            <div className="text-sm text-gray-700 mb-4">
              <span className="font-medium">Missing Tags:</span>
              <ul className="mt-2 space-y-2 text-gray-500">
                {!twitterTags['twitter:card'] && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta name="twitter:card" content="summary_large_image"&gt;</code></li>
                )}
                {!twitterTags['twitter:title'] && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta name="twitter:title" content="..."&gt;</code></li>
                )}
                {!twitterTags['twitter:description'] && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta name="twitter:description" content="..."&gt;</code></li>
                )}
                {!twitterTags['twitter:image'] && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta name="twitter:image" content="..."&gt;</code></li>
                )}
              </ul>
            </div>
          )}
          
          <div className="text-sm text-gray-700">
            <span className="font-medium">Recommendation:</span> {
              hasBasicTwitterTags
                ? 'All essential Twitter Card tags are present. Good job!'
                : Object.keys(twitterTags).length > 0
                  ? 'Complete the missing Twitter Card tags to improve sharing on Twitter.'
                  : 'Add Twitter Card tags to control how your content appears when shared on Twitter.'
            }
          </div>
        </div>
      </div>
    </div>
  );
}
