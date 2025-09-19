'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface InterestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInterests: string[];
  onInterestToggle: (interest: string) => void;
}

const interestOptions = [
  "Writing (poetry, fiction, journaling)",
    "Painting or drawing",
    "Sculpting",
    "Photography",
    "Calligraphy",
    "Learning a musical instrument",
    "Singing",
    "Acting or improv",
    "Dancing (ballet, hip-hop, ballroom)",
    "Pottery",
    "Woodworking",
    "Ceramics",
    "Textile arts (knitting, crocheting, sewing)",
    "Flower arranging",
    "Physical & Outdoor Activities",
    "Hiking or trekking",
    "Rock climbing",
    "Camping",
    "Cycling",
    "Swimming",
    "Yoga",
    "Martial arts",
    "Gardening",
    "Bird watching",
    "Stargazing",
    "Fishing",
    "Kayaking or canoeing",
    "Surfing",
    "Running or jogging",
    "Team sports (basketball, soccer)",
    "Golfing",
    "Roller skating or skateboarding",
    "Wildlife observation",
    "Intellectual & Learning",
    "Learning a new language",
    "Reading (fiction, non-fiction)",
    "Astronomy",
    "Genealogy (family history)",
    "Historical research",
    "Solving puzzles (crosswords, Sudoku)",
    "Chess",
    "Philosophy",
    "Participating in book clubs",
    "Learning about current events",
    "Studying a new subject (e.g., geology, botany)",
    "Collecting",
    "Stamp collecting",
    "Coin collecting",
    "Antiques",
    "Vinyl records",
    "Comic books",
    "Art",
    "Vintage clothing",
    "Memorabilia (sports, movie)",
    "Model trains or cars",
    "Technology & Gaming",
    "Coding or programming",
    "Video gaming",
    "Building computers",
    "Blogging or creating online content",
    "Virtual reality (VR) experiences",
    "Drone flying and videography",
    "3D printing",
    "Culinary & Social",
    "Cooking or baking",
    "Wine or craft beer tasting",
    "Hosting dinner parties",
    "Joining a social club",
    "Volunteering",
    "Traveling",
    "Attending cultural festivals",
    "Learning etiquette",
    "Public speaking",
    "Home & DIY",
    "Home renovation and DIY projects",
    "Furniture restoration",
    "Interior design",
    "Homebrewing",
    "Urban homesteading",
    "Relaxation & Wellness",
    "Meditation",
    "Mindfulness",
    "Journaling",
    "Aromatherapy",
    "Spa and wellness practices",
    "Personal development",
    "Miscellaneous",
    "Pet care or training",
    "Magic tricks and illusions",
    "Origami",
    "Aromatherapy",
    "Homebrewing",
    "Exploring local history",
    "Supporting local businesses",
    "Collecting maps",
    "Genealogy",
    "Urban exploration (geocaching)",
    "Car restoration",
    "Bespoke cocktail making",
    "The study of cryptids and folklore",
    "Mycology (study of mushrooms)",
    "Astronomy photography",
    "Beekeeping",
    "Beading and jewelry making",
    "The art of bonsai",
    "Extreme ironing",
    "Collecting rare teas",
    "Building and launching model rockets"
];

export default function InterestsModal({ 
  isOpen, 
  onClose, 
  selectedInterests, 
  onInterestToggle 
}: InterestsModalProps) {
  const handleInterestClick = (interest: string) => {
    if (!selectedInterests.includes(interest) && selectedInterests.length >= 10) {
      // Don't add new interest if limit is reached
      return;
    }
    onInterestToggle(interest);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0  z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: {
                type: "spring",
                duration: 0.5,
                bounce: 0.3
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              y: 20,
              transition: {
                duration: 0.2
              }
            }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 z-50"
          >
            <div className="border-b border-gray-200 pb-4 space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Select Your Interests</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-600">Select up to 10 interests</p>
                <p className={`font-medium ${selectedInterests.length >= 10 ? 'text-orange-500' : 'text-gray-600'}`}>
                  {selectedInterests.length}/10 selected
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 max-h-[60vh] overflow-y-auto p-2">
              {interestOptions.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <motion.button
                    key={interest}
                    onClick={() => handleInterestClick(interest)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                    transition={{
                      layout: { duration: 0.2 },
                      scale: { duration: 0.1 }
                    }}
                    animate={{
                      backgroundColor: isSelected ? '#039bf3ff' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#4a4b4cff',
                    }}
                    className={`
                      px-4 py-2 rounded-xl border-2 transition-colors duration-200
                      ${isSelected 
                        ? 'border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]' 
                        : 'border-gray-300 hover:border-gray-400'}
                      ${!isSelected && selectedInterests.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <motion.span
                      animate={{ scale: isSelected ? 1.05 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {interest}
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={onClose}
                className="py-2 px-6 text-white font-medium bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] rounded-xl transition-all duration-150 flex items-center justify-center"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}