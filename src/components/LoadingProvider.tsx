'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './SplashScreen';

interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  
  // Function to finish loading
  const finishLoading = () => {
    setLoading(false);
  };
  
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <AnimatePresence mode="wait">
        {loading && <SplashScreen finishLoading={finishLoading} />}
      </AnimatePresence>
      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s' }}>
        {children}
      </div>
    </LoadingContext.Provider>
  );
}