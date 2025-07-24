// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Label } from '@/core/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/shared/components/ui/select';
import { Textarea } from '@/core/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/core/shared/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building,
  FileText,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  tax_number?: string;
  payment_terms: 'immediate' | 'net_30' | 'net_60' | 'net_90';
  supplier_type: 'goods' | 'services' | 'both';
  outstanding_balance: number;
  total_purchases: number;
  status: 'active' | 'inactive';
  notes?: string;
  created_at: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    tax_number: '',
    payment_terms: 'net_30' as 'immediate' | 'net_30' | 'net_60' | 'net_90',
    supplier_type: 'goods' as 'goods' | 'services' | 'both',
    notes: ''
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      toast.error('خطأ في تحميل الموردين');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('اسم المورد مطلوب');
      return;
    }

    try {
      setLoading(true);

      if (editingSupplier) {
        // Update existing supplier
        const { error } = await supabase
          .from('suppliers')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSupplier.id);

        if (error) throw error;
        toast.success('تم تحديث المورد بنجاح');
      } else {
        // Create new supplier
        const { error } = await supabase
          .from('suppliers')
          .insert({
            ...formData,
            outstanding_balance: 0,
            total_purchases: 0,
            status: 'active',
            created_at: new Date().toISOString()
          });

        if (error) throw error;
        toast.success('تم إضافة المورد بنجاح');
      }

      resetForm();
      await loadSuppliers();

    } catch (error) {
      console.error('Error saving supplier:', error);
      toast.error('خطأ في حفظ المورد');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact_person: supplier.contact_person,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      tax_number: supplier.tax_number || '',
      payment_terms: supplier.payment_terms,
      supplier_type: supplier.supplier_type,
      notes: supplier.notes || ''
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (supplierId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المورد؟')) return;

    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierId);

      if (error) throw error;
      
      toast.success('تم حذف المورد بنجاح');
      await loadSuppliers();

    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('خطأ في حذف المورد');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      tax_number: '',
      payment_terms: 'net_30',
      supplier_type: 'goods',
      notes: ''
    });
    setEditingSupplier(null);
    setShowAddDialog(false);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentTermsLabel = (terms: string) => {
    const labels = {
      immediate: 'فوري',
      net_30: '30 يوم',
      net_60: '60 يوم',
      net_90: '90 يوم'
    };
    return labels[terms as keyof typeof labels] || terms;
  };

  const getSupplierTypeLabel = (type: string) => {
    const labels = {
      goods: 'بضائع',
      services: 'خدمات',
      both: 'بضائع وخدمات'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="container mx-auto p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الموردين</h1>
          <p className="text-gray-600 mt-1">إدارة معلومات الموردين وتفاصيل التعامل</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مورد جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الموردين</p>
                <p className="text-2xl font-bold">{suppliers.length}</p>
              </div>
              <Building className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الموردين النشطين</p>
                <p className="text-2xl font-bold">
                  {suppliers.filter(s => s.status === 'active').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المستحقات</p>
                <p className="text-2xl font-bold">
                  {suppliers.reduce((sum, s) => sum + s.outstanding_balance, 0).toLocaleString('en-US')} ر.س
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المشتريات</p>
                <p className="text-2xl font-bold">
                  {suppliers.reduce((sum, s) => sum + s.total_purchases, 0).toLocaleString('en-US')} ر.س
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في الموردين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">جاري التحميل...</p>
          </div>
        ) : filteredSuppliers.length > 0 ? (
          filteredSuppliers.map((supplier) => (
            <Card key={supplier.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{supplier.name}</h3>
                      <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                        {supplier.status === 'active' ? 'نشط' : 'غير نشط'}
                      </Badge>
                      <Badge variant="outline">
                        {getSupplierTypeLabel(supplier.supplier_type)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{supplier.contact_person}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{supplier.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{supplier.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(supplier)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(supplier.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">مدة السداد</p>
                    <p className="font-semibold">{getPaymentTermsLabel(supplier.payment_terms)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">المستحقات</p>
                    <p className="font-semibold text-red-600">
                      {supplier.outstanding_balance.toLocaleString('en-US')} ر.س
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">إجمالي المشتريات</p>
                    <p className="font-semibold text-green-600">
                      {supplier.total_purchases.toLocaleString('en-US')} ر.س
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد موردين</p>
              <Button 
                onClick={() => setShowAddDialog(true)} 
                className="mt-4"
                variant="outline"
              >
                إضافة أول مورد
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Supplier Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent dir="rtl" className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? 'تعديل المورد' : 'إضافة مورد جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">اسم المورد *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="اسم المورد"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="contact_person">الشخص المسؤول</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
                  placeholder="اسم الشخص المسؤول"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="رقم الهاتف"
                />
              </div>
              
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="البريد الإلكتروني"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">العنوان</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="العنوان الكامل"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="tax_number">الرقم الضريبي</Label>
                <Input
                  id="tax_number"
                  value={formData.tax_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, tax_number: e.target.value }))}
                  placeholder="الرقم الضريبي"
                />
              </div>
              
              <div>
                <Label htmlFor="payment_terms">مدة السداد</Label>
                <Select
                  value={formData.payment_terms}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, payment_terms: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">فوري</SelectItem>
                    <SelectItem value="net_30">30 يوم</SelectItem>
                    <SelectItem value="net_60">60 يوم</SelectItem>
                    <SelectItem value="net_90">90 يوم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="supplier_type">نوع المورد</Label>
                <Select
                  value={formData.supplier_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, supplier_type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goods">بضائع</SelectItem>
                    <SelectItem value="services">خدمات</SelectItem>
                    <SelectItem value="both">بضائع وخدمات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="ملاحظات إضافية"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                إلغاء
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'جاري الحفظ...' : (editingSupplier ? 'تحديث' : 'إضافة')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
