// @ts-nocheck
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';


export const dynamic = 'force-dynamic'
export default function StoreLogin() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login('store');
    router.push('/store/pages/dashboard');
  };

  return (
    <div>
      <h2>Store Login</h2>
      <button onClick={handleLogin}>Login as Store</button>
    </div>
  );
}


