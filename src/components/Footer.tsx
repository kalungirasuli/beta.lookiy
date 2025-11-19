import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 px-6 md:px-12 border-t border-black/5 bg-white/50 backdrop-blur-glass">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="text-sm text-gray-500 mb-4 sm:mb-0">
          © {currentYear} Lookiy. All rights reserved. 
        </div>

     <div className="text-sm text-gray-500 mb-4 sm:mb-0">info@lookiy.net</div> 
        <div className="flex space-x-6">
          <Link 
            href="/policy" 
            className="text-sm text-gray-500 hover:text-accent transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}