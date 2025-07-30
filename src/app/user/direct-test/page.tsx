"use client";

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DirectDataTestPage() {
  const [data, setData] = useState<{
    profile: any;
    projects: any[];
    orders: any[];
    warranties: any[];
    loading: boolean;
    error: string | null;
  }>({
    profile: null,
    projects: [],
    orders: [],
    warranties: [],
    loading: true,
    error: null
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadDataDirectly() {
      try {
        const userId = 'user@binna.com';
        
        console.log('🔍 Direct Data Test: Loading data for', userId);

        // Load profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        console.log('Profile result:', { data: profileData, error: profileError });

        // Load projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('construction_projects')
          .select('*')
          .eq('user_id', userId);

        console.log('Projects result:', { count: projectsData?.length, error: projectsError });

        // Load orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId);

        console.log('Orders result:', { count: ordersData?.length, error: ordersError });

        // Load warranties
        const { data: warrantiesData, error: warrantiesError } = await supabase
          .from('warranties')
          .select('*')
          .eq('user_id', userId);

        console.log('Warranties result:', { count: warrantiesData?.length, error: warrantiesError });

        setData({
          profile: profileData,
          projects: projectsData || [],
          orders: ordersData || [],
          warranties: warrantiesData || [],
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error loading data:', error);
        setData(prev => ({ ...prev, loading: false, error: error.message }));
      }
    }

    loadDataDirectly();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 Direct Data Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loading State */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-2">⏳ Loading</h2>
          <p className={`text-lg font-mono ${data.loading ? 'text-orange-600' : 'text-green-600'}`}>
            {data.loading ? 'LOADING...' : 'LOADED'}
          </p>
        </div>

        {/* Error State */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-2">❌ Error</h2>
          <p className={`text-sm ${data.error ? 'text-red-600' : 'text-green-600'}`}>
            {data.error || 'No Error'}
          </p>
        </div>

        {/* Profile */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-2">👤 Profile</h2>
          <div className="text-sm">
            <p><strong>Found:</strong> {data.profile ? 'YES' : 'NO'}</p>
            {data.profile && (
              <>
                <p><strong>Name:</strong> {data.profile.display_name}</p>
                <p><strong>Email:</strong> {data.profile.email}</p>
                <p><strong>Loyalty:</strong> {data.profile.loyalty_points}</p>
              </>
            )}
          </div>
        </div>

        {/* Raw Counts */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-2">📊 Raw Counts</h2>
          <div className="text-sm">
            <p><strong>Projects:</strong> {data.projects.length}</p>
            <p><strong>Orders:</strong> {data.orders.length}</p>
            <p><strong>Warranties:</strong> {data.warranties.length}</p>
          </div>
        </div>

        {/* Orders Detail */}
        {data.orders.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg col-span-2">
            <h2 className="font-bold text-lg mb-2">📦 Orders Detail</h2>
            <div className="text-sm space-y-1">
              {data.orders.map((order, index) => (
                <p key={index}>Order {index + 1}: {order.total_amount} SAR</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
