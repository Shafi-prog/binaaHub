"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { tempAuthService, type TempUser } from '@/core/shared/services/temp-auth';

interface AuthContextType {
  user: TempUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (userData: { email: string; password: string; name: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<TempUser | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start as false since we're not auto-authenticating

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = tempAuthService.onAuthStateChange((newUser) => {
      setUser(newUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await tempAuthService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await tempAuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { email: string; password: string; name: string }) => {
    setIsLoading(true);
    try {
      const result = await tempAuthService.register(userData);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user?.isAuthenticated,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
