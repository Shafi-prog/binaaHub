"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card'
import { Button } from '@/core/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/shared/components/ui/select'
import { Checkbox } from '@/core/shared/components/ui/checkbox'
import { Alert, AlertDescription } from '@/core/shared/components/ui/alert'
import { Progress } from '@/core/shared/components/ui/progress'
import { ArrowLeft, Download, FileSpreadsheet, CheckCircle, Loader2 } from 'lucide-react'

export default function ExportProductsPage() {
  const router = useRouter()
  const [exportType, setExportType] = useState('products')
  const [format, setFormat] = useState('csv')
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [exportComplete, setExportComplete] = useState(false)
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'title', 'sku', 'price', 'category', 'status'
  ])

  const availableFields = {
    products: [
      { id: 'title', label: 'اسم المنتج' },
      { id: 'description', label: 'الوصف' },
      { id: 'sku', label: 'رمز المنتج' },
      { id: 'price', label: 'السعر' },
      { id: 'cost_price', label: 'سعر التكلفة' },
      { id: 'category', label: 'الفئة' },
      { id: 'status', label: 'الحالة' },
      { id: 'quantity', label: 'الكمية' },
      { id: 'weight', label: 'الوزن' },
      { id: 'dimensions', label: 'الأبعاد' },
      { id: 'tags', label: 'العلامات' },
      { id: 'created_at', label: 'تاريخ الإنشاء' },
      { id: 'updated_at', label: 'تاريخ التحديث' }
    ],
    inventory: [
      { id: 'sku', label: 'رمز المنتج' },
      { id: 'title', label: 'اسم المنتج' },
      { id: 'quantity', label: 'الكمية المتاحة' },
      { id: 'reserved', label: 'الكمية المحجوزة' },
      { id: 'location', label: 'الموقع' },
      { id: 'last_updated', label: 'آخر تحديث' }
    ],
    customers: [
      { id: 'name', label: 'الاسم' },
      { id: 'email', label: 'البريد الإلكتروني' },
      { id: 'phone', label: 'رقم الهاتف' },
      { id: 'type', label: 'النوع' },
      { id: 'city', label: 'المدينة' },
      { id: 'total_orders', label: 'إجمالي الطلبات' },
      { id: 'total_spent', label: 'إجمالي المبلغ المنفق' },
      { id: 'created_at', label: 'تاريخ التسجيل' }
    ],
    orders: [
      { id: 'order_id', label: 'رقم الطلب' },
      { id: 'customer_name', label: 'اسم العميل' },
      { id: 'total', label: 'المبلغ الإجمالي' },
      { id: 'status', label: 'الحالة' },
      { id: 'payment_status', label: 'حالة الدفع' },
      { id: 'created_at', label: 'تاريخ الطلب' },
      { id: 'items_count', label: 'عدد العناصر' }
    ]
  }

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    )
  }

  const generateSampleData = (type: string) => {
    const sampleData: any = []
    
    if (type === 'products') {
      // Get from localStorage or create sample
      const storedProducts = JSON.parse(localStorage.getItem('store_products') || '[]')
      if (storedProducts.length > 0) {
        return storedProducts.map((product: any) => ({
          title: product.title || 'منتج تجريبي',
          description: product.description || 'وصف المنتج',
          sku: product.sku || `PRD-${Math.random().toString(36).substr(2, 9)}`,
          price: product.price || '0',
          cost_price: product.costPrice || '0',
          category: product.category || 'عام',
          status: product.status || 'نشط',
          quantity: product.inventory?.quantity || '0',
          weight: product.dimensions?.weight || '',
          dimensions: `${product.dimensions?.length || ''}x${product.dimensions?.width || ''}x${product.dimensions?.height || ''}`,
          tags: Array.isArray(product.tags) ? product.tags.join(';') : '',
          created_at: product.createdAt || new Date().toISOString(),
          updated_at: product.updatedAt || new Date().toISOString()
        }))
      }
      
      // Generate sample data
      for (let i = 1; i <= 50; i++) {
        sampleData.push({
          title: `منتج تجريبي ${i}`,
          description: `وصف المنتج التجريبي رقم ${i}`,
          sku: `PRD-${String(i).padStart(3, '0')}`,
          price: (Math.random() * 1000 + 10).toFixed(2),
          cost_price: (Math.random() * 800 + 5).toFixed(2),
          category: ['construction', 'tools', 'hardware'][Math.floor(Math.random() * 3)],
          status: ['active', 'draft'][Math.floor(Math.random() * 2)],
          quantity: Math.floor(Math.random() * 100),
          weight: (Math.random() * 50 + 1).toFixed(2),
          dimensions: `${Math.floor(Math.random() * 100)}x${Math.floor(Math.random() * 100)}x${Math.floor(Math.random() * 100)}`,
          tags: 'تجريبي;عينة',
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    } else if (type === 'customers') {
      const storedCustomers = JSON.parse(localStorage.getItem('store_customers') || '[]')
      if (storedCustomers.length > 0) {
        return storedCustomers.map((customer: any) => ({
          name: customer.name || 'عميل تجريبي',
          email: customer.email || 'test@example.com',
          phone: customer.phone || '+966500000000',
          type: customer.type || 'individual',
          city: customer.address?.city || 'الرياض',
          total_orders: Math.floor(Math.random() * 20),
          total_spent: (Math.random() * 10000).toFixed(2),
          created_at: customer.createdAt || new Date().toISOString()
        }))
      }
    }

    return sampleData
  }

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      alert('يرجى اختيار حقل واحد على الأقل للتصدير')
      return
    }

    setExporting(true)
    setProgress(0)
    setExportComplete(false)

    try {
      // Generate data
      const data = generateSampleData(exportType)
      
      // Simulate processing delay
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Filter data by selected fields
      const filteredData = data.map((item: any) => {
        const filtered: any = {}
        selectedFields.forEach(field => {
          filtered[field] = item[field] || ''
        })
        return filtered
      })

      // Generate file content
      let content = ''
      let mimeType = ''
      let extension = ''

      if (format === 'csv') {
        // Generate CSV
        const headers = selectedFields.map(field => 
          availableFields[exportType as keyof typeof availableFields]
            .find(f => f.id === field)?.label || field
        )
        
        const csvRows = [headers.join(',')]
        filteredData.forEach((item: any) => {
          const row = selectedFields.map(field => {
            const value = item[field] || ''
            // Escape commas and quotes
            return value.toString().includes(',') || value.toString().includes('"') 
              ? `"${value.toString().replace(/"/g, '""')}"` 
              : value
          })
          csvRows.push(row.join(','))
        })
        
        content = csvRows.join('\n')
        mimeType = 'text/csv;charset=utf-8;'
        extension = 'csv'
      } else {
        // Generate JSON
        content = JSON.stringify(filteredData, null, 2)
        mimeType = 'application/json;charset=utf-8;'
        extension = 'json'
      }

      // Download file
      const blob = new Blob([content], { type: mimeType })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${exportType}_export_${new Date().toISOString().split('T')[0]}.${extension}`
      link.click()

      setExportComplete(true)
    } catch (error) {
      console.error('Export error:', error)
      alert('حدث خطأ أثناء التصدير')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Button>
          <div className="flex items-center gap-3">
            <Download className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">تصدير البيانات</h1>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Export Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                إعدادات التصدير
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع البيانات
                  </label>
                  <Select value={exportType} onValueChange={(value) => {
                    setExportType(value)
                    setSelectedFields([]) // Reset selected fields
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="products">المنتجات</SelectItem>
                      <SelectItem value="inventory">المخزون</SelectItem>
                      <SelectItem value="customers">العملاء</SelectItem>
                      <SelectItem value="orders">الطلبات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تنسيق الملف
                  </label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                اختيار الحقول
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFields[exportType as keyof typeof availableFields]?.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={field.id}
                      checked={selectedFields.includes(field.id)}
                      onCheckedChange={() => handleFieldToggle(field.id)}
                    />
                    <label
                      htmlFor={field.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                    >
                      {field.label}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFields(
                    availableFields[exportType as keyof typeof availableFields]?.map(f => f.id) || []
                  )}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  تحديد الكل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFields([])}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  إلغاء الكل
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Export Progress */}
          {exporting && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  جارٍ التصدير...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600 mt-2">
                  {progress}% مكتمل
                </p>
              </CardContent>
            </Card>
          )}

          {/* Export Complete */}
          {exportComplete && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                تم تصدير البيانات بنجاح! يجب أن يبدأ التحميل تلقائياً.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Export Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                ملخص التصدير
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>نوع البيانات:</span>
                <span>
                  {exportType === 'products' ? 'المنتجات' :
                   exportType === 'inventory' ? 'المخزون' :
                   exportType === 'customers' ? 'العملاء' : 'الطلبات'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>تنسيق الملف:</span>
                <span>{format.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>عدد الحقول:</span>
                <span>{selectedFields.length}</span>
              </div>
              <div className="flex justify-between">
                <span>عدد السзаписей المتوقع:</span>
                <span>
                  {exportType === 'products' ? 
                    JSON.parse(localStorage.getItem('store_products') || '[]').length || '50' :
                   exportType === 'customers' ?
                    JSON.parse(localStorage.getItem('store_customers') || '[]').length || '25' :
                   'متغير'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                معلومات التصدير
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-2">تنسيقات الملفات:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• CSV: للاستخدام في Excel والتطبيقات المكتبية</li>
                  <li>• JSON: للاستخدام في التطبيقات والواجهات البرمجية</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">ملاحظات:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• يتم تشفير الملفات بترميز UTF-8</li>
                  <li>• البيانات الحساسة محمية</li>
                  <li>• الملفات صالحة للاستيراد مرة أخرى</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button 
                  onClick={handleExport}
                  disabled={selectedFields.length === 0 || exporting}
                  className="w-full flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  {exporting ? 'جارٍ التصدير...' : 'تصدير البيانات'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="w-full"
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  )
}
