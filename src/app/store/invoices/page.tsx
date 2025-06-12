'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calculator,
  QrCode,
  Shield,
  AlertTriangle,
  Star
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_type: 'standard' | 'simplified' | 'credit_note' | 'debit_note';
  currency: string;
  
  // Seller information
  seller_name: string;
  seller_vat_number?: string;
  seller_address?: string;
  seller_city?: string;
  seller_postal_code?: string;
  
  // Buyer information
  buyer_name?: string;
  buyer_vat_number?: string;
  buyer_address?: string;
  buyer_city?: string;
  buyer_postal_code?: string;
  
  // Financial details
  subtotal: number;
  total_vat: number;
  total_discount: number;
  total_amount: number;
  
  // VAT breakdown
  vat_breakdown?: {
    [rate: string]: {
      taxable_amount: number;
      vat_amount: number;
    };
  };
  
  // Dates
  issue_date: string;
  supply_date?: string;
  due_date?: string;
  
  // ZATCA compliance
  zatca_uuid?: string;
  zatca_hash?: string;
  qr_code?: string;
  is_zatca_compliant: boolean;
  zatca_submission_status: 'pending' | 'submitted' | 'accepted' | 'rejected';
  zatca_response?: any;
  
  // Status and metadata
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  payment_terms?: string;
  notes?: string;
  
  created_at: string;
  updated_at: string;
  
  // Relations
  order_id?: string;
  store_id: string;
}

interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_id?: string;
  
  item_name: string;
  item_description?: string;
  sku?: string;
  
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  discount_amount: number;
  
  vat_rate: number;
  vat_amount: number;
  tax_category: string;
  
  line_total: number;
  line_total_with_vat: number;
}

interface StoreSettings {
  id: string;
  store_id: string;
  default_vat_rate: number;
  vat_number?: string;
  tax_registration_number?: string;
  invoice_prefix: string;
  invoice_counter: number;
  invoice_footer_text?: string;
  currency: string;
  timezone: string;
  zatca_enabled: boolean;
  zatca_environment: 'sandbox' | 'production';
  zatca_certificate?: string;
  zatca_private_key?: string;
}

export default function ZATCAInvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showZATCAConfig, setShowZATCAConfig] = useState(false);
  const [user, setUser] = useState<any>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    loadInvoiceData();
  }, []);

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

      // Load invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('store_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (!invoicesError) {
        setInvoices(invoicesData || []);
      }

      // Load store settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('store_id', currentUser.id)
        .single();

      if (!settingsError) {
        setStoreSettings(settingsData);
      } else if (settingsError.code === 'PGRST116') {
        // No settings found, create default
        const defaultSettings = {
          store_id: currentUser.id,
          default_vat_rate: 0.15,
          invoice_prefix: 'INV',
          invoice_counter: 1,
          currency: 'SAR',
          timezone: 'Asia/Riyadh',
          zatca_enabled: true,
          zatca_environment: 'sandbox' as const
        };

        const { data: newSettings, error: createError } = await supabase
          .from('store_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (!createError) {
          setStoreSettings(newSettings);
        }
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

  const getZATCAStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'submitted': return 'مرسلة لزاتكا';
      case 'accepted': return 'مقبولة';
      case 'rejected': return 'مرفوضة';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'simplified': return 'bg-green-100 text-green-800';
      case 'credit_note': return 'bg-orange-100 text-orange-800';
      case 'debit_note': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'standard': return 'عادية';
      case 'simplified': return 'مبسطة';
      case 'credit_note': return 'إشعار دائن';
      case 'debit_note': return 'إشعار مدين';
      default: return type;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = !searchTerm || 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.buyer_name && invoice.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesType = typeFilter === 'all' || invoice.invoice_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate stats
  const totalInvoices = invoices.length;
  const draftInvoices = invoices.filter(i => i.status === 'draft').length;
  const paidInvoices = invoices.filter(i => i.status === 'paid').length;
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
  const zatcaCompliantInvoices = invoices.filter(i => i.is_zatca_compliant).length;
  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات الفواتير...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة الفواتير المتوافقة مع زاتكا</h1>
              <p className="text-gray-600">نظام فوترة إلكتروني متكامل ومتوافق مع متطلبات هيئة الزكاة والضريبة</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setShowZATCAConfig(true)}
              >
                <Shield className="w-4 h-4 ml-2" />
                إعدادات زاتكا
              </Button>
              <Link href="/store/invoices/create">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إنشاء فاتورة
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ZATCA Compliance Status */}
        {storeSettings && (
          <Card className="mb-8 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className={`h-8 w-8 ml-3 ${storeSettings.zatca_enabled ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">حالة التوافق مع زاتكا</h3>
                  <p className="text-sm text-gray-600">
                    {storeSettings.zatca_enabled ? 
                      `مفعل - البيئة: ${storeSettings.zatca_environment === 'sandbox' ? 'تجريبية' : 'إنتاج'}` :
                      'غير مفعل'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{zatcaCompliantInvoices}</div>
                  <div className="text-xs text-gray-500">فاتورة متوافقة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{storeSettings.invoice_counter}</div>
                  <div className="text-xs text-gray-500">رقم الفاتورة التالي</div>
                </div>
                {storeSettings.vat_number && (
                  <div className="text-center">
                    <div className="text-sm font-mono text-gray-900">{storeSettings.vat_number}</div>
                    <div className="text-xs text-gray-500">الرقم الضريبي</div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-900">{totalInvoices}</div>
                <div className="text-sm text-gray-500">إجمالي الفواتير</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-900">{draftInvoices}</div>
                <div className="text-sm text-gray-500">مسودات</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-900">{paidInvoices}</div>
                <div className="text-sm text-gray-500">مدفوعة</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-900">{overdueInvoices}</div>
                <div className="text-sm text-gray-500">متأخرة</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-900">{zatcaCompliantInvoices}</div>
                <div className="text-sm text-gray-500">متوافقة زاتكا</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calculator className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="mr-4">
                <div className="text-xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</div>
                <div className="text-sm text-gray-500">إجمالي الإيرادات</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث برقم الفاتورة أو اسم العميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="draft">مسودة</option>
              <option value="sent">مرسلة</option>
              <option value="paid">مدفوعة</option>
              <option value="overdue">متأخرة</option>
              <option value="cancelled">ملغية</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الأنواع</option>
              <option value="standard">عادية</option>
              <option value="simplified">مبسطة</option>
              <option value="credit_note">إشعار دائن</option>
              <option value="debit_note">إشعار مدين</option>
            </select>
          </div>
        </Card>

        {/* Invoices Table */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">قائمة الفواتير</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
              <Link href="/store/invoices/bulk-create">
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 ml-2" />
                  إنشاء مجمع
                </Button>
              </Link>
            </div>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فواتير</h3>
              <p className="text-gray-500 mb-4">ابدأ بإنشاء فاتورتك الأولى</p>
              <Link href="/store/invoices/create">
                <Button>
                  <Plus className="w-4 h-4 ml-2" />
                  إنشاء فاتورة جديدة
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم الفاتورة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العميل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبلغ الإجمالي
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      زاتكا
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ الإصدار
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.invoice_number}</div>
                        {invoice.zatca_uuid && (
                          <div className="text-xs text-gray-500">UUID: {invoice.zatca_uuid.slice(0, 8)}...</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.buyer_name || 'غير محدد'}</div>
                        {invoice.buyer_vat_number && (
                          <div className="text-xs text-gray-500">ض.ر: {invoice.buyer_vat_number}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(invoice.invoice_type)}`}>
                          {getTypeText(invoice.invoice_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total_amount)}</div>
                        <div className="text-xs text-gray-500">
                          ض.ق.م: {formatCurrency(invoice.total_vat)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getZATCAStatusColor(invoice.zatca_submission_status)}`}>
                            {getZATCAStatusText(invoice.zatca_submission_status)}
                          </span>
                          {invoice.is_zatca_compliant && (
                            <div className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                              <span className="text-xs text-green-600">متوافق</span>
                            </div>
                          )}
                          {invoice.qr_code && (
                            <QrCode className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.issue_date).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/store/invoices/${invoice.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/store/invoices/${invoice.id}/edit`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {invoice.status === 'draft' && (
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
