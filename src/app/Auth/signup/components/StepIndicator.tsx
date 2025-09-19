'use client';

import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: 'Account' },
    { number: 2, title: 'Personal' },
    { number: 3, title: 'Profile' }
  ];

  return (
    <div className="flex justify-between items-center mb-10 px-4">
      {steps.map((step, index) => {
        const isActive = currentStep >= step.number;
        const isLast = index === steps.length - 1;
        const isCurrent = currentStep === step.number;
        
        return (
          <div key={step.number} className="flex items-center relative">
            <div className="flex flex-col items-center">
              <motion.div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                  isActive ? 'bg-orange-500 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]' : 'bg-white text-gray-700 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]'
                }`}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.05 : 1,
                  y: isCurrent ? -2 : 0
                }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
              >
                {step.number}
              </motion.div>
              <motion.span 
                className={`mt-2 text-sm font-medium ${
                  isActive ? 'text-gray-900' : 'text-gray-500'
                }`}
                animate={{
                  fontWeight: isCurrent ? 700 : 500
                }}
              >
                {step.title}
              </motion.span>
            </div>
            
            {!isLast && (
              <div className="w-full mx-4 h-1 bg-gray-200 rounded-full relative">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: currentStep > step.number ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}