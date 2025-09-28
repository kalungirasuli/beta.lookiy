'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, Variants } from 'framer-motion'
import RecoveryForm from './components/RecoveryForm'

export default function AccountRecoveryPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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

  const handleRecoverySubmit = async (token: string) => {
    setIsLoading(true)
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/Auth/login')
    } catch (error) {
      console.error('Recovery error:', error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

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
            Account Recovery <span className="text-orange-100 bg-orange-500 px-2 py-1 rounded-md mx-2">Lookiy</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-gray-700 max-w-2xl mx-auto"
          >
            Enter your recovery token to regain access to your account
          </motion.p>
        </motion.div>
        
        <div className="max-w-md mx-auto">
          <RecoveryForm onSubmit={handleRecoverySubmit} isLoading={isLoading} />
        </div>
      </div>
    </section>
  )
}