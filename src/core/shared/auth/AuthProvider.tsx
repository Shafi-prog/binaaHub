"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, Session } from '@supabase/supabase-js';
import { supabaseAuth, AuthUser, AuthState } from './supabase-auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  testConnection: () => Promise<{ connected: boolean; error?: string; usingMock?: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });

  const createAuthUser = async (supabaseUser: User): Promise<AuthUser | null> => {
    try {
      const { profile } = await supabaseAuth.getUserProfile(supabaseUser.id);
      
      // Determine role from profile first, then user metadata, then default
      const role = profile?.role || supabaseUser.user_metadata?.role || 'user';
      
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: profile?.display_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'مستخدم',
        avatar: supabaseUser.user_metadata?.avatar_url,
        phone: profile?.phone || supabaseUser.user_metadata?.phone,
        role: role,
        account_type: profile?.account_type || supabaseUser.user_metadata?.account_type || 'free',
      };
    } catch (error) {
      console.error('Error creating auth user:', error);
      // Fallback to user metadata role if profile fetch fails
      const role = supabaseUser.user_metadata?.role || 'user';
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'مستخدم',
        role: role,
        account_type: supabaseUser.user_metadata?.account_type || 'free',
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const { user, session, error } = await supabaseAuth.signIn(email, password);
    
    if (error) {
      setAuthState(prev => ({ ...prev, isLoading: false, error }));
      return { success: false, error };
    }

    if (user) {
      const authUser = await createAuthUser(user);
      console.log('User authenticated, created authUser:', authUser);
      
      setAuthState({
        user: authUser,
        session,
        isLoading: false,
        error: null,
      });
    }

    return { success: true };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const { user, session, error } = await supabaseAuth.signUp(email, password, metadata);
    
    if (error) {
      setAuthState(prev => ({ ...prev, isLoading: false, error }));
      return { success: false, error };
    }

    if (user) {
      const authUser = await createAuthUser(user);
      setAuthState({
        user: authUser,
        session,
        isLoading: false,
        error: null,
      });
    }

    return { success: true };
  };

  const signOut = async () => {
    const { error } = await supabaseAuth.signOut();
    
    if (error) {
      setAuthState(prev => ({ ...prev, error }));
    } else {
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
        error: null,
      });
    }
  };

  const testConnection = async () => {
    return await supabaseAuth.testConnection();
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { session } = await supabaseAuth.getSession();
        
        if (session?.user) {
          const authUser = await createAuthUser(session.user);
          setAuthState({
            user: authUser,
            session,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to initialize auth',
        });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabaseAuth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session?.user) {
          const authUser = await createAuthUser(session.user);
          setAuthState({
            user: authUser,
            session,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    testConnection,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
