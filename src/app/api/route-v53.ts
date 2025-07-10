// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { fatoorahService } from '@/domains/shared/services/fatoorah-service';

// POST /api/fatoorah/create-payment
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invoiceId } = await request.json();

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items (
          description,
          quantity,
          unit_price
        )
      `)
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Check if user is authorized (either store owner or customer)
    if (invoice.store_id !== user.id && invoice.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized access to invoice' }, { status: 403 });
    }

    // Create payment URL with Fatoorah
    const paymentResult = await fatoorahService.createInvoicePaymentUrl({
      id: invoice.id,
      total_amount: invoice.total_amount,
      buyer_name: invoice.buyer_name,
      buyer_email: invoice.buyer_email,
      buyer_phone: invoice.buyer_phone,
      invoice_number: invoice.invoice_number,
      items: invoice.invoice_items || []
    });

    if (paymentResult.success) {
      // Update invoice with payment URL and status
      await supabase
        .from('invoices')
        .update({
          payment_url: paymentResult.paymentUrl,
          payment_status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', invoiceId);

      return NextResponse.json({
        success: true,
        paymentUrl: paymentResult.paymentUrl
      });
    }

    return NextResponse.json({
      success: false,
      message: paymentResult.message
    }, { status: 400 });

  } catch (error) {
    console.error('Error creating Fatoorah payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}


