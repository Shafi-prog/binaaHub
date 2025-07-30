import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🧪 API TEST: Starting data verification...');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const userId = 'user@binna.com';
    console.log('🔍 API TEST: Testing for user:', userId);

    // Test profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    console.log('👤 API TEST Profile result:', { 
      found: !!profileData, 
      loyaltyPoints: profileData?.loyalty_points,
      error: profileError?.message 
    });

    // Test projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('construction_projects')
      .select('*')
      .eq('user_id', userId);

    console.log('🏗️ API TEST Projects result:', { 
      count: projectsData?.length || 0,
      error: projectsError?.message 
    });

    // Test orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId);

    console.log('📦 API TEST Orders result:', { 
      count: ordersData?.length || 0,
      totalAmount: ordersData?.reduce((sum, order) => sum + order.total_amount, 0) || 0,
      error: ordersError?.message 
    });

    // Test warranties
    const { data: warrantiesData, error: warrantiesError } = await supabase
      .from('warranties')
      .select('*')
      .eq('user_id', userId);

    console.log('🛡️ API TEST Warranties result:', { 
      count: warrantiesData?.length || 0,
      activeCount: warrantiesData?.filter(w => w.status === 'active').length || 0,
      error: warrantiesError?.message 
    });

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
    console.error('❌ API TEST Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
