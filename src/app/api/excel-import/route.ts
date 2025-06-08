import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ExcelImportService, GlobalItemData, StoreInventoryData } from '@/lib/excel-import';

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
    
    // Check if the request is multipart (file upload) or JSON
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // File upload
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }
      
      // Process the file
      const result = await ExcelImportService.processExcelFile(file, user.id);
      
      return NextResponse.json(result);
    } else {
      // JSON request for other actions
      const data = await request.json();
      
      switch (data.action) {
        case 'create_global_item':
          const itemData: GlobalItemData = {
            barcode: data.barcode,
            name: data.name,
            description: data.description || '',
            category: data.category,
            brand: data.brand,
            image_url: data.image_url || '',
          };
          
          const globalItem = await ExcelImportService.createGlobalItem(itemData);
          return NextResponse.json(globalItem);
          
        case 'add_to_store_inventory':
          const inventoryData: StoreInventoryData = {
            store_price: data.store_price,
            store_cost: data.store_cost,
            quantity: data.quantity,
            min_stock_level: data.min_stock_level,
            store_specific_notes: data.store_specific_notes || '',
          };
          
          const inventory = await ExcelImportService.addToStoreInventory(
            user.id,
            data.global_item_id,
            inventoryData
          );
          
          return NextResponse.json(inventory);
          
        default:
          return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }
    }
  } catch (error) {
    console.error('Error in excel-import API:', error);
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
    
    if (searchParams.has('action') && searchParams.get('action') === 'sessions') {
      // Get import sessions for the user
      const sessions = await ExcelImportService.getImportSessions(user.id);
      return NextResponse.json({ sessions });
    } else if (searchParams.has('barcode')) {
      // Search by barcode
      const barcode = searchParams.get('barcode') as string;
      const result = await ExcelImportService.searchByBarcode(barcode, user.id);
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in excel-import API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
