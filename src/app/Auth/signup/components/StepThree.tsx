'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import InterestsModal from './InterestsModal';
import BioInput from './BioInput';

type StepThreeFormData = {
  bio: string;
  interests: string[];
};

interface StepThreeProps {
  formData: StepThreeFormData;
  updateFormData: (data: Partial<StepThreeFormData>) => void;
  prevStep: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}


export default function StepThree({ formData, updateFormData, prevStep, handleSubmit }: StepThreeProps) {
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
  const [errors, setErrors] = useState({
    bio: '',
    interests: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      bio: '',
      interests: ''
    };

    // Bio validation
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
      isValid = false;
    } else if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
      isValid = false;
    }

    // Interests validation
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please add at least one interest';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ bio: e.target.value });
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    
    updateFormData({ interests: newInterests });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(e);
    }
  };

  const isFormValid = formData.bio.length > 0 && formData.interests.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">Profile Information</h2>
      
      <div className="space-y-5">
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <BioInput
            value={formData.bio}
            onChange={(value) => updateFormData({ bio: value })}
            maxLength={500}
            error={errors.bio}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests
          </label>
          <button
            type="button"
            onClick={() => setIsInterestsModalOpen(true)}
            className="w-full px-4 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-black focus:ring-4 focus:ring-black/20 transition-all duration-200 text-left flex justify-between items-center"
          >
            <span className="text-gray-500">
              {formData.interests.length === 0 ? 'Select your interests' : `${formData.interests.length} selected`}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          {errors.interests && <p className="mt-1 text-sm text-red-600">{errors.interests}</p>}

          <div className="mt-4 flex flex-wrap gap-2">
            {formData.interests.map(item => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white px-4 py-2 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] flex items-center"
              >
                <span className="font-bold text-gray-800">{item}</span>
                <button
                  type="button"
                  onClick={() => handleInterestToggle(item)}
                  className="ml-2 text-gray-600 hover:text-gray-800 w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>

          <InterestsModal
            isOpen={isInterestsModalOpen}
            onClose={() => setIsInterestsModalOpen(false)}
            selectedInterests={formData.interests}
            onInterestToggle={handleInterestToggle}
          />
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
          type="submit"
          className="py-3 px-6 text-white font-medium bg-orange-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] rounded-xl transition-all duration-150 flex items-center justify-center"
        >
          Complete
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}