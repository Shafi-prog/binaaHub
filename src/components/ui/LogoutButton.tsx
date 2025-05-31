'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('تم تسجيل الخروج بنجاح');
      router.push('/login');
    } catch (error) {
      console.error('❌ [Logout] Error:', error);
      toast.error('حدث خطأ أثناء تسجيل الخروج');
      // Fallback
      window.location.href = '/login';
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-6 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition font-semibold"
    >
      تسجيل الخروج
    </button>
  );
}
