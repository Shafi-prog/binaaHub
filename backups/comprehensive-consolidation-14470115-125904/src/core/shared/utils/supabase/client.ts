// Supabase Client Utility
// Provides configured Supabase client for browser-side operations

import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback values for development
const defaultUrl = 'https://your-project.supabase.co';
const defaultKey = 'your-anon-key';

if (!supabaseUrl) {
  console.warn('NEXT_PUBLIC_SUPABASE_URL is not set. Using default URL for development.');
}

if (!supabaseAnonKey) {
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Using default key for development.');
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Helper functions for common operations
export const supabaseClient = {
  // Auth operations
  auth: {
    async signUp(email: string, password: string, metadata?: Record<string, any>) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      return { data, error };
    },

    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    },

    async signOut() {
      const { error } = await supabase.auth.signOut();
      return { error };
    },

    async getCurrentUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error };
    },

    async getSession() {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { session, error };
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
      return supabase.auth.onAuthStateChange(callback);
    }
  },

  // Database operations
  db: {
    async select(table: string, columns: string = '*', filters?: Record<string, any>) {
      let query = supabase.from(table).select(columns);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      const { data, error } = await query;
      return { data, error };
    },

    async insert(table: string, data: Record<string, any> | Record<string, any>[]) {
      const { data: result, error } = await supabase.from(table).insert(data).select();
      return { data: result, error };
    },

    async update(table: string, id: string, data: Record<string, any>) {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();
      return { data: result, error };
    },

    async delete(table: string, id: string) {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      return { data, error };
    }
  },

  // Storage operations
  storage: {
    async upload(bucket: string, path: string, file: File) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);
      return { data, error };
    },

    async download(bucket: string, path: string) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);
      return { data, error };
    },

    async getPublicUrl(bucket: string, path: string) {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      return data.publicUrl;
    },

    async delete(bucket: string, paths: string[]) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove(paths);
      return { data, error };
    }
  }
};

// Type definitions
export interface DatabaseRow {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface User extends DatabaseRow {
  email: string;
  name?: string;
  avatar_url?: string;
  role?: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

// Error handling
export const handleSupabaseError = (error: any) => {
  if (!error) return null;
  
  console.error('Supabase Error:', error);
  
  // Common error messages
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password',
    'Email not confirmed': 'Please check your email and click the confirmation link',
    'User already registered': 'An account with this email already exists',
    'weak_password': 'Password should be at least 6 characters',
    'invalid_email': 'Please enter a valid email address'
  };
  
  return errorMessages[error.message] || error.message || 'An unexpected error occurred';
};

// Development helpers
if (process.env.NODE_ENV === 'development') {
  // Add some logging for development
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.email);
  });
}

export default supabase;
