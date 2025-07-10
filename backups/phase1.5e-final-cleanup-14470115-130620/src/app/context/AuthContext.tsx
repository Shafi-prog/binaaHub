// @ts-nocheck
import React, { createContext, useContext, useState, ReactNode } from 'react';


export const dynamic = 'force-dynamic'
// Types: 'user', 'store', or null
interface AuthContextType {
  userType: 'user' | 'store' | null;
  login: (type: 'user' | 'store') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<'user' | 'store' | null>(null);

  const login = (type: 'user' | 'store') => setUserType(type);
  const logout = () => setUserType(null);

  return (
    <AuthContext.Provider value={{ userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}


