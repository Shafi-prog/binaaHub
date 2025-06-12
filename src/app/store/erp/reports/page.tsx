'use client';

import React, { useState } from 'react';
import { Card, LoadingSpinner } from '@/components/ui';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ReportOptions {
  type: string;
  format: 'json' | 'csv' | 'pdf';
  startDate?: string;
  endDate?: string;
  includeValuation?: boolean;
  lowStockOnly?: boolean;
  includeTransactions?: boolean;
  activeOnly?: boolean;
  groupBy?: 'item' | 'customer' | 'territory';
  taxType?: 'VAT' | 'all';
}

export default function ERPReportsPage() {
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    type: '',
    format: 'json',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const reportTypes = [
    {
      id: 'sales',
      title: 'تقرير المبيعات',
      description: 'تحليل شامل للمبيعات والإيرادات',
      icon: TrendingUp,
      color: 'blue',
      options: ['format', 'dateRange', 'groupBy']
    },
    {
      id: 'inventory',
      title: 'تقرير المخزون',
      description: 'حالة المخزون والتقييم',
      icon: Package,
      color: 'green',
      options: ['format', 'includeValuation', 'lowStockOnly']
    },
    {
      id: 'customers',
      title: 'تقرير العملاء',
      description: 'تحليل بيانات العملاء',
      icon: Users,
      color: 'purple',
      options: ['format', 'includeTransactions', 'activeOnly']
    },
    {
      id: 'profitability',
      title: 'تقرير الربحية',
      description: 'تحليل الهوامش والأرباح',
      icon: DollarSign,
      color: 'yellow',
      options: ['format', 'dateRange', 'groupBy']
    },
    {
      id: 'performance',
      title: 'تقرير الأداء',
      description: 'مؤشرات الأداء الرئيسية',
      icon: BarChart3,
      color: 'indigo',
      options: ['format', 'dateRange']
    },
    {
      id: 'taxes',
      title: 'تقرير الضرائب',
      description: 'ملخص الضرائب والرسوم',
      icon: FileText,
      color: 'red',
      options: ['format', 'dateRange', 'taxType']
    }
  ];

  const generateReport = async () => {
    if (!selectedReport) {
      setError('يرجى اختيار نوع التقرير');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        type: selectedReport,
        format: reportOptions.format,
        storeId: 'default', // You might want to get this from context
        ...(reportOptions.startDate && { startDate: reportOptions.startDate }),
        ...(reportOptions.endDate && { endDate: reportOptions.endDate }),
        ...(reportOptions.includeValuation && { includeValuation: 'true' }),
        ...(reportOptions.lowStockOnly && { lowStockOnly: 'true' }),
        ...(reportOptions.includeTransactions && { includeTransactions: 'true' }),
        ...(reportOptions.activeOnly && { activeOnly: 'true' }),
        ...(reportOptions.groupBy && { groupBy: reportOptions.groupBy }),
        ...(reportOptions.taxType && { taxType: reportOptions.taxType })
      });

      const response = await fetch(`/api/erp/reports?${queryParams}`);
      
      if (reportOptions.format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return;
      }

      if (!response.ok) {
        throw new Error('فشل في إنشاء التقرير');
      }

      const data = await response.json();
      setReportData(data);

    } catch (error) {
      console.error('Error generating report:', error);
      setError('حدث خطأ في إنشاء التقرير');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (format: 'json' | 'csv') => {
    if (!reportData) return;

    const fileName = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Re-generate as CSV
      setReportOptions(prev => ({ ...prev, format: 'csv' }));
      generateReport();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مركز التقارير المتقدم</h1>
          <p className="text-gray-600">إنشاء وتحميل التقارير التفصيلية للأعمال</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Selection */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 ml-2" />
                اختيار التقرير
              </h2>
              
              <div className="space-y-3">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <button
                      key={report.id}
                      onClick={() => {
                        setSelectedReport(report.id);
                        setReportOptions(prev => ({ ...prev, type: report.id }));
                        setReportData(null);
                      }}
                      className={`w-full text-right p-4 rounded-lg border-2 transition-all ${
                        selectedReport === report.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start">
                        <Icon className={`w-5 h-5 ml-3 mt-1 text-${report.color}-600`} />
                        <div>
                          <h3 className="font-medium text-gray-900">{report.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Report Configuration & Results */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="space-y-6">
                {/* Configuration */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Filter className="w-5 h-5 ml-2" />
                    إعدادات التقرير
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        من تاريخ
                      </label>
                      <input
                        type="date"
                        value={reportOptions.startDate}
                        onChange={(e) => setReportOptions(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        إلى تاريخ
                      </label>
                      <input
                        type="date"
                        value={reportOptions.endDate}
                        onChange={(e) => setReportOptions(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Format Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تنسيق التقرير
                      </label>
                      <select
                        value={reportOptions.format}
                        onChange={(e) => setReportOptions(prev => ({ ...prev, format: e.target.value as 'json' | 'csv' | 'pdf' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="json">JSON</option>
                        <option value="csv">CSV</option>
                        <option value="pdf">PDF (قريباً)</option>
                      </select>
                    </div>

                    {/* Conditional Options */}
                    {selectedReport === 'inventory' && (
                      <>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="includeValuation"
                            checked={reportOptions.includeValuation || false}
                            onChange={(e) => setReportOptions(prev => ({ ...prev, includeValuation: e.target.checked }))}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="includeValuation" className="mr-2 text-sm font-medium text-gray-700">
                            تضمين التقييم
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="lowStockOnly"
                            checked={reportOptions.lowStockOnly || false}
                            onChange={(e) => setReportOptions(prev => ({ ...prev, lowStockOnly: e.target.checked }))}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="lowStockOnly" className="mr-2 text-sm font-medium text-gray-700">
                            المخزون المنخفض فقط
                          </label>
                        </div>
                      </>
                    )}

                    {selectedReport === 'customers' && (
                      <>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="activeOnly"
                            checked={reportOptions.activeOnly || false}
                            onChange={(e) => setReportOptions(prev => ({ ...prev, activeOnly: e.target.checked }))}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="activeOnly" className="mr-2 text-sm font-medium text-gray-700">
                            العملاء النشطون فقط
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="includeTransactions"
                            checked={reportOptions.includeTransactions || false}
                            onChange={(e) => setReportOptions(prev => ({ ...prev, includeTransactions: e.target.checked }))}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="includeTransactions" className="mr-2 text-sm font-medium text-gray-700">
                            تضمين المعاملات
                          </label>
                        </div>
                      </>
                    )}

                    {(selectedReport === 'profitability' || selectedReport === 'sales') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          تجميع حسب
                        </label>
                        <select
                          value={reportOptions.groupBy || ''}
                          onChange={(e) => setReportOptions(prev => ({ ...prev, groupBy: e.target.value as 'item' | 'customer' | 'territory' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">بدون تجميع</option>
                          <option value="item">المنتج</option>
                          <option value="customer">العميل</option>
                          <option value="territory">المنطقة</option>
                        </select>
                      </div>
                    )}

                    {selectedReport === 'taxes' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          نوع الضريبة
                        </label>
                        <select
                          value={reportOptions.taxType || 'all'}
                          onChange={(e) => setReportOptions(prev => ({ ...prev, taxType: e.target.value as 'VAT' | 'all' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">جميع الضرائب</option>
                          <option value="VAT">ضريبة القيمة المضافة</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={generateReport}
                      disabled={loading}
                      className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <LoadingSpinner size="sm" className="ml-2" />
                      ) : (
                        <BarChart3 className="w-4 h-4 ml-2" />
                      )}
                      {loading ? 'جاري الإنشاء...' : 'إنشاء التقرير'}
                    </button>

                    {reportData && (
                      <>
                        <button
                          onClick={() => downloadReport('json')}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-4 h-4 ml-2" />
                          JSON
                        </button>
                        <button
                          onClick={() => downloadReport('csv')}
                          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          <Download className="w-4 h-4 ml-2" />
                          CSV
                        </button>
                      </>
                    )}
                  </div>
                </Card>

                {/* Error Display */}
                {error && (
                  <Card className="p-4 bg-red-50 border-red-200">
                    <div className="flex items-center text-red-700">
                      <AlertCircle className="w-5 h-5 ml-2" />
                      {error}
                    </div>
                  </Card>
                )}

                {/* Report Results */}
                {reportData && (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold flex items-center">
                        <CheckCircle className="w-5 h-5 ml-2 text-green-600" />
                        نتائج التقرير
                      </h2>
                      <span className="text-sm text-gray-500">
                        تم الإنشاء: {new Date(reportData.generatedAt).toLocaleString('ar-SA')}
                      </span>
                    </div>

                    {/* Summary */}
                    {reportData.summary && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">الملخص</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(reportData.summary).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-600 capitalize">{key}</div>                              <div className="text-lg font-semibold">
                                {typeof value === 'number' && key.includes('revenue') || key.includes('amount') || key.includes('value') ? 
                                  `${(value as number).toLocaleString()} ر.س` : 
                                  value?.toString()
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* KPIs for Performance Report */}
                    {reportData.kpis && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">مؤشرات الأداء الرئيسية</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(reportData.kpis).map(([category, metrics]) => (
                            <div key={category} className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2 capitalize">{category}</h4>
                              {Object.entries(metrics as any).map(([metric, value]) => (
                                <div key={metric} className="flex justify-between text-sm">
                                  <span className="text-gray-600">{metric}</span>
                                  <span className="font-medium">
                                    {typeof value === 'number' && metric.includes('Rate') ? 
                                      `${value.toFixed(1)}%` : 
                                      value?.toString()
                                    }
                                  </span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Data Preview */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">معاينة البيانات</h3>
                      <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-auto">
                        <pre className="text-sm text-gray-700">
                          {JSON.stringify(reportData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <PieChart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">اختر تقريراً للبدء</h3>
                <p className="text-gray-600">حدد نوع التقرير من القائمة على اليسار لبدء إنشاء التقارير</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
