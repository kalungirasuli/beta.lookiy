'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';

export default function JoinWaitingListForm() {
  // Form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Individual');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate form
    if (!email || !name || !type) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Validate company fields if type is Company/Organization
    if (type === 'Company/Organization' && (!companyName || !companyDescription)) {
      setError('Please fill in company name and description');
      setLoading(false);
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    // Call actual API
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          type: type,
          companyName: type === 'Company/Organization' ? companyName.trim() : null,
          companyDescription: type === 'Company/Organization' ? companyDescription.trim() : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
      setEmail('');
      setName('');
      setType('Individual');
      setCompanyName('');
      setCompanyDescription('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="w-full py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-12 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 opacity-70 -z-10"></div>
      
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-black tracking-tight">
           Join the <span className="text-purple-100 bg-purple-600 px-2 py-1 rounded-md mx-2">Waitlist</span>
          </h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto mb-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Be the first to experience Lookiy when we launch. Sign up now to secure your spot and get early access to our platform.
          </motion.p>
        </motion.div>
        
        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          {!submitted ? (
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {error && (
                <motion.div 
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}
              
              <motion.div className="mb-6" variants={itemVariants} initial="hidden" animate="visible">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </motion.div>
              
              <motion.div className="mb-8" variants={itemVariants} initial="hidden" animate="visible">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </motion.div>

              <motion.div className="mb-8" variants={itemVariants} initial="hidden" animate="visible">
                <label htmlFor="type" className="block text-gray-700 font-medium mb-2">Account Type</label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white"
                  required
                >
                  <option value="Individual">Individual</option>
                  <option value="Company/Organization">Company/Organization</option>
                </select>
              </motion.div>

              {/* Company Fields - Show only when type is Company/Organization */}
              {type === 'Company/Organization' && (
                <>
                  <motion.div className="mb-6" variants={itemVariants} initial="hidden" animate="visible">
                    <label htmlFor="companyName" className="block text-gray-700 font-medium mb-2">Company Name</label>
                    <input
                      type="text"
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      placeholder="Enter your company name"
                      required={type === 'Company/Organization'}
                    />
                  </motion.div>

                  <motion.div className="mb-8" variants={itemVariants} initial="hidden" animate="visible">
                    <label htmlFor="companyDescription" className="block text-gray-700 font-medium mb-2">Company Description</label>
                    <textarea
                      id="companyDescription"
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                      placeholder="Tell us about your company"
                      rows={4}
                      required={type === 'Company/Organization'}
                    />
                  </motion.div>
                </>
              )}
              
              <motion.div variants={itemVariants} initial="hidden" animate="visible">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Join the Waitlist'}
                </button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div
              className="bg-white p-8 rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">You're on the list!</h3>
              <p className="text-gray-600 mb-6">Thanks for joining our waitlist. We'll notify you when Lookiy launches.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-purple-50 hover:bg-purple-100"
              >
                Sign up another email
              </button>
            </motion.div>
          )}
          
          {/* Decorative elements */}
          {/* <motion.div 
            className="absolute -bottom-10 -left-10 w-20 h-20 md:w-32 md:h-32 hidden md:block"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img 
              src="/usecase/real.svg" 
              alt="Decorative element" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-10 -right-10 w-20 h-20 md:w-32 md:h-32 hidden md:block"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <img 
              src="/usecase/just1.svg" 
              alt="Decorative element" 
              className="w-full h-full object-contain"
            />
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}