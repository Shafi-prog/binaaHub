import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🧪 CONTEXT TEST: Starting same logic as UserDataContext...');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    console.log('🔧 Supabase client created with:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      keyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
    });

    const userId = 'user@binna.com';
    console.log('🔄 Loading data for user:', userId);

    // Load user profile (same as context)
    console.log('📡 Fetching user profile for userId:', userId);
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    console.log('👤 Profile query result:');
    console.log('   - userId searched:', userId);
    console.log('   - profileData:', profileData);
    console.log('   - profileError:', profileError);
    
    if (profileError) {
      console.error('❌ Profile query failed:', profileError);
    } else {
      console.log('✅ Profile query successful, data:', !!profileData);
    }

    // Load projects (same as context)
    console.log('📡 Fetching construction projects...');
    const { data: projectsData, error: projectsError } = await supabase
      .from('construction_projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('🏗️ Projects result:', { data: projectsData, error: projectsError });
    
    if (projectsError) {
      console.error('❌ Projects query failed:', projectsError);
    } else {
      console.log('✅ Projects query successful, count:', projectsData?.length || 0);
    }

    // Load orders (same as context)
    console.log('📡 Fetching orders...');
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('📦 Orders result:', { data: ordersData, error: ordersError });
    
    if (ordersError) {
      console.error('❌ Orders query failed:', ordersError);
    } else {
      console.log('✅ Orders query successful, count:', ordersData?.length || 0);
    }

    // Load warranties (same as context)
    console.log('📡 Fetching warranties...');
    const { data: warrantiesData, error: warrantiesError } = await supabase
      .from('warranties')
      .select('*')
      .eq('user_id', userId);

    console.log('🛡️ Warranties result:', { data: warrantiesData, error: warrantiesError });
    
    if (warrantiesError) {
      console.error('❌ Warranties query failed:', warrantiesError);
    } else {
      console.log('✅ Warranties query successful, count:', warrantiesData?.length || 0);
    }

    console.log('✅ CONTEXT TEST completed successfully!');

    return NextResponse.json({
      success: true,
      data: {
        profile: profileData,
        projectsCount: projectsData?.length || 0,
        ordersCount: ordersData?.length || 0,
        warrantiesCount: warrantiesData?.length || 0,
        totalOrderAmount: ordersData?.reduce((sum, order) => sum + order.total_amount, 0) || 0
      }
    });

  } catch (error) {
    console.error('❌ CONTEXT TEST Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
