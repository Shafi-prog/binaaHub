const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dlunxrgldjmqjxrnbrpl.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsdW54cmdsamRtcWp4cm5icnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NTI5NjYsImV4cCI6MjA1MTEyODk2Nn0.K3xd_xTyFGMY0iJC7XVQzNHNLSGPgRh2y6TiFxR0rV8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testImprovedAuth() {
  console.log('🔍 Testing improved authentication flow...\n');

  try {
    // Step 1: Test direct login
    console.log('1. Testing login with test user...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'user@example.com',
      password: 'password123',
    });

    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
      return;
    }

    console.log('✅ Login successful:', loginData.user.email);
    console.log('   Access token:', loginData.session.access_token.substring(0, 20) + '...');

    // Step 2: Test session retrieval
    console.log('\n2. Testing session retrieval...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('❌ Session retrieval failed:', sessionError.message);
    } else if (sessionData.session) {
      console.log('✅ Session retrieved successfully:', sessionData.session.user.email);
    } else {
      console.log('⚠️ No session found');
    }

    // Step 3: Test user retrieval
    console.log('\n3. Testing user retrieval...');
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('❌ User retrieval failed:', userError.message);
    } else if (userData.user) {
      console.log('✅ User retrieved successfully:', userData.user.email);
    } else {
      console.log('⚠️ No user found');
    }

    // Step 4: Test session refresh
    console.log('\n4. Testing session refresh...');
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError) {
      console.error('❌ Session refresh failed:', refreshError.message);
    } else if (refreshData.session) {
      console.log('✅ Session refreshed successfully:', refreshData.session.user.email);
    } else {
      console.log('⚠️ No session after refresh');
    }

    console.log('\n🎉 Authentication test completed!');
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testImprovedAuth();
