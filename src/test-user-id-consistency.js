// Test script: Verifies that user_id is consistent across Supabase Auth and all main tables
// Usage: node src/test-user-id-consistency.js

const { createClient } = require('@supabase/supabase-js');

// Set your Supabase project URL and anon key (from your .env or dashboard)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Set your test user credentials here
const TEST_EMAIL = process.env.TEST_EMAIL || 'user@user.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '123456';

async function main() {
  console.log('🔍 Signing in as test user...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  if (signInError || !signInData.user) {
    console.error('❌ Sign-in failed:', signInError?.message);
    return;
  }
  const userId = signInData.user.id;
  console.log('✅ Auth user ID:', userId);

  // Check projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, user_id, name, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (projectsError) {
    console.error('❌ Error fetching projects:', projectsError.message);
  } else {
    console.log(`📁 Projects for user_id ${userId}:`, projects.length);
    if (projects.length > 0) {
      console.log('  Example project:', projects[0]);
    }
  }

  // Check warranties
  const { data: warranties, error: warrantiesError } = await supabase
    .from('warranties')
    .select('id, user_id, warranty_number, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (warrantiesError) {
    console.error('❌ Error fetching warranties:', warrantiesError.message);
  } else {
    console.log(`📄 Warranties for user_id ${userId}:`, warranties.length);
    if (warranties.length > 0) {
      console.log('  Example warranty:', warranties[0]);
    }
  }

  // Check orders
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, user_id, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (ordersError) {
    console.error('❌ Error fetching orders:', ordersError.message);
  } else {
    console.log(`🧾 Orders for user_id ${userId}:`, orders.length);
    if (orders.length > 0) {
      console.log('  Example order:', orders[0]);
    }
  }

  // Check user profile
  const { data: userProfile, error: userProfileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (userProfileError) {
    console.error('❌ Error fetching user profile:', userProfileError.message);
  } else {
    console.log('👤 User profile:', userProfile);
  }

  console.log('\n✅ If all user_id values above match the Auth user ID, your data is consistent!');
}

main();
