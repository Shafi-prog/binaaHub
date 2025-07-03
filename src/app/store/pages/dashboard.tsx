import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import StoreLayout from '../layout/StoreLayout';

export default function StoreDashboard() {
  const { userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userType !== 'store') {
      router.replace('/store/pages/login');
    }
  }, [userType, router]);

  if (userType !== 'store') {
    return null; // Or a loading spinner
  }

  return (
    <StoreLayout>
      <h1>Store Dashboard</h1>
      {/* Store-specific dashboard content here */}
    </StoreLayout>
  );
}
