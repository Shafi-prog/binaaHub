'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Label } from '@/core/shared/components/ui/label';
import { Textarea } from '@/core/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/shared/components/ui/table';
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

export const dynamic = 'force-dynamic';

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

const mockSuppliers: Supplier[] = [
  {
    id: 'sup_001',
    name: 'شركة البناء المتقدم',
    contact_person: 'أحمد محمد',
    phone: '+966501234567',
    email: 'ahmed@advanced-construction.sa',
    address: 'حي الملك فهد، الرياض',
    tax_number: '1234567890',
    payment_terms: 'net_30',
    supplier_type: 'goods',
    outstanding_balance: 25000,
    total_purchases: 450000,
    status: 'active',
    notes: 'مورد موثوق للمواد الإنشائية',
    created_at: '2024-01-15'
  },
  {
    id: 'sup_002',
    name: 'مؤسسة الأثاث الحديث',
    contact_person: 'سارة أحمد',
    phone: '+966502345678',
    email: 'sara@modern-furniture.sa',
    address: 'طريق الملك عبدالعزيز، جدة',
    tax_number: '2345678901',
    payment_terms: 'net_60',
    supplier_type: 'goods',
    outstanding_balance: 15000,
    total_purchases: 320000,
    status: 'active',
    notes: 'متخصص في الأثاث المكتبي',
    created_at: '2024-01-10'
  },
  {
    id: 'sup_003',
    name: 'خدمات الصيانة السريعة',
    contact_person: 'محمد علي',
    phone: '+966503456789',
    email: 'mohammed@quick-maintenance.sa',
    address: 'الدمام، المنطقة الشرقية',
    payment_terms: 'immediate',
    supplier_type: 'services',
    outstanding_balance: 0,
    total_purchases: 85000,
    status: 'active',
    notes: 'خدمات صيانة فورية',
    created_at: '2024-02-01'
  }
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setSuppliers(mockSuppliers);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      setLoading(false);
    }
  };

  const filteredSuppliers = useMemo(() => {
    if (!searchTerm) return suppliers;
    
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  const handleSaveSupplier = async () => {
    if (!formData.name?.trim()) {
      alert('اسم المورد مطلوب');
      return;
    }

    try {
      if (editingSupplier) {
        // Update existing supplier
        const updatedSuppliers = suppliers.map(supplier =>
          supplier.id === editingSupplier.id
            ? { ...supplier, ...formData }
            : supplier
        );
        setSuppliers(updatedSuppliers);
      } else {
        // Add new supplier
        const newSupplier: Supplier = {
          id: `sup_${Date.now()}`,
          name: formData.name || '',
          contact_person: formData.contact_person || '',
          phone: formData.phone || '',
          email: formData.email || '',
          address: formData.address || '',
          tax_number: formData.tax_number,
          payment_terms: formData.payment_terms || 'net_30',
          supplier_type: formData.supplier_type || 'goods',
          outstanding_balance: 0,
          total_purchases: 0,
          status: 'active',
          notes: formData.notes,
          created_at: new Date().toISOString().split('T')[0]
        };
        setSuppliers([...suppliers, newSupplier]);
      }

      setShowAddDialog(false);
      setEditingSupplier(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المورد؟')) return;

    try {
      setSuppliers(suppliers.filter(s => s.id !== supplierId));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const openEditDialog = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData(supplier);
    setShowAddDialog(true);
  };

  const openAddDialog = () => {
    setEditingSupplier(null);
    setFormData({});
    setShowAddDialog(true);
  };

  const getPaymentTermsLabel = (terms: string) => {
    switch (terms) {
      case 'immediate': return 'فوري';
      case 'net_30': return '30 يوم';
      case 'net_60': return '60 يوم';
      case 'net_90': return '90 يوم';
      default: return terms;
    }
  };

  const getSupplierTypeLabel = (type: string) => {
    switch (type) {
      case 'goods': return 'سلع';
      case 'services': return 'خدمات';
      case 'both': return 'سلع وخدمات';
      default: return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalStats = useMemo(() => {
    return suppliers.reduce(
      (acc, supplier) => ({
        totalBalance: acc.totalBalance + supplier.outstanding_balance,
        totalPurchases: acc.totalPurchases + supplier.total_purchases,
        activeCount: acc.activeCount + (supplier.status === 'active' ? 1 : 0),
      }),
      { totalBalance: 0, totalPurchases: 0, activeCount: 0 }
    );
  }, [suppliers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إدارة الموردين</h1>
              <p className="text-gray-600">إدارة قاعدة بيانات الموردين والشركاء التجاريين</p>
            </div>
            <Button onClick={openAddDialog} className="flex items-center gap-2">
              <Plus size={16} />
              إضافة مورد جديد
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي الموردين</p>
                  <p className="text-2xl font-bold">{suppliers.length}</p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">الموردين النشطين</p>
                  <p className="text-2xl font-bold">{totalStats.activeCount}</p>
                </div>
                <Building className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المشتريات</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalStats.totalPurchases)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">الأرصدة المستحقة</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalStats.totalBalance)}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="البحث في الموردين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الموردين</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSuppliers.length === 0 ? (
              <div className="text-center py-8">
                <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'لا توجد نتائج' : 'لا يوجد موردين'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? 'جرب مصطلح بحث مختلف' : 'ابدأ بإضافة مورد جديد'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المورد</TableHead>
                    <TableHead>جهة الاتصال</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>شروط الدفع</TableHead>
                    <TableHead>الرصيد المستحق</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail size={12} />
                            {supplier.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{supplier.contact_person}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone size={12} />
                            {supplier.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getSupplierTypeLabel(supplier.supplier_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getPaymentTermsLabel(supplier.payment_terms)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          supplier.outstanding_balance > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatCurrency(supplier.outstanding_balance)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={supplier.status === 'active' ? 'default' : 'secondary'}
                        >
                          {supplier.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog(supplier)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteSupplier(supplier.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? 'تعديل المورد' : 'إضافة مورد جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">اسم المورد *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل اسم المورد"
              />
            </div>
            
            <div>
              <Label htmlFor="contact_person">جهة الاتصال</Label>
              <Input
                id="contact_person"
                value={formData.contact_person || ''}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="اسم الشخص المسؤول"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+966..."
              />
            </div>
            
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@domain.com"
              />
            </div>
            
            <div>
              <Label htmlFor="supplier_type">نوع المورد</Label>
              <select
                id="supplier_type"
                value={formData.supplier_type || 'goods'}
                onChange={(e) => setFormData({ ...formData, supplier_type: e.target.value as any })}
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
              >
                <option value="goods">سلع</option>
                <option value="services">خدمات</option>
                <option value="both">سلع وخدمات</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="payment_terms">شروط الدفع</Label>
              <select
                id="payment_terms"
                value={formData.payment_terms || 'net_30'}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value as any })}
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
              >
                <option value="immediate">فوري</option>
                <option value="net_30">30 يوم</option>
                <option value="net_60">60 يوم</option>
                <option value="net_90">90 يوم</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="ملاحظات إضافية..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveSupplier} className="flex-1">
                {editingSupplier ? 'تحديث' : 'إضافة'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddDialog(false)}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
