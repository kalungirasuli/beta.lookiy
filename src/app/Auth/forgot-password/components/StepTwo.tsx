'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface StepTwoProps {
  onComplete: (code: string) => void
  email: string
  isLoading: boolean
}

export default function StepTwo({ onComplete, email, isLoading }: StepTwoProps) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus the first input on component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleInput = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste event
      const pastedValue = value.slice(0, 6).split('')
      const newCode = [...code]
      pastedValue.forEach((char, i) => {
        if (i + index < 6) {
          newCode[i + index] = char
        }
      })
      setCode(newCode)
      
      // Focus the next empty input or the last input
      const nextIndex = Math.min(index + pastedValue.length, 5)
      inputRefs.current[nextIndex]?.focus()
    } else {
      // Handle single character input
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      // Focus next input if available
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    setError('')
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const verificationCode = code.join('')
    
    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    if (!/^\d+$/.test(verificationCode)) {
      setError('Code must contain only numbers')
      return
    }

    onComplete(verificationCode)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-8 md:p-10 backdrop-blur-sm bg-opacity-90"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Enter the 6-digit code sent to {email}
          </p>
          <div className="flex justify-center space-x-3">
            {code.map((digit, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleInput(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:border-black focus:ring-4 focus:ring-black/20 transition-all"
                  disabled={isLoading}
                />
              </motion.div>
            ))}
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600"
              role="alert"
            >
              {error}
            </motion.p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 text-white font-medium bg-orange-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] rounded-xl transition-all duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {/* TODO: Add resend code functionality */}}
            className="text-sm text-orange-600 hover:text-orange-500 transition-colors"
            disabled={isLoading}
          >
            Didn&apos;t receive the code? Resend
          </button>
        </div>
      </form>
    </motion.div>
  )
}