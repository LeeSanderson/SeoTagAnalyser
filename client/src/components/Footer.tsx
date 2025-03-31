export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Meta Tag Analyzer - A tool for SEO professionals</p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">Built with modern web standards</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
