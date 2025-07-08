// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/components/ui/NotificationSystem';
import OnboardingTour from '@/components/ui/OnboardingTour';

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem('hasSeenOnboardingTour');
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem('hasSeenOnboardingTour', 'true');
  };

  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Navbar />
          {children}          {showTour && (
            <OnboardingTour
              onFinish={handleTourComplete}
            />
          )}
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}


