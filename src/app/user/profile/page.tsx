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
import { toast } from 'react-hot-toast';

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

function generateInvitationCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return `BinnaHub - ${code}`;
}

function formatInvitationCode(code: string) {
  if (!code) return '';
  return code.startsWith('BinnaHub - ') ? code : `BinnaHub - ${code}`;
}

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
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
        // Invitation code logic
        const { data: userRow } = await supabase
          .from('users')
          .select('invitation_code')
          .eq('id', authResult.user.id)
          .single();
        if (userRow?.invitation_code) {
          setInvitationCode(userRow.invitation_code);
        } else {
          const newCode = generateInvitationCode();
          setInvitationCode(newCode);
          await supabase.from('users').update({ invitation_code: newCode }).eq('id', authResult.user.id);
        }
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-blue-700">الملف الشخصي</h1>
            <Link href="/user/help-center/articles/getting-started" className="text-blue-600 hover:underline">دليل البدء</Link>
            {invitationCode && (
              <span className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2">
                رمز الدعوة: {formatInvitationCode(invitationCode)}
                <button
                  type="button"
                  className="ml-2 text-blue-600 hover:underline"
                  onClick={async () => {
                    await navigator.clipboard.writeText(formatInvitationCode(invitationCode));
                    toast.dismiss();
                    toast.success('تم نسخ رمز الدعوة!');
                  }}
                >
                  نسخ
                </button>
              </span>
            )}
          </div>
          <UserProfileForm user={user || {}} />
          {/* Invitation code activation section for users */}
          <div className="my-6 p-4 bg-gray-50 border rounded">
            <h2 className="font-bold mb-2 text-blue-700">تفعيل رمز دعوة أو عمولة</h2>
            <form onSubmit={async e => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const code = (formData.get('invitecode') as string)?.trim();
              if (!code) return alert('يرجى إدخال رمز الدعوة');
              const res = await fetch('/api/activate-invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
              });
              const data = await res.json();
              if (data.success) {
                alert('تم تفعيل الرمز بنجاح!');
                form.reset();
              } else {
                alert(data.error || 'فشل تفعيل الرمز');
              }
            }} className="flex gap-2 items-center">
              <input name="invitecode" className="border rounded px-3 py-2" placeholder="الصق رمز الدعوة هنا" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">تفعيل</button>
            </form>
            <div className="text-xs text-gray-500 mt-1">يمكنك لصق رمز دعوة من متجر أو مستخدم آخر ليحصل على مزايا أو عمولة.</div>
          </div>
        </div>
      </Card>
      <Link href="/user/help-center" className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full shadow-lg px-5 py-3 hover:bg-blue-700 z-50">مساعدة؟</Link>
    </div>
  );
}
