import { Link } from "react-router";

export function Header() {
  return (
    <header className="sticky top-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
          Logo
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            to="/demo"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
