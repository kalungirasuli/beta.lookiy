'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  finishLoading: () => void;
}

export default function SplashScreen({ finishLoading }: SplashScreenProps) {
  const [loadingText, setLoadingText] = useState('Loading');
  
  // Simulate loading with dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === 'Loading...') return 'Loading';
        return prev + '.';
      });
    }, 500);
    
    // Simulate loading completion after 3 seconds
    const timer = setTimeout(() => {
      clearInterval(interval);
      finishLoading();
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [finishLoading]);
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
        >
          <Image 
            src="/logo.svg" 
            alt="Lookiy Logo" 
            fill
            priority
            className="object-contain"
          />
        </motion.div>
        
        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg sm:text-xl font-medium text-gray-700"
        >
          {loadingText}
        </motion.div>
        
        {/* Loading spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-3 sm:border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      </div>
    </motion.div>
  );
}