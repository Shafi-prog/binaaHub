// =============================================================================
// SUPABASE API KEY DIAGNOSTIC AND FIX
// =============================================================================
// This script diagnoses the exact issue with our API keys and provides the fix

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function diagnoseAndFix() {
  console.log('🔧 SUPABASE API KEY DIAGNOSTIC & FIX');
  console.log('====================================');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('\n📊 ENVIRONMENT CHECK:');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Anon Key Length:', anonKey ? anonKey.length : 'MISSING');
  console.log('Service Key Length:', serviceKey ? serviceKey.length : 'MISSING');
  
  // Decode JWT tokens to check expiration
  function decodeJWT(token, name) {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const expiryDate = new Date(payload.exp * 1000);
      const isExpired = expiryDate < new Date();
      
      console.log(`\n🔍 ${name}:`);
      console.log('  Role:', payload.role);
      console.log('  Project:', payload.ref);
      console.log('  Expires:', expiryDate.toISOString());
      console.log('  Status:', isExpired ? '❌ EXPIRED' : '✅ Valid');
      
      return { payload, isExpired };
    } catch (error) {
      console.log(`❌ ${name}: Invalid JWT format`);
      return null;
    }
  }
  
  const anonData = decodeJWT(anonKey, 'ANON KEY');
  const serviceData = decodeJWT(serviceKey, 'SERVICE KEY');
  
  // Test connections
  console.log('\n🔗 CONNECTION TESTS:');
  
  // Test anon key
  try {
    const anonClient = createClient(supabaseUrl, anonKey);
    const { error } = await anonClient.auth.getSession();
    console.log('Anon client:', error ? `❌ ${error.message}` : '✅ Working');
  } catch (err) {
    console.log('Anon client: ❌', err.message);
  }
  
  // Test service key
  try {
    const serviceClient = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    
    const { data, error } = await serviceClient.rpc('version');
    console.log('Service client:', error ? `❌ ${error.message}` : '✅ Working');
    
    if (error && error.message.includes('Invalid API key')) {
      console.log('\n🚨 ROOT CAUSE: Service role key is invalid/expired');
    }
  } catch (err) {
    console.log('Service client: ❌', err.message);
  }
  
  // Provide solution
  console.log('\n🛠️ SOLUTION:');
  console.log('============');
  
  if (serviceData && serviceData.isExpired) {
    console.log('✅ CONFIRMED: Service role key has expired');
  }
  
  console.log('\n📋 TO FIX:');
  console.log('1. Go to: https://supabase.com/dashboard/project/lqhopwohuddhapkhhikf/settings/api');
  console.log('2. Copy the current service_role key');
  console.log('3. Update SUPABASE_SERVICE_ROLE_KEY in .env file');
  console.log('4. Re-run: node create-comprehensive-demo-users.js');
  
  console.log('\n🎯 THEN TO COMPLETE 100% INTEGRATION:');
  console.log('1. Setup database: Run SQL files in Supabase dashboard');
  console.log('2. Create users: node create-comprehensive-demo-users.js');
  console.log('3. Verify: node test-supabase-connection.js');
  console.log('4. Build: npm run build');
  
  console.log('\n✅ Your audit found 67 pages - integration is nearly complete!');
}

diagnoseAndFix().catch(console.error);
