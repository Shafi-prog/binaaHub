// Updated login page with proper Supabase authentication
'use client';

import { AuthProvider } from '@/core/shared/auth/AuthProvider';
import SupabaseLoginPage from '@/core/shared/components/SupabaseLoginPage';

export default function LoginPage() {
  return (
    <AuthProvider>
      <SupabaseLoginPage />
    </AuthProvider>
  );
}
