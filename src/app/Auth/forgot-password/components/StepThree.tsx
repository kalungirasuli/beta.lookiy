'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface StepThreeProps {
  onComplete: (password: string) => void
  isLoading: boolean
}

export default function StepThree({ onComplete, isLoading }: StepThreeProps) {
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: ''
  })
  const [errors, setErrors] = useState({
    password: '',
    passwordConfirm: ''
  })

  // Password validation rules
  const validatePassword = (password: string) => {
    const rules = [
      { test: /.{8,}/, message: 'Password must be at least 8 characters long' },
      { test: /[A-Z]/, message: 'Password must contain at least one uppercase letter' },
      { test: /[a-z]/, message: 'Password must contain at least one lowercase letter' },
      { test: /[0-9]/, message: 'Password must contain at least one number' },
      { test: /[!@#$%^&*]/, message: 'Password must contain at least one special character (!@#$%^&*)' }
    ]

    for (const rule of rules) {
      if (!rule.test.test(password)) {
        return rule.message
      }
    }
    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = {
      password: '',
      passwordConfirm: ''
    }
    let isValid = true

    // Validate password
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      newErrors.password = passwordError
      isValid = false
    }

    // Validate password confirmation
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match'
      isValid = false
    }

    setErrors(newErrors)

    if (isValid) {
      onComplete(formData.password)
    }
  }

  // Animation variants
  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0 0 8px rgba(0, 0, 0, 0.8)" },
    blur: { scale: 1, boxShadow: "none" }
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <motion.div
            whileFocus="focus"
            animate="blur"
            variants={inputVariants}
          >
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:ring-4 focus:ring-black/20 transition-all"
              placeholder="Enter your new password"
              disabled={isLoading}
              required
            />
          </motion.div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <motion.div
            whileFocus="focus"
            animate="blur"
            variants={inputVariants}
          >
            <input
              type="password"
              id="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:ring-4 focus:ring-black/20 transition-all"
              placeholder="Confirm your new password"
              disabled={isLoading}
              required
            />
          </motion.div>
          {errors.passwordConfirm && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.passwordConfirm}
            </p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 text-white font-medium bg-orange-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] rounded-xl transition-all duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating Password...' : 'Reset Password'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </motion.div>
  )
}