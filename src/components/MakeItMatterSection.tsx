'use client';

import { motion, Variants } from 'framer-motion';

export default function MakeItMatterSection() {
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
    <section className="w-full py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-12 relative bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white opacity-70 -z-10"></div>
      
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-black tracking-tight">
            How You'll<br className='block md:hidden'></br> <span className="text-gray-200 bg-gray-600 px-2 py-1 rounded-md md:mt-0">Make It Matter</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Turn connections into opportunities that align with what matters to you
          </p>
        </motion.div>
        
        {/* Masonry Layout for Use Cases */}
        <motion.div 
          className="columns-1 md:columns-2 lg:columns-2 xl:columns-2 gap-6 md:gap-8 space-y-6 md:space-y-8 mx-auto w-full lg:w-[95%] xl:w-[95%] 2xl:w-[95%]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Card 1: Meet Collaborators */}
          <motion.div 
            className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 mb-6 md:mb-8 inline-block w-full"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex-shrink-0">
                <img 
                  src="/WFH_svg 3/wfh_1.svg" 
                  alt="Meet Collaborators" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-blue-600 mb-2">Meet Collaborators</h3>
                <p className="text-gray-700 mb-2">LINK UP WITH PEOPLE BUILDING WHAT YOU'RE PASSIONATE ABOUT</p>
                <p className="text-gray-600">Find like-minded creators and innovators who share your interests and vision.</p>
              </div>
            </div>
          </motion.div>
          
          {/* Card 2: Share Your Story */}
          <motion.div 
            className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 mb-6 md:mb-8 inline-block w-full"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex-shrink-0">
                <img 
                  src="/DrawKit Vector Illustration Mental Health & Psychology 2/SVG/DrawKit Vector Illustration Mental Health & Psychology (7).svg" 
                  alt="Share Your Story" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-orange-500 mb-2">Share Your Story</h3>
                <p className="text-gray-700 mb-2">GET HEARD, SHARE IDEAS AND INSPIRE SOMETHING NEW</p>
                <p className="text-gray-600">Your unique perspective matters. Share it and spark meaningful conversations.</p>
              </div>
            </div>
          </motion.div>
          
          {/* Card 3: Expand Your Circle */}
          <motion.div 
            className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 mb-6 md:mb-8 inline-block w-full"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex-shrink-0">
                <img 
                  src="/DrawKit - Social Movements Illustration Pack/SVG/4_SOCIAL MEDIA.svg" 
                  alt="Expand Your Circle" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-purple-600 mb-2">Expand Your Circle</h3>
                <p className="text-gray-700 mb-2">BREAK OUT OF YOUR USUAL SPACE</p>
                <p className="text-gray-600">Meet minds from different paths and discover new perspectives.</p>
              </div>
            </div>
          </motion.div>
          
          {/* Card 4: Unlock Opportunities */}
          <motion.div 
            className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 mb-6 md:mb-8 inline-block w-full"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex-shrink-0">
                <img 
                  src="/WFH_svg 3/wfh_8.svg" 
                  alt="Unlock Opportunities" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-green-600 mb-2">Unlock Opportunities</h3>
                <p className="text-gray-700 mb-2">JOBS, PROJECTS, NEW VENTURES</p>
                <p className="text-gray-600">It all starts with hello. Turn connections into real-world opportunities.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}