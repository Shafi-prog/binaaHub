#!/usr/bin/env node

/**
 * Comprehensive Supabase Connection and Health Check
 * Run this after fixing your Supabase project to verify everything works
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function runHealthCheck() {
    console.log('🔍 Starting Supabase Health Check...\n');

    // Check environment variables
    console.log('📋 Environment Variables:');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const databaseUrl = process.env.DATABASE_URL;

    console.log(`   SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
    console.log(`   SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`   SERVICE_ROLE_KEY: ${serviceRoleKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`   DATABASE_URL: ${databaseUrl ? '✅ Set' : '❌ Missing'}\n`);

    if (!supabaseUrl || !supabaseKey) {
        console.log('❌ Missing required environment variables!');
        return false;
    }

    try {
        // Test basic connection
        console.log('🌐 Testing Basic Connection...');
        const response = await fetch(supabaseUrl);
        if (response.ok) {
            console.log('   ✅ Supabase URL is accessible\n');
        } else {
            console.log(`   ❌ Supabase URL returned: ${response.status}\n`);
            return false;
        }

        // Create Supabase client
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Test auth
        console.log('🔐 Testing Authentication...');
        const { data: authData, error: authError } = await supabase.auth.getSession();
        if (authError) {
            console.log(`   ⚠️  Auth check: ${authError.message}`);
        } else {
            console.log('   ✅ Authentication service is working');
        }

        // Test database connection
        console.log('🗄️  Testing Database Connection...');
        const { data, error } = await supabase
            .from('users')
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.log(`   ⚠️  Database test: ${error.message}`);
            console.log('   💡 You may need to create the users table');
        } else {
            console.log('   ✅ Database connection successful');
            console.log(`   📊 Users table exists with ${data?.length || 0} records`);
        }

        // Test projects table
        console.log('📋 Testing Projects Table...');
        const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('count', { count: 'exact', head: true });

        if (projectsError) {
            console.log(`   ⚠️  Projects table test: ${projectsError.message}`);
            console.log('   💡 You may need to create the projects table');
        } else {
            console.log('   ✅ Projects table exists');
            console.log(`   📊 Projects table has ${projectsData?.length || 0} records`);
        }

        console.log('\n🎉 Health check completed!');
        return true;

    } catch (error) {
        console.log(`❌ Connection failed: ${error.message}`);
        return false;
    }
}

async function testLogin() {
    console.log('\n🔑 Testing Login API...');
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'testpassword'
            })
        });

        console.log(`   Status: ${response.status}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('   ✅ Login API is working');
            console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
        } else {
            const errorText = await response.text();
            console.log(`   ⚠️  Login API response: ${errorText}`);
        }
    } catch (error) {
        console.log(`   ❌ Login API test failed: ${error.message}`);
        console.log('   💡 Make sure your development server is running (npm run dev)');
    }
}

async function main() {
    console.log('🚀 Binaa ERP - Supabase Health Check\n');
    
    const healthCheckPassed = await runHealthCheck();
    
    if (healthCheckPassed) {
        await testLogin();
        
        console.log('\n📋 Next Steps:');
        console.log('1. If all tests passed, deploy to Vercel: vercel --prod');
        console.log('2. Update Vercel environment variables if needed');
        console.log('3. Test login on your live site');
        console.log('4. Test all AI features in the dashboard');
    } else {
        console.log('\n🔧 Fix Required:');
        console.log('1. Check your Supabase project status');
        console.log('2. Update environment variables');
        console.log('3. Run this script again');
    }
}

if (require.main === module) {
    main();
}

module.exports = { runHealthCheck, testLogin };
