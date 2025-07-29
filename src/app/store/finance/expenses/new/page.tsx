'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Label } from '@/core/shared/components/ui/label';
import { Textarea } from '@/core/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/shared/components/ui/select';
import { Badge } from '@/core/shared/components/ui/badge';
import { 
  CreditCard, 
  Plus, 
  Save, 
  FileText,
  Calendar,
  Building,
  ShoppingCart,
  Truck,
  Zap,
  Wrench,
  Users,
  DollarSign,
  Receipt,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

export default function NewExpensePage() {
  const [expenseData, setExpenseData] = useState({
    title: '',
    amount: '',
    category: '',
    vendor: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    reference: '',
    recurring: false,
    approved: false,
    notes: ''
  });

  const [expenseCategories] = useState([
    { id: 'rent', name: 'إيجار', icon: Building, color: 'blue' },
    { id: 'inventory', name: 'مشتريات ومخزون', icon: ShoppingCart, color: 'green' },
    { id: 'utilities', name: 'مرافق (كهرباء، ماء، غاز)', icon: Zap, color: 'yellow' },
    { id: 'maintenance', name: 'صيانة وإصلاح', icon: Wrench, color: 'orange' },
    { id: 'shipping', name: 'شحن ونقل', icon: Truck, color: 'purple' },
    { id: 'salaries', name: 'رواتب ومكافآت', icon: Users, color: 'pink' },
    { id: 'marketing', name: 'تسويق وإعلان', icon: FileText, color: 'indigo' },
    { id: 'other', name: 'مصروفات أخرى', icon: DollarSign, color: 'gray' }
  ]);

  const [paymentMethods] = useState([
    'نقدي',
    'تحويل بنكي',
    'بطاقة ائتمان',
    'بطاقة مدى',
    'شيك',
    'حوالة'
  ]);

  const [commonVendors] = useState([
    'شركة الكهرباء السعودية',
    'شركة المياه الوطنية',
    'سابك',
    'شركة أرامكو',
    'البنك الأهلي',
    'مصرف الراجحي',
    'شركة الاتصالات السعودية'
  ]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setExpenseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!expenseData.title || !expenseData.amount || !expenseData.category) {
      toast.error('يرجى تعبئة الحقول الإجبارية');
      return;
    }

    // Here you would typically save to database
    toast.success('تم حفظ المصروف بنجاح');
    
    // Reset form
    setExpenseData({
      title: '',
      amount: '',
      category: '',
      vendor: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      reference: '',
      recurring: false,
      approved: false,
      notes: ''
    });
  };

  const handleSaveDraft = () => {
    toast.success('تم حفظ المسودة');
  };

  const selectedCategory = expenseCategories.find(cat => cat.id === expenseData.category);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-red-600" />
            مصروف جديد
          </h1>
          <p className="text-gray-600">
            إضافة مصروف جديد لمتجرك
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <FileText className="h-4 w-4 mr-2" />
            حفظ كمسودة
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            حفظ المصروف
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الأساسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان المصروف *</Label>
              <Input
                id="title"
                placeholder="مثال: فاتورة الكهرباء - يوليو 2025"
                value={expenseData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">المبلغ *</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={expenseData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="pl-12"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ر.س
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>فئة المصروف *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {expenseCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={expenseData.category === category.id ? 'default' : 'outline'}
                    onClick={() => handleInputChange('category', category.id)}
                    className="h-20 flex-col p-3"
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-xs text-center leading-tight">{category.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف المصروف</Label>
            <Textarea
              id="description"
              placeholder="وصف تفصيلي للمصروف..."
              value={expenseData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الدفع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="vendor">المورد أو الجهة</Label>
              <Input
                id="vendor"
                placeholder="اختر من القائمة أو أدخل جديد"
                value={expenseData.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                list="vendors"
              />
              <datalist id="vendors">
                {commonVendors.map((vendor) => (
                  <option key={vendor} value={vendor} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">تاريخ المصروف</Label>
              <Input
                id="date"
                type="date"
                value={expenseData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>طريقة الدفع</Label>
              <Select value={expenseData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">رقم المرجع أو الفاتورة</Label>
              <Input
                id="reference"
                placeholder="رقم الفاتورة أو المرجع"
                value={expenseData.reference}
                onChange={(e) => handleInputChange('reference', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Options */}
      <Card>
        <CardHeader>
          <CardTitle>خيارات إضافية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <input
              type="checkbox"
              id="recurring"
              checked={expenseData.recurring}
              onChange={(e) => handleInputChange('recurring', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="recurring">مصروف متكرر شهرياً</Label>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <input
              type="checkbox"
              id="approved"
              checked={expenseData.approved}
              onChange={(e) => handleInputChange('approved', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="approved">مصروف معتمد</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات إضافية</Label>
            <Textarea
              id="notes"
              placeholder="أي ملاحظات إضافية..."
              value={expenseData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Expense Summary */}
      {expenseData.amount && selectedCategory && (
        <Card>
          <CardHeader>
            <CardTitle>ملخص المصروف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  -{parseFloat(expenseData.amount || '0').toLocaleString()} ر.س
                </div>
                <div className="text-sm text-gray-600">المبلغ</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <selectedCategory.icon className="h-6 w-6" />
                </div>
                <div className="text-lg font-medium">{selectedCategory.name}</div>
                <div className="text-sm text-gray-600">الفئة</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-medium">
                  {expenseData.vendor || 'غير محدد'}
                </div>
                <div className="text-sm text-gray-600">المورد</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col">
              <Upload className="h-6 w-6 mb-2" />
              رفع صورة الفاتورة
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Receipt className="h-6 w-6 mb-2" />
              إنشاء مصروف من إيصال
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              جدولة مصروف متكرر
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
