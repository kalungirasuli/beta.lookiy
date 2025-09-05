import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <div className="w-full flex justify-center py-3 sm:py-4 px-4 sm:px-6">
      <nav className="bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl px-6 py-3 flex justify-between items-center max-w-4xl w-full">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-orange-500 transition-colors">
              Lookiy
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href="/login" 
            className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/signup" 
            className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors"
          >
            Sign Up
          </Link>
          <Link 
            href="/help" 
            className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors"
          >
            Help
          </Link>
          <Link 
            href="/support" 
            className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors"
          >
            Support
          </Link>
        </div>
        
        {/* Mobile menu button - would implement dropdown functionality in a real app */}
        <button className="md:hidden flex items-center text-gray-900 hover:text-orange-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </nav>
    </div>
  );
}