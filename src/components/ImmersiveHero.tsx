'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ImmersiveHero() {
  // Ref for the section to track when it's in view
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // List of vibe words with their respective colors
  const vibeWords = [
    { text: "Discover", color: "text-blue-500" },
    { text: "Join", color: "text-green-500" },
    { text: "Engage", color: "text-purple-500" },
    { text: "Match", color: "text-red-500" }
  ];
  
  // State to track current word index
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  // Effect to cycle through words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % vibeWords.length);
    }, 2000); // Change word every 2 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // No initialization needed as we're removing the grid boxes

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const floatingIconVariants = {
    float: {
      y: [0, -15, 0],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
  };

  return (
    <section className="w-full min-h-screen py-10 md:py-16 lg:py-24 px-4 md:px-6 lg:px-12 flex flex-col items-center justify-center relative" ref={sectionRef}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50 to-white opacity-70 -z-10"></div>
      
      {/* Grid background */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        <div className="w-full h-full grid grid-cols-6 grid-rows-6 opacity-20 gap-0">
          {Array.from({ length: 36 }).map((_, index) => (
            <div 
              key={index} 
              className="border border-gray-300 flex items-center justify-center bg-white bg-opacity-5"
            ></div>
          ))}
        </div>
      </div>
      
      {/* Animated content container */}
      <motion.div
        className="max-w-5xl mx-auto text-center mb-12 animate-fade-in"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-8xl font-bold mb-4 md:mb-8 text-black tracking-tight">
          <motion.span 
            className={`inline-block text-5xl sm:text-6xl md:text-7xl xl:text-9xl ${vibeWords[currentWordIndex].color}`}
            key={currentWordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {vibeWords[currentWordIndex].text}
          </motion.span>
          <div className="h-6 md:h-8 lg:h-10"></div>
          <br/>
          your vibe from <span className="text-yellow-500">today</span>
        </h1>
        <motion.p 
          className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto px-2"
          variants={itemVariants}
        >
          Connect with your perfect vibe and discover networks that match your energy.
        </motion.p>
        
        {/* CTA Button */}
        <motion.div 
          className="flex justify-center mt-8"
          variants={itemVariants}
        >
          <motion.a 
            href="#waitlist"
            className="text-xl sm:text-2xl font-bold text-white px-8 py-4 rounded-xl bg-orange-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Be first to know
          </motion.a>
        </motion.div>
      </motion.div>

      {/* No floating elements as requested */}
    </section>
  );
}