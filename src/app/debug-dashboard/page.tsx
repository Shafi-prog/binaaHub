'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { supabaseDataService } from '@/core/shared/services/supabase-data-service';

export default function DebugDashboard() {
  const { user, isLoading, error } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    const debugAuth = async () => {
      console.log('🔍 DEBUG: Auth state:', { user, isLoading, error });
      
      if (!user?.id) {
        setDebugInfo({
          authState: { user, isLoading, error },
          userAvailable: false,
          timestamp: new Date().toISOString()
        });
        return;
      }

      setDataLoading(true);
      try {
        console.log('🔍 DEBUG: Loading data for user ID:', user.id);
        
        // Test individual data loading
        const [profileData, ordersData, warrantiesData, projectsData, invoicesData] = await Promise.all([
          supabaseDataService.getUserProfile(user.id),
          supabaseDataService.getUserOrders(user.id),
          supabaseDataService.getUserWarranties(user.id),
          supabaseDataService.getUserProjects(user.id),
          supabaseDataService.getUserInvoices(user.id)
        ]);

        console.log('🔍 DEBUG: Loaded data:', {
          profile: profileData,
          orders: ordersData,
          warranties: warrantiesData,
          projects: projectsData,
          invoices: invoicesData
        });

        setDebugInfo({
          authState: { user, isLoading, error },
          userAvailable: true,
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
          data: {
            profile: profileData,
            ordersCount: ordersData?.length || 0,
            warrantiesCount: warrantiesData?.length || 0,
            projectsCount: projectsData?.length || 0,
            invoicesCount: invoicesData?.length || 0,
            profileLoyaltyPoints: profileData?.loyalty_points,
            profileBalance: profileData?.account_balance
          },
          rawData: {
            profile: profileData,
            orders: ordersData,
            warranties: warrantiesData,
            projects: projectsData,
            invoices: invoicesData
          },
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('🚨 DEBUG: Error loading data:', err);
        setDebugInfo({
          authState: { user, isLoading, error },
          userAvailable: true,
          userId: user.id,
          loadError: err instanceof Error ? err.message : String(err),
          timestamp: new Date().toISOString()
        });
      } finally {
        setDataLoading(false);
      }
    };

    debugAuth();
  }, [user, isLoading, error]);

  return (
    <div className="min-h-screen bg-gray-100 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔍 Debug Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Error:</strong> {error || 'None'}
            </div>
            <div>
              <strong>User Available:</strong> {user ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>User ID:</strong> {user?.id || 'N/A'}
            </div>
            <div>
              <strong>User Email:</strong> {user?.email || 'N/A'}
            </div>
            <div>
              <strong>User Role:</strong> {user?.role || 'N/A'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Data Loading Status</h2>
          <div>
            <strong>Data Loading:</strong> {dataLoading ? 'Yes' : 'No'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm" style={{ direction: 'ltr' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}
