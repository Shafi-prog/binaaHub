// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SupervisorService } from '@/lib/supervisor-service';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const data = await request.json();
    const { action, amount, paymentMethod, description } = data;
    
    // Perform action based on request
    if (action === 'add_funds') {
      const result = await SupervisorService.addFunds(
        user.id,
        amount,
        paymentMethod,
        description
      );
      
      return NextResponse.json(result);
    } else if (action === 'withdraw_funds') {
      const result = await SupervisorService.withdrawFunds(
        user.id,
        amount,
        description
      );
      
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in balance API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    
    if (action === 'get_balance') {
      const balance = await SupervisorService.getUserBalance(user.id);
      return NextResponse.json({ balance });
    } else if (action === 'get_transactions') {
      const limit = parseInt(searchParams.get('limit') || '10', 10);
      const offset = parseInt(searchParams.get('offset') || '0', 10);
      const transactions = await SupervisorService.getTransactionHistory(
        user.id,
        { limit, offset }
      );
      return NextResponse.json(transactions);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in balance API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}


