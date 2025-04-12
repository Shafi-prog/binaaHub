'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center font-tajawal">
      <Link href="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="شعار بناء" style={{ width: '50px', height: '50px' }} />
        <span className="text-sm font-bold text-blue-700 hidden md:inline">بناء دون عناء</span>
      </Link>

      <div className="flex gap-4 items-center text-sm">
        <Link href="/" className="hover:text-blue-500">الرئيسية</Link>

        {user ? (
          <>
            <Link href="/profile" className="hover:text-blue-500">
              {user.name}
            </Link>
            <button onClick={handleLogout} className="text-red-500 hover:underline">
              تسجيل الخروج
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-blue-500">تسجيل الدخول</Link>
            <Link href="/signup" className="hover:text-blue-500">إنشاء حساب</Link>
          </>
        )}
      </div>
    </nav>
  );
}
