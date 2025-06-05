'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { Card, LoadingSpinner } from '../../../components/ui';
import { MapPicker } from '../../../components/maps/MapPicker';
import UserProfileForm from '@/components/user/UserProfileForm';

interface Coordinates {
  lat: number;
  lng: number;
}

interface UserData {
  name: string;
  countryCode: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  coordinates: Coordinates | null;
}

const validatePhoneNumber = (phone: string, countryCode: string) => {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  // Check if empty
  if (!cleanPhone) return { valid: true, error: null };

  // Validation rules by country code
  const rules: { [key: string]: { pattern: RegExp; length: number } } = {
    '+966': { pattern: /^(5)\d+$/, length: 9 }, // Saudi: 5XXXXXXXX
    '+971': { pattern: /^(5|4|2|3|6|7)\d+$/, length: 9 }, // UAE
    '+974': { pattern: /^(3|5|6|7)\d+$/, length: 8 }, // Qatar
    '+973': { pattern: /^(3|6)\d+$/, length: 8 }, // Bahrain
    '+965': { pattern: /^(5|6|9)\d+$/, length: 8 }, // Kuwait
    '+968': { pattern: /^(7|9)\d+$/, length: 8 }, // Oman
  };

  const rule = rules[countryCode];
  if (!rule) {
    return { valid: false, error: 'رمز الدولة غير مدعوم' };
  }

  if (cleanPhone.length !== rule.length) {
    return {
      valid: false,
      error: `يجب أن يتكون رقم الهاتف من ${rule.length} أرقام${rule.pattern.toString().includes('5') ? ' ويبدأ برقم 5' : ''}`,
    };
  }

  if (!rule.pattern.test(cleanPhone)) {
    return { valid: false, error: 'رقم الهاتف غير صحيح' };
  }

  return { valid: true, error: null };
};

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const authResult = await verifyAuthWithRetry();
        if (authResult.error || !authResult.user) {
          router.push('/login');
          return;
        }
        setUser(authResult.user);
        // Check if user profile is incomplete (e.g., missing name, phone, city, etc.)
        const { data: userProfile } = await supabase
          .from('users')
          .select('name, phone, city, region')
          .eq('id', authResult.user.id)
          .single();
        if (!userProfile || !userProfile.name || !userProfile.phone || !userProfile.city || !userProfile.region) {
          // Already on profile page, so do nothing
        } else {
          // If profile is complete and this is a forced redirect, optionally redirect to dashboard
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <UserProfileForm user={user || {}} />
        </div>
      </Card>
    </div>
  );
}
