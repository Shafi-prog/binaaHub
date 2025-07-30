// API route to test Supabase connection from server-side
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    console.log('🔧 Server-side Supabase test');
    console.log('   URL:', supabaseUrl?.substring(0, 30) + '...');
    console.log('   Key present:', !!supabaseKey);
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test REST API
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact' })
      .limit(1);
    
    if (profileError) {
      return NextResponse.json({
        success: false,
        error: profileError.message,
        test: 'server-side REST API',
      });
    }
    
    // Test specific user (handle multiple rows)
    const { data: users, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'testuser3@binna.com');
    
    if (userError) {
      return NextResponse.json({
        success: false,
        error: userError.message,
        test: 'user lookup',
      });
    }
    
    const user = users?.[0]; // Get first user if multiple exist
    const userCount = users?.length || 0;
    
    // Test auth API
    const { data: authTest, error: authError } = await supabase.auth.signInWithPassword({
      email: 'testuser3@binna.com',
      password: 'password123',
    });
    
    if (authError) {
      return NextResponse.json({
        success: false,
        error: authError.message,
        test: 'auth login',
        userExists: !!user,
        userCount,
        userProfile: user ? { id: user.user_id, name: user.display_name } : null,
      });
    }
    
    // Sign out
    await supabase.auth.signOut();
    
    return NextResponse.json({
      success: true,
      connected: true,  // Add connected field for UI compatibility
      message: 'All tests passed',
      profileCount: profiles?.[0]?.count || 0,
      userExists: !!user,
      userCount,
      userProfile: user ? { id: user.user_id, name: user.display_name } : null,
      authWorked: true,
    });
    
  } catch (error) {
    console.error('Server-side test error:', error);
    return NextResponse.json({
      success: false,
      connected: false,  // Add connected field for UI compatibility
      error: error instanceof Error ? error.message : 'Unknown error',
      test: 'server-side general',
    });
  }
}
