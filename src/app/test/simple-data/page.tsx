"use client";

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SimpleDataTestPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        console.log('🔄 Starting simple data test...');
        const supabase = createClientComponentClient();
        const userId = 'user@binna.com';
        
        const results: any = { userId };
        
        // Load user profile
        console.log('Loading profile...');
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        results.profile = { data: profile, error: profileError };
        
        // Load projects
        console.log('Loading projects...');
        const { data: projects, error: projectsError } = await supabase
          .from('construction_projects')
          .select('*')
          .eq('user_id', userId);
          
        results.projects = { data: projects, error: projectsError, count: projects?.length || 0 };
        
        // Load orders
        console.log('Loading orders...');
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId);
          
        results.orders = { data: orders, error: ordersError, count: orders?.length || 0 };
        
        // Load warranties
        console.log('Loading warranties...');
        const { data: warranties, error: warrantiesError } = await supabase
          .from('warranties')
          .select('*')
          .eq('user_id', userId);
          
        results.warranties = { data: warranties, error: warrantiesError, count: warranties?.length || 0 };
        
        // Summary
        results.summary = {
          profileFound: !!profile,
          loyaltyPoints: profile?.loyalty_points || 0,
          totalSpent: profile?.total_spent || 0,
          currentLevel: profile?.current_level || 1,
          projectsCount: projects?.length || 0,
          ordersCount: orders?.length || 0,
          warrantiesCount: warranties?.length || 0
        };
        
        console.log('✅ Data loaded successfully:', results);
        setData(results);
        
      } catch (err) {
        console.error('❌ Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🧪 Simple Data Test</h1>
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🧪 Simple Data Test</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🧪 Simple Data Test Results</h1>
      
      {/* Summary */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">📊 Dashboard Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{data.summary?.loyaltyPoints || 0}</div>
            <div className="text-sm text-gray-600">Loyalty Points</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{data.summary?.totalSpent || 0}</div>
            <div className="text-sm text-gray-600">Total Spent (SAR)</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{data.summary?.currentLevel || 1}</div>
            <div className="text-sm text-gray-600">Level</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">{data.summary?.projectsCount || 0}</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">{data.summary?.ordersCount || 0}</div>
            <div className="text-sm text-gray-600">Orders</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{data.summary?.warrantiesCount || 0}</div>
            <div className="text-sm text-gray-600">Warranties</div>
          </div>
        </div>
      </div>
      
      {/* Profile */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">👤 Profile Data</h2>
        {data.profile?.error ? (
          <div className="text-red-600">Error: {JSON.stringify(data.profile.error)}</div>
        ) : data.profile?.data ? (
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(data.profile.data, null, 2)}
          </pre>
        ) : (
          <div className="text-gray-500">No profile data found</div>
        )}
      </div>
      
      {/* Projects */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">🏗️ Projects Data ({data.projects?.count || 0})</h2>
        {data.projects?.error ? (
          <div className="text-red-600">Error: {JSON.stringify(data.projects.error)}</div>
        ) : data.projects?.data?.length > 0 ? (
          <div className="space-y-2">
            {data.projects.data.slice(0, 3).map((project: any, index: number) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <div className="font-medium">{project.name}</div>
                <div className="text-sm text-gray-600">
                  {project.status} - {project.budget} SAR - {project.progress}%
                </div>
              </div>
            ))}
            {data.projects.data.length > 3 && (
              <div className="text-gray-500 text-sm">... and {data.projects.data.length - 3} more</div>
            )}
          </div>
        ) : (
          <div className="text-gray-500">No projects found</div>
        )}
      </div>
      
      {/* Orders */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">🛒 Orders Data ({data.orders?.count || 0})</h2>
        {data.orders?.error ? (
          <div className="text-red-600">Error: {JSON.stringify(data.orders.error)}</div>
        ) : data.orders?.data?.length > 0 ? (
          <div className="space-y-2">
            {data.orders.data.slice(0, 3).map((order: any, index: number) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <div className="font-medium">{order.order_number}</div>
                <div className="text-sm text-gray-600">
                  {order.status} - {order.total_amount} SAR
                </div>
              </div>
            ))}
            {data.orders.data.length > 3 && (
              <div className="text-gray-500 text-sm">... and {data.orders.data.length - 3} more</div>
            )}
          </div>
        ) : (
          <div className="text-gray-500">No orders found</div>
        )}
      </div>
      
      {/* Raw Data */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">🔍 Raw Data</h2>
        <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-96">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
