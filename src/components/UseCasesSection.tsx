'use client';

import { motion, Variants } from 'framer-motion';

export default function UseCasesSection() {
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-12 relative bg-gray-50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 opacity-70 -z-10"></div>
      
      {/* Grid background */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        <div className="w-full h-full grid grid-cols-6 grid-rows-6 opacity-15 gap-0">
          {Array.from({ length: 36 }).map((_, index) => (
            <div 
              key={index} 
              className="border border-gray-200 flex items-center justify-center bg-white bg-opacity-5"
            ></div>
          ))}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black tracking-tight">
            Use<span className="text-blue-100 bg-blue-600 px-2 py-1 rounded-md mx-2">Cases</span>
          </h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto mb-6"
            variants={itemVariants}
          >
            Lookiy is a fast and intelligent platform that helps people discover and connect in real-world environments like events, schools, organizations, hotels, cafés, or any gathering where people should meet, learn about each other, and grow together.
          </motion.p>
        </motion.div>
        
        {/* Connected Use Cases */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-500 hidden md:block"></div>
          
          {/* Use Case 1 */}
          <motion.div
            className="flex flex-col md:flex-row items-center gap-8 mb-16 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Connection dot */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full hidden md:block"></div>
            
            {/* Left side - Image */}
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                <img 
                  src="/usecase/event.svg" 
                  alt="Events Use Case" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="md:w-1/2 text-center md:text-left">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">Events & Conferences</h3>
              <p className="text-gray-700">Connect attendees based on interests, goals, and expertise. Facilitate meaningful conversations that lead to collaborations and opportunities.</p>
            </div>
          </motion.div>
          
          {/* Use Case 2 */}
          <motion.div
            className="flex flex-col md:flex-row-reverse items-center gap-8 mb-16 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Connection dot */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full hidden md:block"></div>
            
            {/* Right side - Image */}
            <div className="md:w-1/2 flex justify-center md:justify-start">
              <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                <img 
                  src="/usecase/phys.svg" 
                  alt="Education Use Case" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Left side - Content */}
            <div className="md:w-1/2 text-center md:text-right">
              <h3 className="text-2xl font-bold text-purple-600 mb-3">Schools & Education</h3>
              <p className="text-gray-700">Help students and faculty discover shared academic interests, form study groups, and build a supportive learning community.</p>
            </div>
          </motion.div>
          
          {/* Use Case 3 */}
          <motion.div
            className="flex flex-col md:flex-row items-center gap-8 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Connection dot */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full hidden md:block"></div>
            
            {/* Left side - Image */}
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                <img 
                  src="/usecase/common.svg" 
                  alt="Community Use Case" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="md:w-1/2 text-center md:text-left">
              <h3 className="text-2xl font-bold text-orange-500 mb-3">Cafés & Community Spaces</h3>
              <p className="text-gray-700">Transform casual spaces into hubs of connection. Whether you're attending a conference, managing a school club, or setting up a café community — Lookiy makes networking seamless, smart, and personal.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}