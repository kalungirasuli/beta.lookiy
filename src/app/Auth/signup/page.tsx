'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import StepIndicator from './components/StepIndicator';

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    
    // Step 2
    gender: '',
    age: '',
    location: '',
    
    // Step 3
    bio: '',
    interests: []
  });

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

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    // Redirect or show success message
  };

  return (
    <section className="w-full min-h-screen py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-12 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-orange-50 to-white opacity-100 -z-10"></div>
      
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black tracking-tight"
          >
            Join <span className="text-orange-100 bg-orange-500 px-2 py-1 rounded-md mx-2">Lookiy</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-gray-700 max-w-2xl mx-auto"
          >
            Join our community and start connecting with real people through meaningful links.
          </motion.p>
        </motion.div>
        
        {/* Form Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto bg-white rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-8 md:p-10 backdrop-blur-sm bg-opacity-90"
        >
          <motion.div variants={itemVariants}>
            <StepIndicator currentStep={currentStep} />
          </motion.div>
          
          <form onSubmit={handleSubmit} className="mt-8">
            {currentStep === 1 && (
              <StepOne 
                formData={formData} 
                updateFormData={updateFormData} 
                nextStep={nextStep} 
              />
            )}
            
            {currentStep === 2 && (
              <StepTwo 
                formData={formData} 
                updateFormData={updateFormData} 
                nextStep={nextStep} 
                prevStep={prevStep} 
              />
            )}
            
            {currentStep === 3 && (
              <StepThree 
                formData={formData} 
                updateFormData={updateFormData} 
                prevStep={prevStep} 
                handleSubmit={handleSubmit} 
              />
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}