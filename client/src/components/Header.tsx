import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="text-primary-600 h-5 w-5" />
          <h1 className="text-xl font-semibold text-gray-900">Meta Tag Analyzer</h1>
        </div>
        <div>
          <span className="hidden sm:inline text-sm text-gray-500">Check and analyze SEO meta tags for any website</span>
        </div>
      </div>
    </header>
  );
}
