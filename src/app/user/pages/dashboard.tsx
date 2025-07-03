import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import UserLayout from '../layout/UserLayout';

export default function UserDashboard() {
  const { userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userType !== 'user') {
      router.replace('/user/pages/login');
    }
  }, [userType, router]);

  if (userType !== 'user') {
    return null; // Or a loading spinner
  }

  return (
    <UserLayout>
      <h1>User Dashboard</h1>
      {/* User-specific dashboard content here */}
    </UserLayout>
  );
}
