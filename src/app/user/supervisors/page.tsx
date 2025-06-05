'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import SupervisorManagement from '@/components/SupervisorManagement';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui';

export default function SupervisorsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [filters, setFilters] = useState({ email: "", city: "" });
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        setUser(session.user);
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err instanceof Error ? err.message : 'Error loading user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [supabase, router]);

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
          <Link href="/user">
            <Button variant="default">
              Back to Dashboard
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSearch = () => {
    setFilters({ email, city });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/user/dashboard">
            <Button variant="secondary" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للوحة التحكم
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة المشرفين</h1>
              <p className="text-gray-600 mt-2">
                ابحث عن مشرفين للبناء وأدر مشاريعك بسهولة
              </p>
            </div>
          </div>        
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <Input
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-64"
          />
          <Input
            placeholder="المدينة"
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleSearch}>بحث</Button>
        </div>
        <SupervisorManagement filters={filters} userId={user.id} />
      </div>
    </div>
  );
}
