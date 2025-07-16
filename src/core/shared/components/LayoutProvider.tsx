'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { CartProvider } from '../../../contexts/CartContext';
import { AuthProvider } from '../../../contexts/AuthContext';
import { NotificationProvider } from './ui/NotificationSystem';
import OnboardingTour from './ui/OnboardingTour';

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const [showTour, setShowTour] = useState(false);
  const pathname = usePathname();

  // Pages that should not show the navbar or onboarding
  const noNavbarPages = ['/login', '/auth/login', '/auth/signup', '/reset-password-confirm', '/clear-auth'];
  // Hide Navbar for all /store/* admin pages except /store/storefront
  const isStoreAdminPage = pathname.startsWith('/store/') && !pathname.startsWith('/store/storefront');

  if (noNavbarPages.includes(pathname) || isStoreAdminPage) {
    // Only render children, no providers or UI wrappers
    return <>{children}</>;
  }

  const handleTourComplete = useCallback(() => {
    setShowTour(false);
    localStorage.setItem('hasSeenOnboardingTour', 'true');
  }, []);

  useEffect(() => {
    // Only show onboarding tour if not seen before and not on excluded pages
    if (
      !noNavbarPages.includes(pathname) &&
      !isStoreAdminPage &&
      typeof window !== 'undefined' &&
      localStorage.getItem('hasSeenOnboardingTour') !== 'true'
    ) {
      setShowTour(true);
    }
  }, [pathname]);

  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Navbar />
          {children}
          {showTour && (
            <OnboardingTour
              onFinish={handleTourComplete}
            />
          )}
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}


