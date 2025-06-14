'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, FileText, ArrowRight, Download, Receipt } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<{
    invoiceId?: string;
    amount?: string;
    transactionId?: string;
  }>({});

  useEffect(() => {
    const invoiceId = searchParams.get('invoice');    const amount = searchParams.get('amount');
    const transactionId = searchParams.get('transaction');

    setPaymentInfo({
      invoiceId: invoiceId || undefined,
      amount: amount || undefined,
      transactionId: transactionId || undefined
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal flex items-center justify-center p-4" dir="rtl">
      <Card className="max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            تم الدفع بنجاح!
          </h1>
          <p className="text-gray-600">
            شكراً لك، تم معالجة دفعتك بنجاح
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
          <h3 className="font-semibold text-gray-900 mb-3">تفاصيل الدفعة</h3>
          <div className="space-y-2 text-sm">
            {paymentInfo.invoiceId && (
              <div className="flex justify-between">
                <span className="text-gray-600">رقم الفاتورة:</span>
                <span className="font-mono font-medium">{paymentInfo.invoiceId}</span>
              </div>
            )}
            {paymentInfo.amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">المبلغ المدفوع:</span>
                <span className="font-medium text-green-600">{paymentInfo.amount} ر.س</span>
              </div>
            )}
            {paymentInfo.transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">رقم المعاملة:</span>
                <span className="font-mono text-xs">{paymentInfo.transactionId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">التاريخ:</span>
              <span>{new Date().toLocaleDateString('ar-SA')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الحالة:</span>
              <span className="text-green-600 font-medium">مدفوع</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {paymentInfo.invoiceId && (
            <Link href={`/store/invoices/${paymentInfo.invoiceId}`}>
              <Button className="w-full" variant="outline">
                <FileText className="w-4 h-4 ml-2" />
                عرض الفاتورة
              </Button>
            </Link>
          )}
          
          <Button className="w-full" variant="outline" onClick={() => window.print()}>
            <Receipt className="w-4 h-4 ml-2" />
            طباعة إيصال الدفع
          </Button>

          <Link href="/">
            <Button className="w-full">
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-500">
            سيتم إرسال إيصال الدفع إلى بريدك الإلكتروني
          </p>
          <p className="text-xs text-gray-400 mt-1">
            تمت العملية بواسطة نظام فاتورة الآمن
          </p>
        </div>
      </Card>
    </div>
  );
}
