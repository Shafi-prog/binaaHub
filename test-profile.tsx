'use client';
import { useEffect, useState } from 'react';

export default function TestProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get cookie value
  const getCookie = (name: string) => {
    if (typeof window === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('🔄 [Test Profile] Starting authentication check...');
        
        const tempAuthCookie = getCookie('temp_auth_user');
        console.log('🔄 [Test Profile] Temp auth cookie check:', tempAuthCookie ? 'FOUND' : 'NOT FOUND');
        
        if (tempAuthCookie) {
          try {
            const parsedUser = JSON.parse(decodeURIComponent(tempAuthCookie));
            console.log('✅ [Test Profile] Temp auth user loaded:', parsedUser.email);
            setUser(parsedUser);
            setLoading(false);
            return;
          } catch (e) {
            console.warn('⚠️ [Test Profile] Failed to parse temp auth user:', e);
          }
        }
        
        console.log('❌ [Test Profile] No auth found');
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Test Profile Page</h1>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <p>Account Type: {user.account_type}</p>
        </div>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
}
