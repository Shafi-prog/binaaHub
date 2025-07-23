'use client'

import { useState } from 'react'
import { Button } from '../../../core/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../core/shared/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../core/shared/components/ui/tabs'

interface FinancialData {
  revenue: number
  expenses: number
  profit: number
  vatCollected: number
  vatPaid: number
}

interface Invoice {
  id: string
  number: string
  customer: string
  amount: number
  vat: number
  total: number
  date: string
  status: 'paid' | 'pending' | 'overdue'
  zatcaCompliant: boolean
}

export default function BinnaBooksApp() {
  const [selectedPeriod, setSelectedPeriod] = useState('هذا الشهر')
  
  const periods = ['هذا الشهر', 'الشهر الماضي', 'الربع الحالي', 'السنة الحالية']

  const financialData: FinancialData = {
    revenue: 850000,
    expenses: 620000,
    profit: 230000,
    vatCollected: 127500,
    vatPaid: 93000
  }

  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'INV-2024-001',
      customer: 'شركة البناء المتطور',
      amount: 45000,
      vat: 6750,
      total: 51750,
      date: '2024-01-15',
      status: 'paid',
      zatcaCompliant: true
    },
    {
      id: '2',
      number: 'INV-2024-002',
      customer: 'مؤسسة العمران للمقاولات',
      amount: 78000,
      vat: 11700,
      total: 89700,
      date: '2024-01-14',
      status: 'pending',
      zatcaCompliant: true
    },
    {
      id: '3',
      number: 'INV-2024-003',
      customer: 'شركة الإنشاءات الحديثة',
      amount: 125000,
      vat: 18750,
      total: 143750,
      date: '2024-01-13',
      status: 'overdue',
      zatcaCompliant: false
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'مدفوعة'
      case 'pending': return 'معلقة'
      case 'overdue': return 'متأخرة'
      default: return 'غير محدد'
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen direction-rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">نظام المحاسبة - بنا بوكس</h1>
          <p className="text-gray-600">نظام محاسبة متوافق مع هيئة الزكاة والضريبة والجمارك</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اختر الفترة الزمنية:
          </label>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="block w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {periods.map((period) => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">إجمالي الإيرادات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {financialData.revenue.toLocaleString()} ر.س
              </div>
              <div className="text-sm text-gray-500">+15% من الشهر الماضي</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">إجمالي المصروفات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {financialData.expenses.toLocaleString()} ر.س
              </div>
              <div className="text-sm text-gray-500">+8% من الشهر الماضي</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">صافي الربح</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {financialData.profit.toLocaleString()} ر.س
              </div>
              <div className="text-sm text-gray-500">هامش ربح 27%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">ضريبة القيمة المضافة المحصلة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {financialData.vatCollected.toLocaleString()} ر.س
              </div>
              <div className="text-sm text-gray-500">15% على المبيعات</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">ضريبة القيمة المضافة المدفوعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {financialData.vatPaid.toLocaleString()} ر.س
              </div>
              <div className="text-sm text-gray-500">على المشتريات</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="invoices">الفواتير</TabsTrigger>
            <TabsTrigger value="reports">التقارير المالية</TabsTrigger>
            <TabsTrigger value="vat">ضريبة القيمة المضافة</TabsTrigger>
            <TabsTrigger value="zatca">التوافق مع الزكاة والضريبة</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الفواتير</CardTitle>
                <CardDescription>
                  عرض وإدارة جميع الفواتير الصادرة والواردة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-2">
                    <Button onClick={() => alert('سيتم فتح صفحة إنشاء فاتورة جديدة')}>فاتورة جديدة</Button>
                    <Button variant="outline" onClick={() => alert('سيتم فتح صفحة استيراد الفواتير')}>استيراد فواتير</Button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {invoices.length} فاتورة في {selectedPeriod}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3 font-semibold">رقم الفاتورة</th>
                        <th className="text-right p-3 font-semibold">العميل</th>
                        <th className="text-right p-3 font-semibold">المبلغ قبل الضريبة</th>
                        <th className="text-right p-3 font-semibold">ضريبة القيمة المضافة</th>
                        <th className="text-right p-3 font-semibold">الإجمالي</th>
                        <th className="text-right p-3 font-semibold">التاريخ</th>
                        <th className="text-right p-3 font-semibold">الحالة</th>
                        <th className="text-right p-3 font-semibold">التوافق مع الزكاة</th>
                        <th className="text-right p-3 font-semibold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {invoice.number}
                            </code>
                          </td>
                          <td className="p-3 font-medium">{invoice.customer}</td>
                          <td className="p-3">{invoice.amount.toLocaleString()} ر.س</td>
                          <td className="p-3">{invoice.vat.toLocaleString()} ر.س</td>
                          <td className="p-3 font-semibold">{invoice.total.toLocaleString()} ر.س</td>
                          <td className="p-3 text-sm text-gray-500">{invoice.date}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                              {getStatusText(invoice.status)}
                            </span>
                          </td>
                          <td className="p-3">
                            {invoice.zatcaCompliant ? (
                              <span className="text-green-600 font-medium">✓ متوافق</span>
                            ) : (
                              <span className="text-red-600 font-medium">✗ غير متوافق</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => alert(`عرض تفاصيل الفاتورة ${invoice.number}`)}>عرض</Button>
                              <Button variant="outline" size="sm" onClick={() => alert(`تحرير الفاتورة ${invoice.number}`)}>تحرير</Button>
                              <Button variant="outline" size="sm" onClick={() => alert(`طباعة الفاتورة ${invoice.number}`)}>طباعة</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>قائمة الدخل</CardTitle>
                  <CardDescription>الإيرادات والمصروفات لفترة {selectedPeriod}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>إجمالي الإيرادات</span>
                      <span className="font-semibold text-green-600">
                        {financialData.revenue.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>إجمالي المصروفات</span>
                      <span className="font-semibold text-red-600">
                        ({financialData.expenses.toLocaleString()}) ر.س
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>صافي الربح</span>
                      <span className="text-blue-600">
                        {financialData.profit.toLocaleString()} ر.س
                      </span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => alert('Button clicked')}>تحميل التقرير</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الميزانية العمومية</CardTitle>
                  <CardDescription>الأصول والخصوم كما في {selectedPeriod}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>الأصول المتداولة</span>
                      <span className="font-semibold">1,250,000 ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الأصول الثابتة</span>
                      <span className="font-semibold">850,000 ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الخصوم المتداولة</span>
                      <span className="font-semibold">(320,000) ر.س</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>حقوق الملكية</span>
                      <span className="text-blue-600">1,780,000 ر.س</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => alert('Button clicked')}>تحميل التقرير</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vat" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>تقرير ضريبة القيمة المضافة</CardTitle>
                <CardDescription>
                  تقرير شامل لضريبة القيمة المضافة المحصلة والمدفوعة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">ضريبة القيمة المضافة المحصلة</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>مبيعات محلية (15%)</span>
                        <span>{financialData.vatCollected.toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span>صادرات (0%)</span>
                        <span>0 ر.س</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">ضريبة القيمة المضافة المدفوعة</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>مشتريات محلية (15%)</span>
                        <span>{financialData.vatPaid.toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span>واردات (15%)</span>
                        <span>0 ر.س</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">صافي ضريبة القيمة المضافة المستحقة:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {(financialData.vatCollected - financialData.vatPaid).toLocaleString()} ر.س
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <Button onClick={() => alert('Button clicked')}>إنشاء إقرار ضريبي</Button>
                  <Button variant="outline" onClick={() => alert('Button clicked')}>تحميل تقرير الضريبة</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zatca" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>التوافق مع هيئة الزكاة والضريبة والجمارك</CardTitle>
                <CardDescription>
                  حالة التوافق مع متطلبات الهيئة والفوترة الإلكترونية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">حالة التوافق</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span>الفوترة الإلكترونية - المرحلة الثانية</span>
                        <span className="text-green-600 font-medium">✓ متوافق</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span>تقارير ضريبة القيمة المضافة</span>
                        <span className="text-green-600 font-medium">✓ متوافق</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span>ربط نظام الفوترة مع الهيئة</span>
                        <span className="text-yellow-600 font-medium">⚠ قيد الإعداد</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">آخر التحديثات</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">تم تحديث نموذج الفاتورة</div>
                        <div className="text-sm text-gray-500">15 يناير 2024</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">تم تجديد شهادة التشفير</div>
                        <div className="text-sm text-gray-500">10 يناير 2024</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">تم رفع التقرير الشهري</div>
                        <div className="text-sm text-gray-500">1 يناير 2024</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button onClick={() => alert('Button clicked')}>اختبار الاتصال مع الهيئة</Button>
                  <Button variant="outline" className="mr-4" onClick={() => alert('Button clicked')}>تحديث الإعدادات</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
