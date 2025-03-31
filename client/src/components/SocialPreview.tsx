import { SeoAnalysis } from "@shared/schema";
import { AlertCircle, Image } from "lucide-react";

interface SocialPreviewProps {
  analysis: SeoAnalysis;
}

export default function SocialPreview({ analysis }: SocialPreviewProps) {
  const { url, ogTags = {}, twitterTags = {} } = analysis;
  
  // Extract OG tags
  const ogTitle = ogTags['og:title'] || '';
  const ogDescription = ogTags['og:description'] || '';
  const ogImage = ogTags['og:image'] || '';
  const ogUrl = ogTags['og:url'] || url;
  
  // Extract Twitter tags
  const twitterTitle = twitterTags['twitter:title'] || '';
  const twitterDescription = twitterTags['twitter:description'] || '';
  const twitterImage = twitterTags['twitter:image'] || '';
  const twitterCard = twitterTags['twitter:card'] || '';
  
  // Calculate display URL (domain only)
  const displayUrl = url.replace(/^https?:\/\//, '').split('/')[0];
  
  // Check completeness
  const hasBasicOgTags = Boolean(ogTitle && ogDescription && ogUrl && ogImage);
  const hasBasicTwitterTags = Boolean(twitterCard && twitterTitle && twitterDescription && twitterImage);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Previews</h3>
      
      {/* Open Graph Tags Section */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
          <div className="flex items-center space-x-2">
            {hasBasicOgTags 
              ? <AlertCircle className="text-success h-5 w-5" /> 
              : ogTitle || ogDescription || ogImage 
                ? <AlertCircle className="text-warning h-5 w-5" />
                : <AlertCircle className="text-error h-5 w-5" />}
            <h4 className="font-medium">Open Graph Tags (Facebook/LinkedIn)</h4>
          </div>
          <div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              hasBasicOgTags 
                ? "bg-green-100 text-success" 
                : ogTitle || ogDescription || ogImage
                  ? "bg-yellow-100 text-warning"
                  : "bg-red-100 text-error"
            }`}>
              {hasBasicOgTags ? 'Complete' : ogTitle || ogDescription || ogImage ? 'Incomplete' : 'Missing'}
            </span>
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
                {!ogTitle && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta property="og:title" content="..."&gt;</code></li>
                )}
                {!ogDescription && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta property="og:description" content="..."&gt;</code></li>
                )}
                {!ogUrl && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta property="og:url" content="..."&gt;</code></li>
                )}
                {!ogImage && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta property="og:image" content="..."&gt;</code></li>
                )}
                {!ogTags['og:type'] && (
                  <li><code className="font-mono bg-gray-100 px-2 py-1 rounded">&lt;meta property="og:type" content="..."&gt;</code></li>
                )}
              </ul>
            </div>
          )}
          
          {/* Facebook Preview */}
          <div className="mt-6">
            <h5 className="font-medium text-gray-700 mb-3">Facebook Preview</h5>
            <div className="facebook-preview border shadow-sm rounded-lg overflow-hidden">
              {ogImage ? (
                <div className="bg-gray-200 h-52 overflow-hidden">
                  <img 
                    src={ogImage} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                      target.parentElement!.classList.add('flex', 'items-center', 'justify-center', 'text-gray-400');
                    }}
                  />
                </div>
              ) : (
                <div className="bg-gray-200 h-52 flex flex-col items-center justify-center text-gray-500">
                  <Image className="h-8 w-8 mb-2" />
                  <div className="text-xs">No og:image provided</div>
                </div>
              )}
              <div className="px-3 py-2">
                <div className="text-sm font-bold">
                  {ogTitle || "No title available"}
                </div>
                <div className="text-xs text-gray-500 mt-1">{displayUrl}</div>
                <div className="text-xs text-gray-700 mt-1">
                  {ogDescription || "No description available"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Twitter Card Tags Section */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
          <div className="flex items-center space-x-2">
            {hasBasicTwitterTags 
              ? <AlertCircle className="text-success h-5 w-5" /> 
              : twitterTitle || twitterDescription || twitterImage
                ? <AlertCircle className="text-warning h-5 w-5" />
                : <AlertCircle className="text-error h-5 w-5" />}
            <h4 className="font-medium">Twitter Card Tags</h4>
          </div>
          <div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              hasBasicTwitterTags 
                ? "bg-green-100 text-success" 
                : twitterTitle || twitterDescription || twitterImage
                  ? "bg-yellow-100 text-warning"
                  : "bg-red-100 text-error"
            }`}>
              {hasBasicTwitterTags ? 'Complete' : twitterTitle || twitterDescription || twitterImage ? 'Incomplete' : 'Missing'}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-700 mb-4">
            {Object.keys(twitterTags).length > 0 ? (
              <>
                <span className="font-medium">Found Tags:</span>
                <ul className="mt-2 space-y-2">
                  {Object.entries(twitterTags).map(([key, value]) => (
                    <li key={key}>
                      <code className="font-mono bg-gray-100 px-2 py-1 rounded">
                        &lt;meta name="{key}" content="{value.length > 50 ? value.slice(0, 50) + '...' : value}"&gt;
                      </code>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>No Twitter Card meta tags found. These tags help control how your content appears when shared on Twitter.</p>
            )}
          </div>
          
          {!hasBasicTwitterTags && (
            <div className="text-sm text-gray-700 mb-4">
              <span className="font-medium">Recommended Tags:</span>
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
          
          {/* Twitter Preview */}
          <div className="mt-6">
            <h5 className="font-medium text-gray-700 mb-3">
              Twitter Preview {!hasBasicTwitterTags && "(Missing)"}
            </h5>
            <div className="twitter-preview border shadow-sm rounded-xl overflow-hidden">
              {twitterImage ? (
                <div className="bg-gray-200 h-52 overflow-hidden">
                  <img 
                    src={twitterImage} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                      target.parentElement!.classList.add('flex', 'items-center', 'justify-center', 'text-gray-400');
                    }}
                  />
                </div>
              ) : (
                <div className="bg-gray-200 h-52 flex flex-col items-center justify-center text-gray-500">
                  <Image className="h-8 w-8 mb-2" />
                  <div className="text-xs">No twitter:image provided</div>
                </div>
              )}
              <div className="px-3 py-2 bg-white">
                <div className={`text-sm font-bold ${!twitterTitle && 'text-gray-400'}`}>
                  {twitterTitle || "No twitter:title provided"}
                </div>
                <div className={`text-xs mt-1 ${!twitterDescription && 'text-gray-400'}`}>
                  {twitterDescription || "No twitter:description provided"}
                </div>
                <div className="text-xs text-gray-500 mt-1">{displayUrl}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendations Section */}
      <div className="border rounded-lg overflow-hidden bg-gray-50">
        <div className="px-4 py-3 border-b">
          <h4 className="font-medium">Social Media Tag Recommendations</h4>
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-700">
            <p className="mb-3">Implementing complete social media tags will significantly improve how your content appears when shared:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Add all required Open Graph tags for Facebook and LinkedIn sharing</li>
              <li>Implement Twitter Card tags for better Twitter sharing experience</li>
              <li>Use high-quality images with proper dimensions (1200×630px for OG, 1200×675px for Twitter)</li>
              <li>Ensure descriptions are compelling and contain relevant keywords</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
