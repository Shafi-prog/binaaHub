"use client";

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function UserDataDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function runDebugTests() {
      try {
        setLoading(true);
        setError(null);
        
        const results: any = {};
        
        // Test environment variables
        results.envVars = {
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        };
        
        // Test Supabase client creation
        try {
          const supabase = createClientComponentClient();
          results.supabaseClient = {
            created: true,
            hasClient: !!supabase,
          };
          
          // Test database connection
          const userId = 'user@binna.com';
          
          // Test user profile
          console.log('Testing user profile query...');
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
            
          results.profileTest = {
            data: profileData,
            error: profileError,
            hasData: !!profileData,
          };
          
          // Test projects
          console.log('Testing projects query...');
          const { data: projectsData, error: projectsError } = await supabase
            .from('construction_projects')
            .select('*')
            .eq('user_id', userId);
            
          results.projectsTest = {
            count: projectsData?.length || 0,
            error: projectsError,
            hasData: !!projectsData,
            sample: projectsData?.[0],
          };
          
          // Test orders
          console.log('Testing orders query...');
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId);
            
          results.ordersTest = {
            count: ordersData?.length || 0,
            error: ordersError,
            hasData: !!ordersData,
            sample: ordersData?.[0],
          };
          
          // Test warranties
          console.log('Testing warranties query...');
          const { data: warrantiesData, error: warrantiesError } = await supabase
            .from('warranties')
            .select('*')
            .eq('user_id', userId);
            
          results.warrantiesTest = {
            count: warrantiesData?.length || 0,
            error: warrantiesError,
            hasData: !!warrantiesData,
          };
          
          // Test temp auth cookie
          const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
          };
          
          const tempAuthCookie = getCookie('temp_auth_user');
          results.tempAuth = {
            hasCookie: !!tempAuthCookie,
            cookieData: tempAuthCookie ? JSON.parse(decodeURIComponent(tempAuthCookie)) : null,
          };
          
        } catch (clientError) {
          results.supabaseClient = {
            created: false,
            error: clientError.message,
          };
        }
        
        setDebugInfo(results);
        console.log('Debug results:', results);
        
      } catch (err) {
        console.error('Debug test error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    runDebugTests();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🔍 User Data Debug</h1>
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🔍 User Data Debug Results</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Environment Variables */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">🔧 Environment Variables</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Has Supabase URL:</span>
              <span className={`ml-2 ${debugInfo.envVars?.hasSupabaseUrl ? 'text-green-600' : 'text-red-600'}`}>
                {debugInfo.envVars?.hasSupabaseUrl ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Has Supabase Key:</span>
              <span className={`ml-2 ${debugInfo.envVars?.hasSupabaseKey ? 'text-green-600' : 'text-red-600'}`}>
                {debugInfo.envVars?.hasSupabaseKey ? '✅ Yes' : '❌ No'}
              </span>
            </div>
          </div>
          <div className="mt-2">
            <span className="font-medium">Supabase URL:</span>
            <span className="ml-2 text-sm text-gray-600">{debugInfo.envVars?.supabaseUrl}</span>
          </div>
        </div>

        {/* Supabase Client */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">🔗 Supabase Client</h2>
          <div>
            <span className="font-medium">Client Created:</span>
            <span className={`ml-2 ${debugInfo.supabaseClient?.created ? 'text-green-600' : 'text-red-600'}`}>
              {debugInfo.supabaseClient?.created ? '✅ Success' : '❌ Failed'}
            </span>
          </div>
          {debugInfo.supabaseClient?.error && (
            <div className="mt-2 text-red-600 text-sm">
              Error: {debugInfo.supabaseClient.error}
            </div>
          )}
        </div>

        {/* User Profile Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">👤 User Profile Test</h2>
          <div className="mb-2">
            <span className="font-medium">Has Data:</span>
            <span className={`ml-2 ${debugInfo.profileTest?.hasData ? 'text-green-600' : 'text-red-600'}`}>
              {debugInfo.profileTest?.hasData ? '✅ Found' : '❌ Not Found'}
            </span>
          </div>
          {debugInfo.profileTest?.data && (
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <pre className="text-sm">{JSON.stringify(debugInfo.profileTest.data, null, 2)}</pre>
            </div>
          )}
          {debugInfo.profileTest?.error && (
            <div className="mt-2 text-red-600 text-sm">
              Error: {JSON.stringify(debugInfo.profileTest.error, null, 2)}
            </div>
          )}
        </div>

        {/* Projects Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">🏗️ Projects Test</h2>
          <div className="mb-2">
            <span className="font-medium">Count:</span>
            <span className="ml-2 text-blue-600">{debugInfo.projectsTest?.count || 0} projects</span>
          </div>
          {debugInfo.projectsTest?.sample && (
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <h4 className="font-medium mb-2">Sample Project:</h4>
              <pre className="text-sm">{JSON.stringify(debugInfo.projectsTest.sample, null, 2)}</pre>
            </div>
          )}
          {debugInfo.projectsTest?.error && (
            <div className="mt-2 text-red-600 text-sm">
              Error: {JSON.stringify(debugInfo.projectsTest.error, null, 2)}
            </div>
          )}
        </div>

        {/* Orders Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">🛒 Orders Test</h2>
          <div className="mb-2">
            <span className="font-medium">Count:</span>
            <span className="ml-2 text-blue-600">{debugInfo.ordersTest?.count || 0} orders</span>
          </div>
          {debugInfo.ordersTest?.sample && (
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <h4 className="font-medium mb-2">Sample Order:</h4>
              <pre className="text-sm">{JSON.stringify(debugInfo.ordersTest.sample, null, 2)}</pre>
            </div>
          )}
          {debugInfo.ordersTest?.error && (
            <div className="mt-2 text-red-600 text-sm">
              Error: {JSON.stringify(debugInfo.ordersTest.error, null, 2)}
            </div>
          )}
        </div>

        {/* Warranties Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">🛡️ Warranties Test</h2>
          <div className="mb-2">
            <span className="font-medium">Count:</span>
            <span className="ml-2 text-blue-600">{debugInfo.warrantiesTest?.count || 0} warranties</span>
          </div>
          {debugInfo.warrantiesTest?.error && (
            <div className="mt-2 text-red-600 text-sm">
              Error: {JSON.stringify(debugInfo.warrantiesTest.error, null, 2)}
            </div>
          )}
        </div>

        {/* Authentication Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">🔐 Authentication Test</h2>
          <div className="mb-2">
            <span className="font-medium">Has Temp Auth Cookie:</span>
            <span className={`ml-2 ${debugInfo.tempAuth?.hasCookie ? 'text-green-600' : 'text-red-600'}`}>
              {debugInfo.tempAuth?.hasCookie ? '✅ Found' : '❌ Not Found'}
            </span>
          </div>
          {debugInfo.tempAuth?.cookieData && (
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <h4 className="font-medium mb-2">Auth Cookie Data:</h4>
              <pre className="text-sm">{JSON.stringify(debugInfo.tempAuth.cookieData, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
