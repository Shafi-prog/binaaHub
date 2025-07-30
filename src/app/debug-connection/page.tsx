"use client";

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DebugDataPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function debugSupabaseConnection() {
      console.log('🔍 DEBUGGING SUPABASE CONNECTION...');
      const supabase = createClientComponentClient();
      
      try {
        const userId = 'user@binna.com';
        console.log('📍 Testing with userId:', userId);

        // Test 1: Check user_profiles
        console.log('1️⃣ Testing user_profiles...');
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        console.log('Profile result:', { data: profileData, error: profileError });

        // Test 2: Check construction_projects
        console.log('2️⃣ Testing construction_projects...');
        const { data: projectsData, error: projectsError } = await supabase
          .from('construction_projects')
          .select('*')
          .eq('user_id', userId);

        console.log('Projects result:', { data: projectsData, error: projectsError });

        // Test 3: Check orders
        console.log('3️⃣ Testing orders...');
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId);

        console.log('Orders result:', { data: ordersData, error: ordersError });

        // Test 4: Check warranties
        console.log('4️⃣ Testing warranties...');
        const { data: warrantiesData, error: warrantiesError } = await supabase
          .from('warranties')
          .select('*')
          .eq('user_id', userId);

        console.log('Warranties result:', { data: warrantiesData, error: warrantiesError });

        // Compile results
        const results = {
          profile: { data: profileData, error: profileError },
          projects: { data: projectsData, error: projectsError },
          orders: { data: ordersData, error: ordersError },
          warranties: { data: warrantiesData, error: warrantiesError },
          connectionTest: 'SUCCESS'
        };

        setDebugInfo(results);
        console.log('🎯 Final debug results:', results);

      } catch (error) {
        console.error('❌ Debug error:', error);
        setDebugInfo({ connectionTest: 'FAILED', error: error.message });
      } finally {
        setIsLoading(false);
      }
    }

    debugSupabaseConnection();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🔍 Debugging Supabase Connection...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">🔍 Supabase Connection Debug Results</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold">Connection Status:</h3>
          <p className={debugInfo.connectionTest === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.connectionTest}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-bold">👤 User Profile:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(debugInfo.profile, null, 2)}
          </pre>
        </div>

        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-bold">🏗️ Construction Projects:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(debugInfo.projects, null, 2)}
          </pre>
        </div>

        <div className="bg-yellow-50 p-4 rounded">
          <h3 className="font-bold">📦 Orders:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(debugInfo.orders, null, 2)}
          </pre>
        </div>

        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-bold">🛡️ Warranties:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(debugInfo.warranties, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
