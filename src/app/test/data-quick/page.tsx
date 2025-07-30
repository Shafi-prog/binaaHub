"use client";

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function QuickDataTestPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testData() {
      try {
        console.log('🔍 Testing direct Supabase data access...');
        
        const supabase = createClientComponentClient();
        
        // Test simple query
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', 'user@binna.com')
          .single();
          
        console.log('Profile data:', profileData);
        console.log('Profile error:', profileError);
        
        const { data: projectsData, error: projectsError } = await supabase
          .from('construction_projects')
          .select('*')
          .eq('user_id', 'user@binna.com');
          
        console.log('Projects data:', projectsData?.length, 'projects');
        console.log('Projects error:', projectsError);
        
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', 'user@binna.com');
          
        console.log('Orders data:', ordersData?.length, 'orders');
        console.log('Orders error:', ordersError);
        
        setData({
          profile: profileData,
          projectsCount: projectsData?.length || 0,
          ordersCount: ordersData?.length || 0,
          loyaltyPoints: profileData?.loyalty_points || 0,
          totalSpent: profileData?.total_spent || 0,
          currentLevel: profileData?.current_level || 1
        });
        
      } catch (err) {
        console.error('Test error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    testData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading test data...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-red-600">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Quick Data Test Results</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Dashboard Data Preview</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-medium">User Profile</h3>
            <p>Name: {data?.profile?.display_name || 'N/A'}</p>
            <p>Email: {data?.profile?.email || 'N/A'}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-medium">Stats</h3>
            <p>Loyalty Points: {data?.loyaltyPoints}</p>
            <p>Total Spent: {data?.totalSpent} SAR</p>
            <p>Level: {data?.currentLevel}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="font-medium">Projects</h3>
            <p>Count: {data?.projectsCount}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-medium">Orders</h3>
            <p>Count: {data?.ordersCount}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Full Profile Data:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(data?.profile, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
