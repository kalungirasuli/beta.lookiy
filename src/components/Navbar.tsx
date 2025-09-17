'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="w-full">
      <nav className="bg-white border-b border-b-black/20 px-6 md:px-12 py-5 w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src={"/logomin.svg"} alt='Lookiy' width={251} height={114} className="w-[70px] h-auto" />
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href="/Homecoming#waitlist" 
            className="text-base font-bold text-white px-5 py-2.5 rounded-xl bg-orange-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
          >
            Join waiting list
          </Link>
          <Link 
            href="/support" 
            className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors"
          >
            Support
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center text-white p-2 rounded-xl bg-orange-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
          aria-label="Toggle mobile menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-black/20 shadow-lg z-50">
            <div className="flex flex-col space-y-4 p-6">
              <Link 
                href="/Homecoming#waitlist" 
                className="inline-block text-base font-bold text-white px-5 py-2.5 rounded-xl bg-orange-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150"
              >
                Join waiting list
              </Link>
              <Link 
                href="/support" 
                className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}