import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log('🔍 [DB-CHECK] Checking user records for:', email);

    // Check for all records with this email
    const { data: users, error } = await supabase.from('users').select('*').eq('email', email);

    if (error) {
      console.error('❌ [DB-CHECK] Query error:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    console.log('✅ [DB-CHECK] Found records:', users?.length || 0);

    return NextResponse.json({
      success: true,
      count: users?.length || 0,
      users: users,
    });
  } catch (error) {
    console.error('❌ [DB-CHECK] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: `Unexpected error: ${error}`,
      },
      { status: 500 }
    );
  }
}
