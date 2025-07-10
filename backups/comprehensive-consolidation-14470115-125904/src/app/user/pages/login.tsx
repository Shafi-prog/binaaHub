// @ts-nocheck
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';


export const dynamic = 'force-dynamic'
export default function UserLogin() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login('user');
    router.push('/user/pages/dashboard');
  };

  return (
    <div>
      <h2>User Login</h2>
      <button onClick={handleLogin}>Login as User</button>
    </div>
  );
}


