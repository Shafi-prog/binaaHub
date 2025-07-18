// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { fatoorahService } from '@/core/shared/services/fatoorah-service';

// GET /api/fatoorah/callback - Handle payment callback from Fatoorah
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const paymentId = url.searchParams.get('paymentId');
    const invoiceId = url.searchParams.get('Id');
    
    if (!paymentId) {
      return NextResponse.redirect(new URL('/payment/error?reason=missing_payment_id', request.url));
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Process payment callback
    const callbackResult = await fatoorahService.processCallback(paymentId, 'success');

    if (callbackResult.success) {
      // Update invoice payment status
      const { error: updateError } = await supabase
        .from('invoices')
        .update({
          payment_status: 'paid',
          payment_method: 'fatoorah',
          payment_transaction_id: callbackResult.transactionId,
          payment_gateway_transaction_id: callbackResult.gatewayTransactionId,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('invoice_number', paymentId) // Using customer reference as payment ID
        .or(`id.eq.${invoiceId}`); // Fallback to invoice ID

      if (updateError) {
        console.error('Error updating invoice payment status:', updateError);
      }

      // Create notification for store owner
      const { data: invoice } = await supabase
        .from('invoices')
        .select('store_id, buyer_name, total_amount, invoice_number')
        .eq('invoice_number', paymentId)
        .or(`id.eq.${invoiceId}`)
        .single();

      if (invoice) {
        await supabase.from('notifications').insert({
          user_id: invoice.store_id,
          type: 'payment_received',
          title: 'تم استلام دفعة جديدة',
          message: `تم دفع فاتورة ${invoice.invoice_number} من العميل ${invoice.buyer_name} بقيمة ${invoice.total_amount} ريال`,
          data: {
            invoice_id: invoiceId,
            payment_amount: invoice.total_amount,
            customer_name: invoice.buyer_name
          },
          is_read: false,
          priority: 'normal',
          channel: 'app'
        });
      }

      return NextResponse.redirect(new URL(`/payment/success?invoice=${invoiceId || paymentId}`, request.url));
    }

    return NextResponse.redirect(new URL('/payment/error?reason=payment_failed', request.url));

  } catch (error) {
    console.error('Error processing Fatoorah callback:', error);
    return NextResponse.redirect(new URL('/payment/error?reason=processing_error', request.url));
  }
}

// POST /api/fatoorah/callback - Handle webhook from Fatoorah
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { InvoiceId, InvoiceStatus, PaymentId } = body;

    const supabase = createRouteHandlerClient({ cookies });

    // Process webhook payment status
    const paymentStatus = await fatoorahService.getPaymentStatusByInvoiceId(InvoiceId);

    if (paymentStatus.IsSuccess) {
      const status = paymentStatus.Data.InvoiceStatus === 'Paid' ? 'paid' : 'failed';
      
      // Update invoice status
      await supabase
        .from('invoices')
        .update({
          payment_status: status,
          payment_method: 'fatoorah',
          payment_transaction_id: PaymentId,
          paid_at: status === 'paid' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', InvoiceId);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 400 });

  } catch (error) {
    console.error('Error processing Fatoorah webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}


