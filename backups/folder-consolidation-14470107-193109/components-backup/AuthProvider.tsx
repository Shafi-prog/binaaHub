import React from 'react';
import { AuthProvider as InnerAuthProvider } from '../app/context/AuthContext';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <InnerAuthProvider>{children}</InnerAuthProvider>;
}
