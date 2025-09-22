'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface RecoveryFormProps {
  onSubmit: (token: string) => void
  isLoading: boolean
}

export default function RecoveryForm({ onSubmit, isLoading }: RecoveryFormProps) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Simple validation for token format (assuming it's a 32-character hexadecimal string)
    if (!token.match(/^[0-9a-f]{32}$/i)) {
      setError('Please enter a valid recovery token')
      return
    }

    onSubmit(token)
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
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 text-gray-500 bg-white">account recovery</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Recovery Instructions</h3>
        <p className="text-gray-600 text-sm">
          Please enter your account recovery token. This token was provided to you when you first set up your account.
          It should be a 32-character code that looks like this: <code className="bg-gray-100 px-1 py-0.5 rounded">1a2b3c4d...</code>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div variants={inputVariants}>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
            Recovery Token
          </label>
          <motion.div
            whileFocus="focus"
            animate="blur"
            variants={inputVariants}
          >
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value.toLowerCase())}
              className="font-mono w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:ring-4 focus:ring-black/20 transition-all"
              placeholder="Enter your recovery token"
              disabled={isLoading}
              required
              spellCheck="false"
              autoComplete="off"
              maxLength={32}
            />
          </motion.div>
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </motion.div>

        <motion.div variants={inputVariants} className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 text-white font-medium bg-orange-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] rounded-xl transition-all duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Recovering Account...' : 'Recover Account'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>

        <motion.div variants={inputVariants} className="flex items-center justify-center mt-6">
          <p className="text-sm text-gray-600">
            Don&apos;t have a recovery token?{' '}
            <a href="/Auth/forgot-password" className="text-orange-600 hover:text-orange-500 font-medium">
              Try password reset instead
            </a>
          </p>
        </motion.div>
      </form>
    </motion.div>
  )
}