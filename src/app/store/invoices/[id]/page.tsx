'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Download,
  Send,
  Edit,
  Trash2,
  QrCode,
  Check,
  X,
  Clock,
  FileText,
  Printer,
  Share2,
  CreditCard,
  Eye,
  Shield,
  ExternalLink
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_type: string;
  issue_date: string;
  due_date: string;
  
  buyer_name: string;
  buyer_email?: string;
  buyer_phone?: string;
  buyer_vat_number?: string;
  buyer_address?: string;
  buyer_city?: string;
  
  subtotal_amount: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  currency: string;
    status: string;
  payment_status?: string;
  payment_url?: string;
  payment_terms?: string;
  notes?: string;
  
  zatca_submission_status: string;
  is_zatca_compliant: boolean;
  zatca_uuid?: string;
  qr_code?: string;
  
  created_at: string;
  updated_at: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
}

interface StoreInfo {
  store_name: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  vat_number?: string;
  commercial_registration?: string;
}

export default function InvoiceView() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  useEffect(() => {
    loadInvoiceData();
  }, [invoiceId]);

  const loadInvoiceData = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Load invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .eq('store_id', currentUser.id)
        .single();

      if (invoiceError) {
        console.error('Error loading invoice:', invoiceError);
        router.push('/store/invoices');
        return;
      }
      setInvoice(invoiceData);

      // Load invoice items
      const { data: itemsData, error: itemsError } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('created_at');

      if (!itemsError) {
        setInvoiceItems(itemsData || []);
      }

      // Load store info
      const { data: storeData, error: storeError } = await supabase
        .from('store_profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (!storeError) {
        setStoreInfo(storeData);
      }

    } catch (error) {
      console.error('Error loading invoice data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'sent': return 'مرسلة';
      case 'paid': return 'مدفوعة';
      case 'overdue': return 'متأخرة';
      case 'cancelled': return 'ملغية';
      default: return status;
    }
  };

  const getZATCAStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const downloadPDF = () => {
    // Placeholder for PDF generation
    alert('سيتم تنفيذ تصدير PDF قريباً');
  };
  const shareInvoice = () => {
    if (navigator.share) {
      navigator.share({
        title: `فاتورة ${invoice?.invoice_number}`,
        text: `فاتورة من ${storeInfo?.store_name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط الفاتورة');
    }
  };

  const createPaymentLink = async () => {
    if (!invoice) return;

    try {
      const response = await fetch('/api/fatoorah/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          invoiceId: invoice.id
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update invoice state with payment URL
        setInvoice({...invoice, payment_url: result.paymentUrl});
        alert('تم إنشاء رابط الدفع بنجاح');
      } else {
        alert('حدث خطأ في إنشاء رابط الدفع: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
      alert('حدث خطأ في إنشاء رابط الدفع');
    }
  };

  const sendPaymentLink = () => {
    if (!invoice?.payment_url) {
      alert('يجب إنشاء رابط الدفع أولاً');
      return;
    }

    if (navigator.share) {
      navigator.share({
        title: `رابط دفع فاتورة ${invoice.invoice_number}`,
        text: `يرجى استخدام هذا الرابط لدفع فاتورة ${invoice.invoice_number} بقيمة ${formatCurrency(invoice.total_amount, invoice.currency)}`,
        url: invoice.payment_url,
      });
    } else {
      navigator.clipboard.writeText(invoice.payment_url);
      alert('تم نسخ رابط الدفع');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الفاتورة...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">الفاتورة غير موجودة</h3>
          <p className="text-gray-500">الفاتورة المطلوبة غير موجودة أو تم حذفها</p>
          <Link href="/store/invoices">
            <Button className="mt-4">العودة للفواتير</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      {/* Header - Hide on print */}
      <div className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/store/invoices">
                <Button variant="outline" size="sm" className="ml-4">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">فاتورة {invoice.invoice_number}</h1>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)} ml-2`}>
                    {getStatusText(invoice.status)}
                  </span>
                  {invoice.is_zatca_compliant && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      <Shield className="w-3 h-3 ml-1" />
                      متوافق مع زاتكا
                    </span>
                  )}
                </div>
              </div>
            </div>            <div className="flex gap-2">
              {/* Payment buttons - Only show for unpaid invoices */}
              {invoice.status !== 'draft' && invoice.payment_status !== 'paid' && (
                <>
                  {!invoice.payment_url ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={createPaymentLink}
                      className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <CreditCard className="w-4 h-4 ml-1" />
                      إنشاء رابط دفع
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={sendPaymentLink}
                        className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        <Send className="w-4 h-4 ml-1" />
                        إرسال رابط الدفع
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(invoice.payment_url, '_blank')}
                        className="bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"
                      >
                        <ExternalLink className="w-4 h-4 ml-1" />
                        فتح صفحة الدفع
                      </Button>
                    </div>
                  )}
                </>
              )}
              
              <Button variant="outline" size="sm" onClick={shareInvoice}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={printInvoice}>
                <Printer className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={downloadPDF}>
                <Download className="w-4 h-4" />
              </Button>
              {invoice.status === 'draft' && (
                <Link href={`/store/invoices/${invoice.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 bg-white">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Store Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">من:</h2>
              <div className="space-y-1">
                <div className="text-lg font-semibold">{storeInfo?.store_name}</div>
                {storeInfo?.address && <div className="text-gray-600">{storeInfo.address}</div>}
                {storeInfo?.city && <div className="text-gray-600">{storeInfo.city}</div>}
                {storeInfo?.phone && <div className="text-gray-600">الهاتف: {storeInfo.phone}</div>}
                {storeInfo?.email && <div className="text-gray-600">البريد: {storeInfo.email}</div>}
                {storeInfo?.vat_number && (
                  <div className="text-gray-600">الرقم الضريبي: {storeInfo.vat_number}</div>
                )}
                {storeInfo?.commercial_registration && (
                  <div className="text-gray-600">السجل التجاري: {storeInfo.commercial_registration}</div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">إلى:</h2>
              <div className="space-y-1">
                <div className="text-lg font-semibold">{invoice.buyer_name}</div>
                {invoice.buyer_email && <div className="text-gray-600">{invoice.buyer_email}</div>}
                {invoice.buyer_phone && <div className="text-gray-600">الهاتف: {invoice.buyer_phone}</div>}
                {invoice.buyer_address && <div className="text-gray-600">{invoice.buyer_address}</div>}
                {invoice.buyer_city && <div className="text-gray-600">{invoice.buyer_city}</div>}
                {invoice.buyer_vat_number && (
                  <div className="text-gray-600">الرقم الضريبي: {invoice.buyer_vat_number}</div>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">رقم الفاتورة:</span>
                <span className="font-mono font-semibold">{invoice.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">تاريخ الإصدار:</span>
                <span>{new Date(invoice.issue_date).toLocaleDateString('ar-SA')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">تاريخ الاستحقاق:</span>
                <span>{new Date(invoice.due_date).toLocaleDateString('ar-SA')}</span>
              </div>
              {invoice.payment_terms && (
                <div className="flex justify-between">
                  <span className="text-gray-600">شروط الدفع:</span>
                  <span>{invoice.payment_terms}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">نوع الفاتورة:</span>
                <span className="capitalize">
                  {invoice.invoice_type === 'standard' ? 'عادية' : 'مبسطة'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">العملة:</span>
                <span>{invoice.currency}</span>
              </div>
              {invoice.zatca_uuid && (
                <div className="flex justify-between">
                  <span className="text-gray-600">UUID زاتكا:</span>
                  <span className="font-mono text-sm">{invoice.zatca_uuid.slice(0, 8)}...</span>
                </div>
              )}              <div className="flex justify-between">
                <span className="text-gray-600">حالة زاتكا:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getZATCAStatusColor(invoice.zatca_submission_status)}`}>
                  {invoice.zatca_submission_status === 'pending' ? 'في الانتظار' :
                   invoice.zatca_submission_status === 'submitted' ? 'مرسلة' :
                   invoice.zatca_submission_status === 'accepted' ? 'مقبولة' : 'مرفوضة'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">حالة الدفع:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  invoice.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {invoice.payment_status === 'paid' ? 'مدفوعة' :
                   invoice.payment_status === 'pending' ? 'في الانتظار' : 'غير مدفوعة'}
                </span>
              </div>
              {invoice.payment_url && (
                <div className="flex justify-between">
                  <span className="text-gray-600">رابط الدفع:</span>
                  <span className="text-green-600 text-xs">متاح</span>
                </div>
              )}
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">بنود الفاتورة</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الوصف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الكمية
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      السعر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الخصم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الضريبة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجمالي
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoiceItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.unit_price, invoice.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.discount_amount > 0 ? formatCurrency(item.discount_amount, invoice.currency) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{((item.tax_rate || 0) * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(item.tax_amount, invoice.currency)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.total_amount, invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">المجموع الفرعي:</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal_amount, invoice.currency)}</span>
              </div>
              {invoice.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>إجمالي الخصم:</span>
                  <span>-{formatCurrency(invoice.discount_amount, invoice.currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">ضريبة القيمة المضافة:</span>
                <span className="font-medium">{formatCurrency(invoice.tax_amount, invoice.currency)}</span>
              </div>
              {invoice.shipping_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">رسوم الشحن:</span>
                  <span className="font-medium">{formatCurrency(invoice.shipping_amount, invoice.currency)}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>المجموع الكلي:</span>
                <span className="text-blue-600">{formatCurrency(invoice.total_amount, invoice.currency)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ملاحظات:</h3>
              <p className="text-gray-600">{invoice.notes}</p>
            </div>
          )}

          {/* QR Code */}
          {invoice.qr_code && (
            <div className="mt-8 pt-8 border-t flex justify-center">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">رمز الاستجابة السريعة</div>
                <div className="w-32 h-32 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
                <div className="text-xs text-gray-500 mt-2">امسح للتحقق من صحة الفاتورة</div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            <div>تم إنشاء هذه الفاتورة بواسطة نظام بناء المتكامل</div>
            <div className="mt-1">
              تاريخ الإنشاء: {new Date(invoice.created_at).toLocaleDateString('ar-SA')} - 
              آخر تحديث: {new Date(invoice.updated_at).toLocaleDateString('ar-SA')}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
