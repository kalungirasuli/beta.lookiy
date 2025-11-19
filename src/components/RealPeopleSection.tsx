'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function RealPeopleSection() {
  // Ref for the section to track when it's in view
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // State for tracking which card is glowing
  const [activeCard, setActiveCard] = useState<number | null>(null);
  
  // Animation controls for the cards
  const card1Controls = useAnimation();
  const card2Controls = useAnimation();
  const card3Controls = useAnimation();
  
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
  
  const cardGlowVariants = {
    idle: { boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)' },
    glow: { 
      boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8), 0 0 15px 5px rgba(59, 130, 246, 0.5), 0 0 30px 10px rgba(59, 130, 246, 0.3)', 
      transition: { duration: 0.5 }
    }
  };
  
  // Card glow sequence (without train animation)
  useEffect(() => {
    const animateCardSequence = async () => {
      // Reset active card
      setActiveCard(null);
      
      // Activate first card glow
      setActiveCard(0);
      await card1Controls.start('glow');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Switch glow to second card
      setActiveCard(1);
      await card1Controls.start('idle');
      await card2Controls.start('glow');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Switch glow to third card
      setActiveCard(2);
      await card2Controls.start('idle');
      await card3Controls.start('glow');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset third card glow
      await card3Controls.start('idle');
      
      // Small delay before restarting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Restart the sequence
      animateCardSequence();
    };
    
    // Start the animation sequence
    animateCardSequence();
    
    // Cleanup function
    return () => {
      card1Controls.stop();
      card2Controls.stop();
      card3Controls.stop();
    };
  }, [card1Controls, card2Controls, card3Controls]);

  return (
    <div className="w-full">
      {/* Combined Section with side-by-side layout */}
      <section className="w-full py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-12 relative bg-gray-50" ref={sectionRef}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 opacity-70 -z-10"></div>
        
        {/* Grid background - similar but with different colors */}
        <div className="absolute inset-0 -z-5 overflow-hidden">
          <div className="w-full h-full grid grid-cols-6 grid-rows-6 opacity-15 gap-0">
            {Array.from({ length: 36 }).map((_, index) => (
              <div 
                key={index} 
                className="border border-blue-200 flex items-center justify-center bg-white bg-opacity-5"
              ></div>
            ))}
          </div>
        </div>
        
        {/* SVG Illustration - Hidden on small screens, absolute on larger screens */}
        <div className="hidden md:block absolute right-0 bottom-0 sm:right-5 sm:bottom-5 md:bottom-0 lg:bottom-0 w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[26rem] opacity-70 z-0 pointer-events-none">
          <img 
            src="/usecase/real.svg" 
            alt="Mental Health Illustration" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Animated content container with side-by-side layout */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">
            {/* Left side - Heading */}
            <motion.div
              className="lg:w-1/2 animate-fade-in"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 md:mb-8 text-black tracking-tight flex flex-col text-center sm:text-left">
                <motion.span 
                  className="mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-gray-800">Real </span><span className="text-gray-200 bg-gray-600 px-2 py-1 rounded-md">People.</span>
                </motion.span>
                <motion.span 
                  className="pl-0 sm:pl-24 md:pl-32"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <span className="text-gray-800">Real </span><span className="text-orange-100 bg-orange-500 px-2 py-1 rounded-md">Links.</span>
                </motion.span>
              </h2>
              
              <motion.p 
                className="text-lg md:text-xl text-gray-700 max-w-xl px-2 mb-6"
                variants={itemVariants}
              >
                This space is built for real conversation, real collaboration, and unexpected opportunity.
              </motion.p>
            </motion.div>
            
            {/* Right side - Cards */}
            <motion.div
              className="lg:w-1/2 animate-fade-in"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Benefits Section with Train Animation */}
              <div className="relative">
                {/* Dotted connection lines */}
                <div className="hidden md:block absolute top-[25%] left-1/2 h-[75%] w-0.5 border-l-2 border-dashed border-black z-0"></div>
                <div className="hidden md:block absolute top-[75%] left-1/4 right-3/4 w-1/2 h-0.5 border-t-2 border-dashed border-black z-0"></div>
                
                {/* Removed the animated train, keeping only the dotted trail */}
                
                {/* Cards layout - stacked on small screens, 1+2 grid on medium and large */}
                <div className="relative z-0">
                  {/* First row - single card on all screens */}
                  <div className="mb-4">
                    <motion.div 
                      className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 w-full"
                      animate={card1Controls}
                      initial="idle"
                      variants={cardGlowVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h3 className="text-xl font-bold text-blue-600 mb-3">Meet New Faces</h3>
                      <p className="text-gray-600">Connect with like-minded individuals and exchange innovative thoughts in a supportive environment.</p>
                    </motion.div>
                  </div>
                  
                  {/* Second row - two cards side by side on md+ screens, stacked on small screens */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <motion.div 
                      className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 flex-1 mb-4 md:mb-0"
                      animate={card2Controls}
                      initial="idle"
                      variants={cardGlowVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h3 className="text-xl font-bold text-orange-500 mb-3">Share Ideas</h3>
                      <p className="text-gray-600">Exchange innovative thoughts and perspectives in an engaging and collaborative space.</p>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 flex-1 sm:ml-4 md:ml-0"
                      animate={card3Controls}
                      initial="idle"
                      variants={cardGlowVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h3 className="text-xl font-bold text-purple-600 mb-3">Build Connections</h3>
                      <p className="text-gray-600">Forge meaningful relationships that enhance both your personal network and professional opportunities.</p>
                    </motion.div>
                  </div>
                  
                  {/* SVG Illustration for small screens - after the last card */}
                  <div className="md:hidden mt-8 w-80 h-80 mx-auto opacity-70 z-0 pointer-events-none">
                    <img 
                      src="/usecase/real.svg" 
                      alt="Mental Health Illustration" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* CTA Button removed */}
      </section>
    </div>
  );
}