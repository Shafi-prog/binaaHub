'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/contexts/CartContext';
import { NotificationProvider } from '@/components/ui/NotificationSystem';
import OnboardingTour from '@/components/ui/OnboardingTour';
import type { Session } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

interface LayoutProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  session: Session | null;
  accountType: string | null;
}

const AuthContext = createContext<AuthContextType>({ session: null, accountType: null });
export const useAuth = () => useContext(AuthContext);

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(false);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getSessionAndRole = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session?.user) {
        // Try to get account_type from user_metadata first
        const metaType = data.session.user.user_metadata?.account_type;
        if (metaType) {
          setAccountType(metaType);
        } else {
          // Fallback: fetch from users table
          const { data: userRow } = await supabase
            .from('users')
            .select('account_type')
            .eq('id', data.session.user.id)
            .single();
          setAccountType(userRow?.account_type || null);
        }
      } else {
        setAccountType(null);
      }
    };

    getSessionAndRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const metaType = session.user.user_metadata?.account_type;
        if (metaType) {
          setAccountType(metaType);
        } else {
          supabase
            .from('users')
            .select('account_type')
            .eq('id', session.user.id)
            .single()
            .then(({ data: userRow }) => setAccountType(userRow?.account_type || null));
        }
      } else {
        setAccountType(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

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
    <AuthContext.Provider value={{ session, accountType }}>
      <CartProvider>
        <NotificationProvider>
          <Navbar session={session} accountType={accountType} />
          {showTour && <OnboardingTour onFinish={handleDismissTour} />}
          {children}
        </NotificationProvider>
      </CartProvider>
    </AuthContext.Provider>
  );
}
