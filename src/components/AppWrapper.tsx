'use client';

import { useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import WaitingPage from '@/components/OnboardingSplash';
import { useUser } from '@/contexts/UserContext';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const { user, isLoading } = useUser();

  // Show loading splash screen only once
  if (isLoading || !isSplashComplete) {
    return <SplashScreen finishLoading={() => setIsSplashComplete(true)} />;
  }

  // Show waiting page for onboarding
  // if (user && !user.hasCompletedOnboarding && !isOnboardingComplete) {
  //   return (
  //     <WaitingPage 
  //       userName={user.name}
  //       onComplete={() => setIsOnboardingComplete(true)} 
  //     />
  //   );
  // }

  return children;
}