'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaitingPageProps {
  userName: string;
  onComplete?: () => void;
}

export default function WaitingPage({ userName, onComplete }: WaitingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSetupMessages, setShowSetupMessages] = useState(false);

  // List of setup messages
  const setupMessages = [
    { text: "Let's get you started", color: "text-orange-500" },
    { text: "Setting up your networks", color: "text-blue-500" },
    { text: "Configuring your preferences", color: "text-green-500" },
    { text: "Preparing your connections", color: "text-purple-500" },
    { text: "Almost ready to explore", color: "text-orange-500" }
  ];

  useEffect(() => {
    // Show greeting for 2 seconds before starting setup messages
    const greetingTimer = setTimeout(() => {
      setShowSetupMessages(true);
    }, 2000);

    // Start cycling through setup messages
    const messageTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= setupMessages.length - 1) {
            clearInterval(interval);
            if (onComplete) {
              setTimeout(onComplete, 1500);
            }
            return prev;
          }
          return prev + 1;
        });
      }, 2500); // Show each message for 2.5 seconds

      return () => clearInterval(interval);
    }, 2000); // Start after greeting

    return () => {
      clearTimeout(greetingTimer);
      clearTimeout(messageTimer);
    };
  }, [onComplete, setupMessages.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-b from-blue-50 via-orange-50 to-white"
    >
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

      <div className="text-center px-4">
        <AnimatePresence mode="wait">
          {!showSetupMessages ? (
            // Initial greeting
            <motion.h1
              key="greeting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight"
            >
              Hello, <span className="text-orange-500">{userName}</span>
            </motion.h1>
          ) : (
            // Setup messages
            <motion.div
              key={`setup-${currentStep}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h2 className={`text-6xl sm:text-7xl md:text-8xl font-bold ${setupMessages[currentStep].color}`}>
                {setupMessages[currentStep].text}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block ml-2"
                >
                  ...
                </motion.span>
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
