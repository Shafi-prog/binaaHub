"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { FileText, Search, Download, Calendar, CreditCard, Store, Eye, Printer, Filter } from 'lucide-react';

export const dynamic = 'force-dynamic'

interface Invoice {
  id: string;
  invoiceNumber: string;
  store: string;
  orderId: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  amount: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV001',
      invoiceNumber: 'INV-2024-001',
      store: 'متجر مواد البناء المتقدمة',
      orderId: 'ORD001',
      issueDate: '2024-01-15',
      dueDate: '2024-01-30',
      paidDate: '2024-01-17',
      status: 'paid',
      amount: 675,
      tax: 101.25,
      total: 776.25,
      paymentMethod: 'بطاقة ائتمان',
      items: [
        { description: 'أسمنت أبيض - 25 كيس', quantity: 25, unitPrice: 15, total: 375 },
        { description: 'رمل ناعم - 5 متر مكعب', quantity: 5, unitPrice: 60, total: 300 }
      ]
    },
    {
      id: 'INV002',
      invoiceNumber: 'INV-2024-002',
      store: 'معرض الأدوات الصحية',
      orderId: 'ORD002',
      issueDate: '2024-03-10',
      dueDate: '2024-03-25',
      paidDate: '2024-03-12',
      status: 'paid',
      amount: 1130,
      tax: 169.5,
      total: 1299.5,
      paymentMethod: 'تحويل بنكي',
      items: [
        { description: 'مضخة مياه متوسطة القدرة', quantity: 1, unitPrice: 850, total: 850 },
        { description: 'أنابيب PVC - 6 بوصة', quantity: 10, unitPrice: 28, total: 280 }
      ]
    },
    {
      id: 'INV003',
      invoiceNumber: 'INV-2024-003',
      store: 'متجر الكهربائيات المنزلية',
      orderId: 'ORD003',
      issueDate: '2024-03-20',
      dueDate: '2024-04-04',
      status: 'pending',
      amount: 322,
      tax: 48.3,
      total: 370.3,
      items: [
        { description: 'مفاتيح كهربائية متنوعة', quantity: 15, unitPrice: 12, total: 180 },
        { description: 'كابلات كهربائية - 100 متر', quantity: 2, unitPrice: 71, total: 142 }
      ]
    },
    {
      id: 'INV004',
      invoiceNumber: 'INV-2024-004',
      store: 'مستودع الحديد والأجهزة',
      orderId: 'ORD004',
      issueDate: '2024-02-28',
      dueDate: '2024-03-15',
      status: 'overdue',
      amount: 1600,
      tax: 240,
      total: 1840,
      items: [
        { description: 'حديد تسليح - 12 ملم', quantity: 20, unitPrice: 65, total: 1300 },
        { description: 'أسلاك ربط', quantity: 10, unitPrice: 30, total: 300 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <FileText className="w-5 h-5 text-orange-600" />;
      case 'paid': return <FileText className="w-5 h-5 text-green-600" />;
      case 'overdue': return <FileText className="w-5 h-5 text-red-600" />;
      case 'cancelled': return <FileText className="w-5 h-5 text-gray-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'معلقة';
      case 'paid': return 'مدفوعة';
      case 'overdue': return 'متأخرة';
      case 'cancelled': return 'ملغاة';
      default: return 'غير معروف';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // Implementation for downloading invoice
    console.log('Downloading invoice:', invoiceId);
  };

  const handlePrintInvoice = (invoiceId: string) => {
    // Implementation for printing invoice
    console.log('Printing invoice:', invoiceId);
  };

  const handlePayInvoice = (invoiceId: string) => {
    // Implementation for paying invoice
    console.log('Paying invoice:', invoiceId);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          الفواتير
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          إدارة ومتابعة جميع فواتيرك ومدفوعاتك
        </Typography>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-orange-600">
                {invoices.filter(i => i.status === 'pending').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">فواتير معلقة</Typography>
            </div>
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600">
                {invoices.filter(i => i.status === 'paid').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">فواتير مدفوعة</Typography>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-red-600">
                {invoices.filter(i => i.status === 'overdue').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">فواتير متأخرة</Typography>
            </div>
            <FileText className="w-8 h-8 text-red-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600">
                {invoices.reduce((sum, i) => sum + i.total, 0).toLocaleString()}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">إجمالي المبلغ (ر.س)</Typography>
            </div>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
        </EnhancedCard>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث في الفواتير..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">جميع الفواتير</option>
          <option value="pending">معلقة</option>
          <option value="paid">مدفوعة</option>
          <option value="overdue">متأخرة</option>
          <option value="cancelled">ملغاة</option>
        </select>
      </div>

      {/* Invoices List */}
      <div className="grid gap-6">
        {filteredInvoices.map((invoice) => (
          <EnhancedCard key={invoice.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(invoice.status)}
                  <div className="flex-1">
                    <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900">
                      {invoice.invoiceNumber}
                    </Typography>
                    <div className="flex items-center gap-4 mt-1">
                      <Typography variant="caption" size="sm" className="text-gray-600 flex items-center gap-1">
                        <Store className="w-4 h-4" />
                        {invoice.store}
                      </Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">
                        الطلب: {invoice.orderId}
                      </Typography>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </span>
                </div>

                {/* Invoice Items */}
                <div className="mb-4">
                  <Typography variant="caption" size="sm" className="text-gray-600 mb-2">البنود:</Typography>
                  <div className="space-y-2">
                    {invoice.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <Typography variant="body" size="lg" weight="medium">{item.description}</Typography>
                          <Typography variant="caption" size="sm" className="text-gray-600">
                            {item.quantity} × {item.unitPrice.toLocaleString()} ر.س
                          </Typography>
                        </div>
                        <Typography variant="body" size="lg" weight="semibold" className="text-blue-600">
                          {item.total.toLocaleString()} ر.س
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ الإصدار</Typography>
                    <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(invoice.issueDate).toLocaleDateString('ar-SA')}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ الاستحقاق</Typography>
                    <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(invoice.dueDate).toLocaleDateString('ar-SA')}
                    </Typography>
                  </div>
                  
                  {invoice.paidDate && (
                    <div>
                      <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ الدفع</Typography>
                      <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(invoice.paidDate).toLocaleDateString('ar-SA')}
                      </Typography>
                    </div>
                  )}
                </div>

                {invoice.paymentMethod && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <Typography variant="caption" size="sm" weight="medium" className="text-green-800">
                      طريقة الدفع: {invoice.paymentMethod}
                    </Typography>
                  </div>
                )}
              </div>

              {/* Invoice Totals & Actions */}
              <div className="lg:w-64">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Typography variant="caption" size="sm" className="text-gray-600">المبلغ:</Typography>
                      <Typography variant="caption" size="sm" weight="medium">{invoice.amount.toLocaleString()} ر.س</Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography variant="caption" size="sm" className="text-gray-600">الضريبة:</Typography>
                      <Typography variant="caption" size="sm" weight="medium">{invoice.tax.toLocaleString()} ر.س</Typography>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <Typography variant="body" size="lg" weight="semibold">الإجمالي:</Typography>
                      <Typography variant="body" size="lg" weight="bold" className="text-blue-600">{invoice.total.toLocaleString()} ر.س</Typography>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 justify-center"
                  >
                    <Eye className="w-4 h-4" />
                    عرض الفاتورة
                  </Button>

                  <Button
                    onClick={() => handleDownloadInvoice(invoice.id)}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2 justify-center"
                  >
                    <Download className="w-4 h-4" />
                    تحميل PDF
                  </Button>

                  <Button
                    onClick={() => handlePrintInvoice(invoice.id)}
                    variant="outline"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-2 justify-center"
                  >
                    <Printer className="w-4 h-4" />
                    طباعة
                  </Button>

                  {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                    <Button
                      onClick={() => handlePayInvoice(invoice.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 justify-center"
                    >
                      <CreditCard className="w-4 h-4" />
                      دفع الفاتورة
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
            لا توجد فواتير
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-500">
            {searchTerm || statusFilter !== 'all' ? 'لم يتم العثور على فواتير تطابق البحث' : 'لم تستلم أي فواتير بعد'}
          </Typography>
        </div>
      )}
    </div>
  );
}
