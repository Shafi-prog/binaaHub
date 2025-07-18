// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { initERPService, generateId, generateInvoiceNumber, calculateTotal } from '@/core/shared/services/erp/mongodb-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');
    const status = searchParams.get('status') || '';
    const customerId = searchParams.get('customer_id') || '';

    const erpService = await initERPService();
    
    let filter: any = {};
    if (status) {
      filter.status = status;
    }
    if (customerId) {
      filter.customer_id = customerId;
    }

    const invoices = await erpService.getInvoices(filter, limit, skip);
    
    return NextResponse.json({
      success: true,
      data: invoices
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const erpService = await initERPService();
    
    // Calculate totals
    const subtotal = body.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);
    const discount = body.discount || 0;
    const { vat, total } = calculateTotal(subtotal, 15, discount);
    
    const invoiceData = {
      ...body,
      id: generateId('INV-'),
      invoice_number: generateInvoiceNumber(),
      subtotal,
      vat_amount: vat,
      total,
      status: 'draft' as const,
      issue_date: new Date(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };

    const invoice = await erpService.createInvoice(invoiceData);
    
    return NextResponse.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}


