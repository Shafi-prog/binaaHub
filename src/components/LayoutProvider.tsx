'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/contexts/CartContext';
import { NotificationProvider } from '@/components/ui/NotificationSystem';
import OnboardingTour from '@/components/ui/OnboardingTour';

interface LayoutProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: any | null;
  accountType: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, accountType: null });
export const useAuth = () => useContext(AuthContext);

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const getAuthState = async () => {
      try {
        // Check for temp auth cookie
        if (typeof window !== 'undefined') {
          const cookies = document.cookie.split(';');
          const tempAuthCookie = cookies
            .find(cookie => cookie.trim().startsWith('temp_auth_user='))
            ?.split('=')[1];
          
          if (tempAuthCookie && isMounted) {
            const tempUser = JSON.parse(decodeURIComponent(tempAuthCookie));
            console.log('✅ [LayoutProvider] Found temp auth user:', tempUser);
            setUser(tempUser);
            setAccountType(tempUser.account_type);
          } else if (isMounted) {
            console.log('❌ [LayoutProvider] No temp auth cookie found');
            setUser(null);
            setAccountType(null);
          }
        }
      } catch (error) {
        console.error('❌ [LayoutProvider] Error getting auth state:', error);
        if (isMounted) {
          setUser(null);
          setAccountType(null);
        }
      }
    };

    getAuthState();

    // Poll for auth state changes (since we don't have real-time updates with cookies)
    const interval = setInterval(getAuthState, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Show onboarding tour for users only, if not dismissed
    if (accountType === 'user' && typeof window !== 'undefined') {
      setShowTour(localStorage.getItem('onboardingTourDismissed') !== 'true');
    } else {
      setShowTour(false);
    }
  }, [accountType]);

  const handleDismissTour = () => {
    setShowTour(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingTourDismissed', 'true');
    }
  };
  return (
    <AuthContext.Provider value={{ user, accountType }}>
      <CartProvider>
        <NotificationProvider>
          <Navbar user={user} accountType={accountType} />
          {showTour && <OnboardingTour onFinish={handleDismissTour} />}
          {children}
        </NotificationProvider>
      </CartProvider>
    </AuthContext.Provider>
  );
}
