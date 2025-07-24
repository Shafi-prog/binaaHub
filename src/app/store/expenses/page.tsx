'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Label } from '@/core/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/shared/components/ui/select';
import { Textarea } from '@/core/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Separator } from '@/core/shared/components/ui/separator';
import { Checkbox } from '@/core/shared/components/ui/checkbox';
import { 
  Plus, 
  Search, 
  Receipt, 
  Upload, 
  Trash2, 
  Save,
  Calendar,
  DollarSign,
  Building,
  User,
  Edit,
  Eye,
  Download,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface ExpenseCategory {
  id: string;
  name: string;
  name_ar: string;
  description?: string;
  is_tax_deductible: boolean;
  created_at: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  monthly_salary?: number;
  created_at: string;
}

interface Expense {
  id?: string;
  expense_number: string;
  title: string;
  category_id: string;
  category: ExpenseCategory;
  employee_id?: string;
  employee?: Employee;
  expense_date: string;
  amount: number;
  tax_amount: number;
  is_tax_deductible: boolean;
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'check';
  payment_reference?: string;
  description?: string;
  receipt_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approved_by?: string;
  approved_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Employee Salaries', name_ar: 'رواتب الموظفين', is_tax_deductible: true },
  { name: 'Rent', name_ar: 'الإيجار', is_tax_deductible: true },
  { name: 'Utilities', name_ar: 'المرافق العامة', is_tax_deductible: true },
  { name: 'Office Supplies', name_ar: 'مستلزمات المكتب', is_tax_deductible: true },
  { name: 'Marketing', name_ar: 'التسويق', is_tax_deductible: true },
  { name: 'Transportation', name_ar: 'المواصلات', is_tax_deductible: true },
  { name: 'Professional Services', name_ar: 'الخدمات المهنية', is_tax_deductible: true },
  { name: 'Equipment', name_ar: 'المعدات', is_tax_deductible: true },
  { name: 'Insurance', name_ar: 'التأمين', is_tax_deductible: true },
  { name: 'Training', name_ar: 'التدريب', is_tax_deductible: true },
  { name: 'Entertainment', name_ar: 'الترفيه', is_tax_deductible: false },
  { name: 'Other', name_ar: 'أخرى', is_tax_deductible: false }
];

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadExpenses();
    loadCategories();
    loadEmployees();
  }, [dateRange]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          category:expense_categories(*),
          employee:employees(*)
        `)
        .gte('expense_date', dateRange.from)
        .lte('expense_date', dateRange.to)
        .order('expense_date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('خطأ في تحميل المصروفات');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('expense_categories')
        .select('*')
        .order('name_ar');

      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Create default categories
        await createDefaultCategories();
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('خطأ في تحميل فئات المصروفات');
    }
  };

  const createDefaultCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('expense_categories')
        .insert(DEFAULT_EXPENSE_CATEGORIES)
        .select();

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error creating default categories:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('خطأ في تحميل الموظفين');
    }
  };

  const createNewExpense = () => {
    const newExpense: Expense = {
      expense_number: `EXP-${Date.now()}`,
      title: '',
      category_id: '',
      category: {} as ExpenseCategory,
      expense_date: new Date().toISOString().split('T')[0],
      amount: 0,
      tax_amount: 0,
      is_tax_deductible: true,
      payment_method: 'cash',
      status: 'pending',
      created_by: 'current_user_id', // This should come from auth context
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setSelectedExpense(newExpense);
    setIsCreating(true);
    setIsEditing(true);
  };

  const saveExpense = async () => {
    if (!selectedExpense || !selectedExpense.title || !selectedExpense.category_id || selectedExpense.amount <= 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);

      if (isCreating) {
        // Create new expense
        const { data, error } = await supabase
          .from('expenses')
          .insert({
            expense_number: selectedExpense.expense_number,
            title: selectedExpense.title,
            category_id: selectedExpense.category_id,
            employee_id: selectedExpense.employee_id,
            expense_date: selectedExpense.expense_date,
            amount: selectedExpense.amount,
            tax_amount: selectedExpense.tax_amount,
            is_tax_deductible: selectedExpense.is_tax_deductible,
            payment_method: selectedExpense.payment_method,
            payment_reference: selectedExpense.payment_reference,
            description: selectedExpense.description,
            receipt_url: selectedExpense.receipt_url,
            status: selectedExpense.status,
            created_by: selectedExpense.created_by
          })
          .select()
          .single();

        if (error) throw error;
        toast.success('تم إنشاء المصروف بنجاح');
      } else {
        // Update existing expense
        const { error } = await supabase
          .from('expenses')
          .update({
            title: selectedExpense.title,
            category_id: selectedExpense.category_id,
            employee_id: selectedExpense.employee_id,
            expense_date: selectedExpense.expense_date,
            amount: selectedExpense.amount,
            tax_amount: selectedExpense.tax_amount,
            is_tax_deductible: selectedExpense.is_tax_deductible,
            payment_method: selectedExpense.payment_method,
            payment_reference: selectedExpense.payment_reference,
            description: selectedExpense.description,
            receipt_url: selectedExpense.receipt_url,
            status: selectedExpense.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedExpense.id);

        if (error) throw error;
        toast.success('تم تحديث المصروف بنجاح');
      }

      await loadExpenses();
      setIsCreating(false);
      setIsEditing(false);
      setSelectedExpense(null);

    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('خطأ في حفظ المصروف');
    } finally {
      setLoading(false);
    }
  };

  const calculateTaxAmount = (amount: number, isDeductible: boolean) => {
    return isDeductible ? amount * 0.15 : 0; // 15% VAT
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'في الانتظار', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'موافق عليه', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800' },
      paid: { label: 'مدفوع', color: 'bg-blue-100 text-blue-800' }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    
    return (
      <Badge className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodMap = {
      cash: 'نقدي',
      bank_transfer: 'تحويل بنكي',
      credit_card: 'بطاقة ائتمانية',
      check: 'شيك'
    };
    return methodMap[method as keyof typeof methodMap] || method;
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.expense_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || expense.category_id === filterCategory;
    const matchesStatus = !filterStatus || expense.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalTaxDeductible = filteredExpenses
    .filter(expense => expense.is_tax_deductible)
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="container mx-auto py-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المصروفات</h1>
        <p className="text-gray-600">تسجيل وتتبع جميع مصروفات الشركة</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي المصروفات</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalExpenses.toLocaleString('en-US')} ريال
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">مصروفات معفاة من الضريبة</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalTaxDeductible.toLocaleString('en-US')} ريال
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Receipt className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">عدد المصروفات</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredExpenses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">متوسط يومي</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(totalExpenses / 30).toLocaleString('en-US')} ريال
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expenses List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  المصروفات
                </CardTitle>
                <Button onClick={createNewExpense} size="sm">
                  <Plus className="w-4 h-4 ml-1" />
                  جديد
                </Button>
              </div>
              
              {/* Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="البحث في المصروفات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">جميع الفئات</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">جميع الحالات</SelectItem>
                      <SelectItem value="pending">في الانتظار</SelectItem>
                      <SelectItem value="approved">موافق عليه</SelectItem>
                      <SelectItem value="rejected">مرفوض</SelectItem>
                      <SelectItem value="paid">مدفوع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="date_from" className="text-xs">من</Label>
                    <Input
                      id="date_from"
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_to" className="text-xs">إلى</Label>
                    <Input
                      id="date_to"
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    onClick={() => {
                      setSelectedExpense(expense);
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedExpense?.id === expense.id ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{expense.title}</span>
                      {getStatusBadge(expense.status)}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{expense.category?.name_ar}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(expense.expense_date).toLocaleDateString('en-US')}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600">
                        {expense.amount.toLocaleString('en-US')} ريال
                      </span>
                      {expense.is_tax_deductible && (
                        <Badge variant="outline" className="text-xs">معفاة ضريبياً</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense Details */}
        <div className="lg:col-span-2">
          {selectedExpense ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    {isCreating ? 'مصروف جديد' : selectedExpense.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Edit className="w-4 h-4 ml-1" />
                        تعديل
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                          إلغاء
                        </Button>
                        <Button onClick={saveExpense} disabled={loading} size="sm">
                          <Save className="w-4 h-4 ml-1" />
                          حفظ
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expense_number">رقم المصروف</Label>
                    <Input
                      id="expense_number"
                      value={selectedExpense.expense_number}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="title">عنوان المصروف *</Label>
                    <Input
                      id="title"
                      value={selectedExpense.title}
                      onChange={(e) => setSelectedExpense({ ...selectedExpense, title: e.target.value })}
                      disabled={!isEditing}
                      placeholder="اسم المصروف"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">فئة المصروف *</Label>
                    <Select
                      value={selectedExpense.category_id}
                      onValueChange={(value) => {
                        const category = categories.find(c => c.id === value);
                        setSelectedExpense({ 
                          ...selectedExpense, 
                          category_id: value,
                          category: category || {} as ExpenseCategory,
                          is_tax_deductible: category?.is_tax_deductible || false,
                          tax_amount: calculateTaxAmount(selectedExpense.amount, category?.is_tax_deductible || false)
                        });
                      }}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="employee">الموظف (اختياري)</Label>
                    <Select
                      value={selectedExpense.employee_id || ''}
                      onValueChange={(value) => {
                        const employee = employees.find(e => e.id === value);
                        setSelectedExpense({ 
                          ...selectedExpense, 
                          employee_id: value || undefined,
                          employee: employee
                        });
                      }}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الموظف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">بدون موظف محدد</SelectItem>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} - {employee.position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expense_date">تاريخ المصروف *</Label>
                    <Input
                      id="expense_date"
                      type="date"
                      value={selectedExpense.expense_date}
                      onChange={(e) => setSelectedExpense({ ...selectedExpense, expense_date: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">المبلغ *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={selectedExpense.amount}
                      onChange={(e) => {
                        const amount = parseFloat(e.target.value) || 0;
                        const taxAmount = calculateTaxAmount(amount, selectedExpense.is_tax_deductible);
                        setSelectedExpense({ 
                          ...selectedExpense, 
                          amount,
                          tax_amount: taxAmount
                        });
                      }}
                      disabled={!isEditing}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="payment_method">وسيلة الدفع</Label>
                    <Select
                      value={selectedExpense.payment_method}
                      onValueChange={(value) => setSelectedExpense({ ...selectedExpense, payment_method: value as any })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">نقدي</SelectItem>
                        <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                        <SelectItem value="credit_card">بطاقة ائتمانية</SelectItem>
                        <SelectItem value="check">شيك</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">الحالة</Label>
                    <Select
                      value={selectedExpense.status}
                      onValueChange={(value) => setSelectedExpense({ ...selectedExpense, status: value as any })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">في الانتظار</SelectItem>
                        <SelectItem value="approved">موافق عليه</SelectItem>
                        <SelectItem value="rejected">مرفوض</SelectItem>
                        <SelectItem value="paid">مدفوع</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Tax Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">معلومات الضريبة</h3>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="is_tax_deductible"
                      checked={selectedExpense.is_tax_deductible}
                      onCheckedChange={(checked) => {
                        const isDeductible = checked as boolean;
                        const taxAmount = calculateTaxAmount(selectedExpense.amount, isDeductible);
                        setSelectedExpense({ 
                          ...selectedExpense, 
                          is_tax_deductible: isDeductible,
                          tax_amount: taxAmount
                        });
                      }}
                      disabled={!isEditing}
                    />
                    <Label htmlFor="is_tax_deductible" className="text-sm">
                      هذا المصروف خاضع للضريبة (معفى ضريبياً)
                    </Label>
                  </div>

                  {selectedExpense.is_tax_deductible && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>مبلغ الضريبة (15%)</Label>
                        <Input
                          value={selectedExpense.tax_amount.toFixed(2)}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label>المبلغ شامل الضريبة</Label>
                        <Input
                          value={(selectedExpense.amount + selectedExpense.tax_amount).toFixed(2)}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Additional Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="payment_reference">مرجع الدفع (رقم التحويل، الشيك، إلخ)</Label>
                    <Input
                      id="payment_reference"
                      value={selectedExpense.payment_reference || ''}
                      onChange={(e) => setSelectedExpense({ ...selectedExpense, payment_reference: e.target.value })}
                      disabled={!isEditing}
                      placeholder="رقم التحويل أو مرجع الدفع"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">الوصف / ملاحظات</Label>
                    <Textarea
                      id="description"
                      value={selectedExpense.description || ''}
                      onChange={(e) => setSelectedExpense({ ...selectedExpense, description: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="تفاصيل إضافية عن المصروف"
                    />
                  </div>

                  {isEditing && (
                    <div>
                      <Label htmlFor="receipt">رفع إيصال المصروف</Label>
                      <div className="mt-2">
                        <Button variant="outline" className="w-full" onClick={() => alert('Button clicked')}>
                          <Upload className="w-4 h-4 ml-2" />
                          اختر ملف الإيصال
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">ملخص المصروف</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>المبلغ الأساسي:</span>
                        <span>{selectedExpense.amount.toFixed(2)} ريال</span>
                      </div>
                      {selectedExpense.is_tax_deductible && (
                        <div className="flex justify-between">
                          <span>الضريبة (15%):</span>
                          <span>{selectedExpense.tax_amount.toFixed(2)} ريال</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>المجموع الإجمالي:</span>
                        <span className="text-red-600">
                          {(selectedExpense.amount + (selectedExpense.is_tax_deductible ? selectedExpense.tax_amount : 0)).toFixed(2)} ريال
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>وسيلة الدفع: {getPaymentMethodLabel(selectedExpense.payment_method)}</p>
                        <p>الحالة: {getStatusBadge(selectedExpense.status)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">اختر مصروفاً لعرض التفاصيل</p>
                <p className="text-sm">أو أنشئ مصروفاً جديداً للبدء</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
