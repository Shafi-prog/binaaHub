'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar, 
  Filter, 
  RefreshCw,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Eye,
  Printer
} from 'lucide-react';

interface ReportData {
  sales_summary: {
    total_revenue: number;
    total_orders: number;
    average_order_value: number;
    growth_rate: number;
    top_products: Array<{
      id: string;
      name: string;
      sales_count: number;
      revenue: number;
    }>;
  };
  inventory_summary: {
    total_products: number;
    low_stock_items: number;
    out_of_stock_items: number;
    total_stock_value: number;
    inventory_turnover: number;
  };
  financial_summary: {
    gross_profit: number;
    net_profit: number;
    profit_margin: number;
    expenses: number;
    tax_collected: number;
  };
  customer_analytics: {
    total_customers: number;
    new_customers: number;
    returning_customers: number;
    customer_retention_rate: number;
  };
  daily_sales: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  category_performance: Array<{
    category: string;
    revenue: number;
    orders: number;
    profit_margin: number;
  }>;
}

interface ReportFilters {
  period: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  start_date?: string;
  end_date?: string;
  category_filter?: string;
  product_filter?: string;
}

export default function AdvancedReporting() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilters>({
    period: 'month'
  });
  const [selectedReport, setSelectedReport] = useState<'overview' | 'sales' | 'inventory' | 'financial' | 'customers'>('overview');
  const [exportLoading, setExportLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Load mock report data (replace with actual analytics queries)
      const mockReportData: ReportData = {
        sales_summary: {
          total_revenue: 285000,
          total_orders: 145,
          average_order_value: 1965.52,
          growth_rate: 12.5,
          top_products: [
            { id: '1', name: 'خرسانة جاهزة - درجة 350', sales_count: 35, revenue: 98000 },
            { id: '2', name: 'حديد تسليح 16مم', sales_count: 28, revenue: 84000 },
            { id: '3', name: 'أنابيب PVC قطر 110مم', sales_count: 45, revenue: 38250 },
            { id: '4', name: 'مضخة مياه 1 حصان', sales_count: 12, revenue: 40800 },
            { id: '5', name: 'كابلات كهربائية 2.5مم', sales_count: 22, revenue: 23750 }
          ]
        },
        inventory_summary: {
          total_products: 156,
          low_stock_items: 12,
          out_of_stock_items: 3,
          total_stock_value: 450000,
          inventory_turnover: 2.3
        },
        financial_summary: {
          gross_profit: 142500,
          net_profit: 85500,
          profit_margin: 30.0,
          expenses: 57000,
          tax_collected: 42750
        },
        customer_analytics: {
          total_customers: 89,
          new_customers: 23,
          returning_customers: 66,
          customer_retention_rate: 74.2
        },
        daily_sales: [
          { date: '2024-01-15', revenue: 12500, orders: 8 },
          { date: '2024-01-16', revenue: 15200, orders: 12 },
          { date: '2024-01-17', revenue: 9800, orders: 6 },
          { date: '2024-01-18', revenue: 18900, orders: 15 },
          { date: '2024-01-19', revenue: 14300, orders: 9 },
          { date: '2024-01-20', revenue: 22100, orders: 18 },
          { date: '2024-01-21', revenue: 16800, orders: 11 },
          { date: '2024-01-22', revenue: 19500, orders: 14 },
          { date: '2024-01-23', revenue: 13700, orders: 8 },
          { date: '2024-01-24', revenue: 24600, orders: 20 },
          { date: '2024-01-25', revenue: 17900, orders: 12 },
          { date: '2024-01-26', revenue: 21300, orders: 16 },
          { date: '2024-01-27', revenue: 15800, orders: 10 },
          { date: '2024-01-28', revenue: 18200, orders: 13 },
          { date: '2024-01-29', revenue: 20500, orders: 15 }
        ],
        category_performance: [
          { category: 'مواد البناء', revenue: 125000, orders: 58, profit_margin: 28.5 },
          { category: 'التجهيزات الصحية', revenue: 89000, orders: 42, profit_margin: 32.1 },
          { category: 'الأدوات الكهربائية', revenue: 71000, orders: 45, profit_margin: 31.8 }
        ]
      };

      setReportData(mockReportData);

    } catch (error) {
      console.error('Error loading report data:', error);
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getPeriodText = (period: string) => {
    switch (period) {
      case 'today': return 'اليوم';
      case 'week': return 'هذا الأسبوع';
      case 'month': return 'هذا الشهر';
      case 'quarter': return 'هذا الربع';
      case 'year': return 'هذا العام';
      case 'custom': return 'فترة مخصصة';
      default: return period;
    }
  };

  const exportReport = async (format: 'pdf' | 'excel') => {
    setExportLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`تم تصدير التقرير بصيغة ${format === 'pdf' ? 'PDF' : 'Excel'} بنجاح`);
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل التقارير...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">حدث خطأ في تحميل بيانات التقارير</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">تقارير المتجر المتقدمة</h1>
              <p className="mt-1 text-sm text-gray-600">
                تحليلات شاملة للمبيعات والمخزون والأداء المالي
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center gap-4">
              <button
                onClick={() => loadReportData()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                تحديث
              </button>
              
              <button
                onClick={() => exportReport('excel')}
                disabled={exportLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {exportLoading ? 'جاري التصدير...' : 'تصدير Excel'}
              </button>
              
              <button
                onClick={() => exportReport('pdf')}
                disabled={exportLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <FileText className="h-4 w-4" />
                {exportLoading ? 'جاري التصدير...' : 'تصدير PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-gray-700">الفترة الزمنية:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'today', label: 'اليوم' },
                { key: 'week', label: 'أسبوع' },
                { key: 'month', label: 'شهر' },
                { key: 'quarter', label: 'ربع' },
                { key: 'year', label: 'سنة' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilters({ ...filters, period: key as any })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.period === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            
            <div className="text-sm text-gray-600">
              التقرير الحالي: {getPeriodText(filters.period)}
            </div>
          </div>
        </div>

        {/* Report Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'overview', label: 'نظرة عامة', icon: BarChart },
                { key: 'sales', label: 'المبيعات', icon: DollarSign },
                { key: 'inventory', label: 'المخزون', icon: Package },
                { key: 'financial', label: 'المالية', icon: TrendingUp },
                { key: 'customers', label: 'العملاء', icon: Users }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedReport(key as any)}
                  className={`${
                    selectedReport === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Report */}
        {selectedReport === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg ml-4">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.sales_summary.total_revenue)}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">+{formatPercentage(reportData.sales_summary.growth_rate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg ml-4">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.sales_summary.total_orders}</p>
                    <p className="text-xs text-gray-500">متوسط {formatCurrency(reportData.sales_summary.average_order_value)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg ml-4">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">قيمة المخزون</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.inventory_summary.total_stock_value)}</p>
                    <div className="flex items-center mt-1">
                      <AlertTriangle className="h-3 w-3 text-orange-500 mr-1" />
                      <span className="text-xs text-orange-600">{reportData.inventory_summary.low_stock_items} منتج مخزون منخفض</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg ml-4">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">هامش الربح</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPercentage(reportData.financial_summary.profit_margin)}</p>
                    <p className="text-xs text-gray-500">صافي الربح {formatCurrency(reportData.financial_summary.net_profit)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily Sales Chart */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">المبيعات اليومية</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {reportData.daily_sales.slice(-7).map((day, index) => {
                    const maxRevenue = Math.max(...reportData.daily_sales.map(d => d.revenue));
                    const height = (day.revenue / maxRevenue) * 100;
                    
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="flex items-end h-48 w-full justify-center">
                          <div
                            className="bg-blue-500 hover:bg-blue-600 transition-colors w-full max-w-8 rounded-t cursor-pointer"
                            style={{ height: `${height}%` }}
                            title={`${formatDate(day.date)}: ${formatCurrency(day.revenue)}`}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          {formatDate(day.date)}
                        </div>
                        <div className="text-xs font-medium text-gray-700">
                          {formatCurrency(day.revenue)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">أفضل المنتجات مبيعاً</h3>
                <div className="space-y-4">
                  {reportData.sales_summary.top_products.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.sales_count} مبيعة</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{formatCurrency(product.revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">أداء التصنيفات</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 font-medium text-gray-500">التصنيف</th>
                      <th className="text-right py-3 font-medium text-gray-500">الإيرادات</th>
                      <th className="text-right py-3 font-medium text-gray-500">الطلبات</th>
                      <th className="text-right py-3 font-medium text-gray-500">هامش الربح</th>
                      <th className="text-right py-3 font-medium text-gray-500">الأداء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.category_performance.map((category, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 font-medium text-gray-900">{category.category}</td>
                        <td className="py-4 text-gray-900">{formatCurrency(category.revenue)}</td>
                        <td className="py-4 text-gray-900">{category.orders}</td>
                        <td className="py-4 text-gray-900">{formatPercentage(category.profit_margin)}</td>
                        <td className="py-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min(category.profit_margin * 3, 100)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sales Report */}
        {selectedReport === 'sales' && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-center py-12">
              <BarChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">تقرير المبيعات المفصل</h3>
              <p className="text-gray-500">سيتم إضافة تقرير المبيعات المفصل قريباً</p>
            </div>
          </div>
        )}

        {/* Inventory Report */}
        {selectedReport === 'inventory' && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">تقرير المخزون المفصل</h3>
              <p className="text-gray-500">سيتم إضافة تقرير المخزون المفصل قريباً</p>
            </div>
          </div>
        )}

        {/* Financial Report */}
        {selectedReport === 'financial' && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">التقرير المالي المفصل</h3>
              <p className="text-gray-500">سيتم إضافة التقرير المالي المفصل قريباً</p>
            </div>
          </div>
        )}

        {/* Customers Report */}
        {selectedReport === 'customers' && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">تقرير العملاء المفصل</h3>
              <p className="text-gray-500">سيتم إضافة تقرير العملاء المفصل قريباً</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
