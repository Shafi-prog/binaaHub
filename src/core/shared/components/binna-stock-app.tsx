'use client'

import { useState } from 'react'
import { Button } from '../../../core/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../core/shared/components/ui/card'
import { Progress } from '../../../core/shared/components/ui/progress'

interface InventoryItem {
  id: string
  name: string
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  location: string
  lastUpdated: string
}

export default function BinnaStockApp() {
  const [selectedLocation, setSelectedLocation] = useState('الرياض - المستودع الرئيسي')
  
  const locations = [
    'الرياض - المستودع الرئيسي',
    'جدة - فرع البحر الأحمر',
    'الدمام - مستودع الشرقية',
    'المدينة المنورة - فرع المدينة'
  ]

  const inventory: InventoryItem[] = [
    {
      id: '1',
      name: 'أسمنت بورتلاندي 50 كيلو',
      sku: 'CEM-PRT-50',
      currentStock: 1250,
      minStock: 500,
      maxStock: 2000,
      location: 'الرياض - المستودع الرئيسي',
      lastUpdated: '2024-01-15 14:30'
    },
    {
      id: '2',
      name: 'حديد تسليح 12 مم',
      sku: 'STL-RBR-12',
      currentStock: 85,
      minStock: 100,
      maxStock: 500,
      location: 'الرياض - المستودع الرئيسي',
      lastUpdated: '2024-01-15 13:45'
    },
    {
      id: '3',
      name: 'رمل أبيض طن',
      sku: 'SND-WHT-T',
      currentStock: 450,
      minStock: 200,
      maxStock: 800,
      location: 'الرياض - المستودع الرئيسي',
      lastUpdated: '2024-01-15 12:15'
    },
    {
      id: '4',
      name: 'طوب أحمر (1000 حبة)',
      sku: 'BRK-RED-1K',
      currentStock: 25,
      minStock: 50,
      maxStock: 200,
      location: 'الرياض - المستودع الرئيسي',
      lastUpdated: '2024-01-15 11:20'
    }
  ]

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return 'خطر'
    if (item.currentStock <= item.minStock * 1.2) return 'تحذير'
    return 'جيد'
  }

  const getStockColor = (status: string) => {
    switch (status) {
      case 'خطر': return 'text-red-600'
      case 'تحذير': return 'text-yellow-600'
      case 'جيد': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getProgressValue = (item: InventoryItem) => {
    return (item.currentStock / item.maxStock) * 100
  }

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock)

  return (
    <div className="p-6 bg-gray-50 min-h-screen direction-rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المخزون - بنا ستوك</h1>
          <p className="text-gray-600">نظام إدارة المخزون المتقدم للشركات السعودية</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">إجمالي المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{inventory.length}</div>
              <div className="text-sm text-gray-500">منتج نشط</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">تحذيرات المخزون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{lowStockItems.length}</div>
              <div className="text-sm text-gray-500">منتج يحتاج إعادة طلب</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">المواقع النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{locations.length}</div>
              <div className="text-sm text-gray-500">مستودع ومتجر</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">قيمة المخزون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">2.5M</div>
              <div className="text-sm text-gray-500">ريال سعودي</div>
            </CardContent>
          </Card>
        </div>

        {/* Location Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اختر الموقع:
          </label>
          <select 
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="block w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>جرد المخزون - {selectedLocation}</CardTitle>
            <CardDescription>
              عرض تفصيلي لحالة المخزون في الموقع المحدد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3 font-semibold">المنتج</th>
                    <th className="text-right p-3 font-semibold">رمز المنتج</th>
                    <th className="text-right p-3 font-semibold">المخزون الحالي</th>
                    <th className="text-right p-3 font-semibold">مؤشر المخزون</th>
                    <th className="text-right p-3 font-semibold">الحالة</th>
                    <th className="text-right p-3 font-semibold">آخر تحديث</th>
                    <th className="text-right p-3 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => {
                    const status = getStockStatus(item)
                    const progressValue = getProgressValue(item)
                    
                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-medium">{item.name}</div>
                        </td>
                        <td className="p-3">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {item.sku}
                          </code>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold">{item.currentStock.toLocaleString('en-US')}</div>
                          <div className="text-sm text-gray-500">
                            الحد الأدنى: {item.minStock.toLocaleString('en-US')}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="w-24">
                            <Progress value={progressValue} className="h-2" />
                            <div className="text-xs text-gray-500 mt-1">
                              {progressValue.toFixed(0)}%
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`font-semibold ${getStockColor(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-500">
                          {item.lastUpdated}
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                              تعديل
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                              إعادة طلب
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">تنبؤ الطلب بالذكاء الاصطناعي</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                نظام متقدم لتوقع الطلب المستقبلي بناءً على البيانات التاريخية
              </p>
              <Button variant="outline" className="w-full" onClick={() => alert('Button clicked')}>عرض التنبؤات</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إدارة متعددة المواقع</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                إدارة المخزون عبر مواقع متعددة مع تتبع الحركة في الوقت الفعلي
              </p>
              <Button variant="outline" className="w-full" onClick={() => alert('Button clicked')}>إدارة المواقع</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">تكامل مع الموردين</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                ربط مباشر مع أنظمة الموردين للطلب التلقائي وتتبع الشحنات
              </p>
              <Button variant="outline" className="w-full" onClick={() => alert('Button clicked')}>إعداد الموردين</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
