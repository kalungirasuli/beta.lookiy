'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface StepTwoProps {
  formData: {
    gender: string;
    age: string;
    location: string;
  };
  updateFormData: (data: Partial<typeof formData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function StepTwo({ formData, updateFormData, nextStep, prevStep }: StepTwoProps) {
  const [errors, setErrors] = useState({
    gender: '',
    age: '',
    location: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      gender: '',
      age: '',
      location: ''
    };

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
      isValid = false;
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
      isValid = false;
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 18 || Number(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age between 18 and 120';
      isValid = false;
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateForm()) {
      nextStep();
    }
  };

  // Animation variants
  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0 0 8px rgba(249, 115, 22, 0.4)" },
    blur: { scale: 1, boxShadow: "none" }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">Personal Details</h2>
      
      <div className="space-y-5">
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <motion.div
            whileFocus="focus"
            animate="blur"
            variants={inputVariants}
          >
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => updateFormData({ gender: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white bg-opacity-90"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </motion.div>
          {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
        </div>
        
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <motion.div
            whileFocus="focus"
            animate="blur"
            variants={inputVariants}
          >
            <input
              type="number"
              id="age"
              value={formData.age}
              onChange={(e) => updateFormData({ age: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white bg-opacity-90"
              placeholder="Enter your age"
              min="18"
              max="120"
            />
          </motion.div>
          {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <motion.div
            whileFocus="focus"
            animate="blur"
            variants={inputVariants}
          >
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => updateFormData({ location: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white bg-opacity-90"
              placeholder="Enter your city or country"
            />
          </motion.div>
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="py-3 px-6 text-gray-700 font-medium border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] bg-white rounded-xl transition-all duration-150 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="py-3 px-6 text-white font-medium bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] rounded-xl transition-all duration-150 flex items-center justify-center"
        >
          Continue
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}