// Test page to debug login in the browser
'use client';

import { useState } from 'react';
import { createEnhancedSupabaseClient, testSupabaseConnection } from '@/lib/supabase/enhanced-client';

export default function LoginDebugPage() {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
    console.log(message);
  };

  const testProxyLogin = async () => {
    setIsLoading(true);
    setResults([]);
    
    const email = 'testuser3@binna.com';
    const password = 'password123';
    
    addResult('🔄 Testing proxy login (via API route)...');
    addResult(`📧 Email: ${email}`);
    
    try {
      const response = await fetch('/api/auth/proxy-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        addResult('✅ Proxy login successful!');
        addResult(`   User ID: ${result.user.id}`);
        addResult(`   Email: ${result.user.email}`);
        addResult(`   Email confirmed: ${result.user.emailConfirmed ? 'Yes' : 'No'}`);
        
        if (result.profile) {
          addResult(`   Profile: ${result.profile.displayName}`);
          addResult(`   Loyalty points: ${result.profile.loyaltyPoints}`);
        } else {
          addResult('❌ No profile found');
          if (result.profileError) {
            addResult(`   Profile error: ${result.profileError}`);
          }
        }
      } else {
        addResult(`❌ Proxy login failed: ${result.error}`);
        if (result.code) {
          addResult(`   Error code: ${result.code}`);
        }
      }
    } catch (error) {
      addResult(`❌ Proxy login API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testServerSide = async () => {
    setIsLoading(true);
    setResults([]);
    
    addResult('🖥️ Testing server-side Supabase connection...');
    
    try {
      const response = await fetch('/api/test-supabase');
      const result = await response.json();
      
      if (result.success) {
        addResult('✅ Server-side test successful!');
        addResult(`   Profile count: ${result.profileCount}`);
        addResult(`   User exists: ${result.userExists ? 'Yes' : 'No'}`);
        addResult(`   User count: ${result.userCount}`);
        if (result.userProfile) {
          addResult(`   User: ${result.userProfile.name} (${result.userProfile.id})`);
        }
        addResult(`   Auth worked: ${result.authWorked ? 'Yes' : 'No'}`);
      } else {
        addResult(`❌ Server-side test failed: ${result.error}`);
        addResult(`   Test: ${result.test}`);
        if (result.userExists !== undefined) {
          addResult(`   User exists: ${result.userExists ? 'Yes' : 'No'}`);
          addResult(`   User count: ${result.userCount || 'Unknown'}`);
        }
      }
    } catch (error) {
      addResult(`❌ Server-side API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    setResults([]);
    
    const supabase = createEnhancedSupabaseClient();
    const email = 'testuser3@binna.com';
    const password = 'password123';
    
    addResult('🔍 Starting browser login test...');
    addResult(`📧 Email: ${email}`);
    
    try {
      // Test environment variables
      addResult('🌐 Environment check:');
      addResult(`   NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...`);
      addResult(`   Anon key present: ${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
      
      // Test connection
      addResult('\n🔌 Testing Supabase connection...');
      const connectionResult = await testSupabaseConnection();
      if (connectionResult.connected) {
        addResult('✅ Connection successful');
      } else {
        addResult(`❌ Connection failed: ${connectionResult.error}`);
      }
      
      // Test login
      addResult('\n🔐 Attempting login...');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) {
        addResult(`❌ Login failed: ${authError.message}`);
        addResult(`   Error code: ${authError.status}`);
        addResult(`   Error details: ${JSON.stringify(authError, null, 2)}`);
        
        // Check if user exists in profiles
        addResult('\n👤 Checking user profile...');
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', email)
          .maybeSingle();
          
        if (profileError) {
          addResult(`❌ Profile check failed: ${profileError.message}`);
        } else if (profileData) {
          addResult(`✅ Profile exists: ${profileData.display_name} (ID: ${profileData.user_id})`);
        } else {
          addResult('❌ No profile found');
        }
      } else {
        addResult('✅ Login successful!');
        addResult(`   User ID: ${authData.user?.id}`);
        addResult(`   Email: ${authData.user?.email}`);
        addResult(`   Email confirmed: ${authData.user?.email_confirmed_at ? 'Yes' : 'No'}`);
        
        // Test profile fetch
        addResult('\n👤 Fetching user profile...');
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', authData.user?.id)
          .maybeSingle();
          
        if (profileError) {
          addResult(`❌ Profile fetch failed: ${profileError.message}`);
        } else if (profile) {
          addResult(`✅ Profile found: ${profile.display_name}`);
          addResult(`   Loyalty points: ${profile.loyalty_points}`);
        } else {
          addResult('❌ No profile found');
        }
        
        // Sign out
        await supabase.auth.signOut();
        addResult('\n🚪 Signed out');
      }
      
    } catch (error) {
      addResult(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login Debug Tool</h1>
      
      <button
        onClick={testProxyLogin}
        disabled={isLoading}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 mr-4"
      >
        {isLoading ? 'Testing...' : 'Test Proxy Login'}
      </button>
      
      <button
        onClick={testLogin}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mr-4"
      >
        {isLoading ? 'Testing...' : 'Test Browser Login'}
      </button>
      
      <button
        onClick={testServerSide}
        disabled={isLoading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Server-Side'}
      </button>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Results:</h2>
        <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-gray-500">Click "Test Login" to start debugging</p>
          ) : (
            <pre className="text-sm whitespace-pre-wrap">
              {results.join('\n')}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
