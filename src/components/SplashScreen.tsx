'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  userName?: string;
  isFirstTime?: boolean;
  finishLoading: () => void;
}

export default function SplashScreen({ userName = 'there', isFirstTime = false, finishLoading }: SplashScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showGetStarted, setShowGetStarted] = useState(false);

  // Sequence of steps for first-time users
  const steps = [
    { text: "Let's get you started", color: "text-orange-500" },
    { text: "Setting up your profile", color: "text-blue-500" },
    { text: "Preparing your networks", color: "text-green-500" },
    { text: "Configuring your workspace", color: "text-purple-500" },
    { text: "Almost ready to explore", color: "text-orange-500" }
  ];

  useEffect(() => {
    if (!isFirstTime) {
      // For returning users, just show a quick splash
      const timer = setTimeout(finishLoading, 2000);
      return () => clearTimeout(timer);
    }

    // For first-time users, show the full sequence
    const initialGreetingDuration = 1500;
    const getStartedDelay = 500;
    const stepDuration = 2000;

    // Show "Let's get you started" after initial greeting
    const getStartedTimer = setTimeout(() => {
      setShowGetStarted(true);
    }, initialGreetingDuration + getStartedDelay);

    // Start the setup messages sequence
    const sequenceTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            setTimeout(finishLoading, stepDuration);
            return prev;
          }
          return prev + 1;
        });
      }, stepDuration);

      return () => clearInterval(interval);
    }, initialGreetingDuration + getStartedDelay + 2000);

    return () => {
      clearTimeout(getStartedTimer);
      clearTimeout(sequenceTimer);
    };
  }, [finishLoading, isFirstTime, steps.length]);
  
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

      <div className="text-center space-y-8 px-4">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto"
        >
          <Image 
            src="/logo.svg" 
            alt="Lookiy Logo" 
            fill
            priority
            className="object-contain"
          />
        </motion.div>

        {isFirstTime && (
          <div className="space-y-6">
            {/* Initial Greeting */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-black tracking-tight"
            >
              Hello, <span className="text-orange-500">{userName}</span>
            </motion.h1>

            {/* Get Started Message */}
            {showGetStarted && currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-24"
              >
                <p className="text-4xl sm:text-5xl md:text-6xl font-medium text-orange-500">
                  {steps[0].text}
                </p>
              </motion.div>
            )}

            {/* Setup Messages */}
            {currentStep > 0 && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="h-24"
              >
                <p className={`text-4xl sm:text-5xl md:text-6xl font-medium ${steps[currentStep].color}`}>
                  {steps[currentStep].text}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}