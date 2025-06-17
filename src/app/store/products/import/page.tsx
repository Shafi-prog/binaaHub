'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RemovedProductImportPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError('Authentication error. Please try logging in again.');
          setLoading(false);
          return;
        }

        if (!session?.user) {
          router.push('/auth');
          return;
        }

        // Check if user is a store owner
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('Error checking user type:', userError);
          setError('Failed to verify user permissions.');
          setLoading(false);
          return;
        }

        if (userData.user_type !== 'store_owner') {
          setError('Access denied. This feature is only available to store owners.');
          setLoading(false);
          return;
        }

        setUser(session.user);
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Failed to load user information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [supabase.auth, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full text-center bg-red-50 border-red-200">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>          <Link href="/store/products">
            <Button variant="default">
              Back to Products
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">
            Please log in as a store owner to access Excel import.
          </p>          <Link href="/auth">
            <Button variant="default">
              Login
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Product Import Moved</h1>
        <p className="mb-2">Product import is now managed in the Medusa admin panel.</p>
        <a href="http://localhost:9000/admin/products" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Go to Medusa Products</a>
      </div>
    </div>
  );
}
