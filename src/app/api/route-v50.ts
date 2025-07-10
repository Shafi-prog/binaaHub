// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ExcelImportService } from '@/domains/shared/services/excel-import';

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
    
    // Get barcode from query
    const searchParams = request.nextUrl.searchParams;
    const barcode = searchParams.get('barcode');
    
    if (!barcode) {
      return NextResponse.json({ error: 'Barcode is required' }, { status: 400 });
    }
    
    // Search by barcode
    const result = await ExcelImportService.searchByBarcode(barcode, user.id);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in excel-import search API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}


