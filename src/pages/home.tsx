import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('auth');
    if (!isAuthenticated) {
      router.push('/login'); // إعادة التوجيه إلى تسجيل الدخول إذا لم يكن المستخدم مسجلاً الدخول
    }
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>Welcome to the Home Page</h1>
    </div>
  );
}