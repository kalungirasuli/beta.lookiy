'use client'

import { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useRouter } from 'next/navigation'
import StepOne from './components/StepOne'
import StepTwo from './components/StepTwo'
import StepThree from './components/StepThree'
import StepIndicator from './components/StepIndicator'
import Toast from '@/components/Toast'

export default function ForgotPassword() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'success'
  })

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
  }

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
  }

  const handleStepOneComplete = async (emailValue: string) => {
    setIsLoading(true)
    try {
      // TODO: Add API call to request verification code
      setEmail(emailValue)
      setCurrentStep(2)
      // Show success toast
      setToast({
        show: true,
        message: `Verification code sent to ${emailValue}`,
        type: 'success'
      })
    } catch (error) {
      console.error('Error requesting verification code:', error)
      // Show error toast
      setToast({
        show: true,
        message: 'Failed to send verification code. Please try again.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStepTwoComplete = async (code: string) => {
    setIsLoading(true)
    try {
      // TODO: Add API call to verify code
      setToast({
        show: true,
        message: 'Code verified successfully',
        type: 'success'
      })
      setCurrentStep(3)
    } catch (error) {
      console.error('Error verifying code:', error)
      setToast({
        show: true,
        message: 'Invalid verification code. Please try again.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStepThreeComplete = async (password: string) => {
    setIsLoading(true)
    try {
      // TODO: Add API call to reset password
      setToast({
        show: true,
        message: 'Password reset successful! You can now log in with your new password.',
        type: 'success'
      })
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/Auth/login')
      }, 2000)
    } catch (error) {
      console.error('Error resetting password:', error)
      setToast({
        show: true,
        message: 'Failed to reset password. Please try again.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepOne onComplete={handleStepOneComplete} isLoading={isLoading} />
      case 2:
        return (
          <StepTwo
            onComplete={handleStepTwoComplete}
            email={email}
            isLoading={isLoading}
          />
        )
      case 3:
        return <StepThree onComplete={handleStepThreeComplete} isLoading={isLoading} />
      default:
        return null
    }
  }

  return (
    <section className="w-full min-h-screen py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-12 relative">
      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />

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
            Reset Your <span className="text-orange-100 bg-orange-500 px-2 py-1 rounded-md mx-2">Password</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-gray-700 max-w-2xl mx-auto"
          >
            {currentStep === 1
              ? 'Enter your email to receive a verification code'
              : currentStep === 2
              ? 'Enter the verification code sent to your email'
              : 'Create your new password'}
          </motion.p>
        </motion.div>

        <div className="max-w-md mx-auto">
          <StepIndicator currentStep={currentStep} />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {getStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}