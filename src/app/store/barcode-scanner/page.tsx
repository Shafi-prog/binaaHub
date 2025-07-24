'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import type { Database } from '@/core/shared/types/database';
import BarcodeScanner from '@/core/shared/components/BarcodeScanner';
import { LoadingSpinner } from '@/core/shared/components/ui/loading-spinner';
import { Card } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


export default function BarcodeScannerPage() {
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
        <Card className="p-6 max-w-md w-full text-center bg-red-50 border-red-200">          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/stores">
            <Button variant="default" onClick={() => alert('Button clicked')}>
              Back to Stores
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
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>          <p className="text-gray-600 mb-4">
            Please log in to access the barcode scanner.
          </p>
          <Link href="/auth">
            <Button variant="default" onClick={() => alert('Button clicked')}>
              Login
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <Link href="/stores">
              <Button variant="secondary" className="mb-4" onClick={() => alert('Button clicked')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Stores
              </Button>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Barcode Scanner</h1>
            <p className="mt-2 text-gray-600">
              Scan product barcodes to find items and compare prices across stores.
            </p>
          </div>

          <BarcodeScanner />
        </div>
      </div>
    </div>
  );
}





