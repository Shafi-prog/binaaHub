'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Calendar,
  TrendingUp,
  Package,
  ShoppingCart,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Supplier {
  id: string;
  store_id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  website?: string;
  
  // Address
  address?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country: string;
  
  // Business details
  vat_number?: string;
  commercial_registration?: string;
  payment_terms: string;
  currency: string;
  
  // Status and ratings
  is_active: boolean;
  rating?: number;
  notes?: string;
  
  created_at: string;
  updated_at: string;
}

interface SupplierStats {
  totalSuppliers: number;
  activeSuppliers: number;
  totalPurchaseOrders: number;
  totalSpent: number;
  averageRating: number;
  topSuppliers: Array<{
    id: string;
    name: string;
    totalOrders: number;
    totalAmount: number;
    rating: number;
  }>;
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  status: string;
  total_amount: number;
  order_date: string;
  supplier?: Supplier;
}

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [stats, setStats] = useState<SupplierStats>({
    totalSuppliers: 0,
    activeSuppliers: 0,
    totalPurchaseOrders: 0,
    totalSpent: 0,
    averageRating: 0,
    topSuppliers: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [user, setUser] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    region: '',
    postal_code: '',
    vat_number: '',
    commercial_registration: '',
    payment_terms: 'Net 30',
    rating: 5,
    notes: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    loadSupplierData();
  }, []);

  const loadSupplierData = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Load suppliers
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('store_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (!suppliersError) {
        setSuppliers(suppliersData || []);
        calculateStats(suppliersData || []);
      }

      // Load purchase orders
      const { data: purchaseOrdersData, error: purchaseOrdersError } = await supabase
        .from('purchase_orders')
        .select(`
          id,
          po_number,
          supplier_id,
          status,
          total_amount,
          order_date,
          suppliers(name)
        `)
        .eq('store_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (!purchaseOrdersError) {
        setPurchaseOrders(purchaseOrdersData || []);
      }

    } catch (error) {
      console.error('Error loading supplier data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (suppliersData: Supplier[]) => {
    const totalSuppliers = suppliersData.length;
    const activeSuppliers = suppliersData.filter(s => s.is_active).length;
    const averageRating = suppliersData.reduce((sum, s) => sum + (s.rating || 0), 0) / totalSuppliers || 0;

    setStats(prev => ({
      ...prev,
      totalSuppliers,
      activeSuppliers,
      averageRating: Math.round(averageRating * 10) / 10
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setFormError(null);

      const supplierData = {
        ...formData,
        store_id: user.id,
        country: 'Saudi Arabia',
        currency: 'SAR',
        is_active: true
      };

      if (editingSupplier) {
        // Update existing supplier
        const { data, error } = await supabase
          .from('suppliers')
          .update(supplierData)
          .eq('id', editingSupplier.id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? data : s));
        }
      } else {
        // Create new supplier
        const { data, error } = await supabase
          .from('suppliers')
          .insert([supplierData])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setSuppliers(prev => [data, ...prev]);
        }
      }

      // Reset form
      resetForm();
    } catch (error: any) {
      console.error('Error saving supplier:', error);
      setFormError('حدث خطأ في حفظ بيانات المورد. يرجى المحاولة مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      website: supplier.website || '',
      address: supplier.address || '',
      city: supplier.city || '',
      region: supplier.region || '',
      postal_code: supplier.postal_code || '',
      vat_number: supplier.vat_number || '',
      commercial_registration: supplier.commercial_registration || '',
      payment_terms: supplier.payment_terms,
      rating: supplier.rating || 5,
      notes: supplier.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (supplierId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المورد؟')) return;

    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierId);

      if (error) throw error;

      setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    } catch (error) {
      console.error('Error deleting supplier:', error);
      alert('حدث خطأ في حذف المورد');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      city: '',
      region: '',
      postal_code: '',
      vat_number: '',
      commercial_registration: '',
      payment_terms: 'Net 30',
      rating: 5,
      notes: ''
    });
    setShowAddForm(false);
    setEditingSupplier(null);
    setFormError(null);
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = !searchTerm || 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.contact_person && supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && supplier.is_active) ||
                         (filterActive === 'inactive' && !supplier.is_active);
    
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات الموردين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة الموردين</h1>
              <p className="text-gray-600">إدارة شاملة لموردينك وعلاقاتك التجارية</p>
            </div>
            <div className="flex gap-3">
              <Link href="/store/inventory">
                <Button variant="outline">
                  <Package className="w-4 h-4 ml-2" />
                  المخزون
                </Button>
              </Link>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة مورد
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalSuppliers}</div>
                <div className="text-sm text-gray-500">إجمالي الموردين</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-900">{stats.activeSuppliers}</div>
                <div className="text-sm text-gray-500">موردين نشطين</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalPurchaseOrders}</div>
                <div className="text-sm text-gray-500">أوامر الشراء</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-900">{stats.averageRating}</div>
                <div className="text-sm text-gray-500">متوسط التقييم</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Add/Edit Supplier Form */}
        {showAddForm && (
          <Card className="mb-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingSupplier ? 'تعديل المورد' : 'إضافة مورد جديد'}
                </h3>
                <Button variant="outline" onClick={resetForm}>
                  إلغاء
                </Button>
              </div>

              {formError && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">المعلومات الأساسية</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم المورد *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="اسم الشركة أو المورد"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      جهة الاتصال
                    </label>
                    <Input
                      value={formData.contact_person}
                      onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                      placeholder="اسم الشخص المسؤول"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+966 50 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الموقع الإلكتروني
                    </label>
                    <Input
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Address and Business Details */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">العنوان والبيانات التجارية</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان
                    </label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="العنوان التفصيلي"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المدينة
                      </label>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="الرياض"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المنطقة
                      </label>
                      <Input
                        value={formData.region}
                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                        placeholder="منطقة الرياض"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الرمز البريدي
                    </label>
                    <Input
                      value={formData.postal_code}
                      onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                      placeholder="12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الرقم الضريبي
                    </label>
                    <Input
                      value={formData.vat_number}
                      onChange={(e) => setFormData({...formData, vat_number: e.target.value})}
                      placeholder="300000000000003"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السجل التجاري
                    </label>
                    <Input
                      value={formData.commercial_registration}
                      onChange={(e) => setFormData({...formData, commercial_registration: e.target.value})}
                      placeholder="1010000000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      شروط الدفع
                    </label>
                    <select
                      value={formData.payment_terms}
                      onChange={(e) => setFormData({...formData, payment_terms: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Net 15">Net 15 - 15 يوم</option>
                      <option value="Net 30">Net 30 - 30 يوم</option>
                      <option value="Net 60">Net 60 - 60 يوم</option>
                      <option value="Cash">نقداً عند الاستلام</option>
                      <option value="Advance">دفع مقدم</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التقييم (1-5)
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>⭐ - ضعيف</option>
                      <option value={2}>⭐⭐ - مقبول</option>
                      <option value={3}>⭐⭐⭐ - جيد</option>
                      <option value={4}>⭐⭐⭐⭐ - ممتاز</option>
                      <option value={5}>⭐⭐⭐⭐⭐ - رائع</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ملاحظات
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="ملاحظات إضافية عن المورد..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 flex gap-4">
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {saving ? 'جاري الحفظ...' : editingSupplier ? 'تحديث المورد' : 'إضافة المورد'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Search and Filter */}
        <Card className="mb-8 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في الموردين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الموردين</option>
              <option value="active">نشطين</option>
              <option value="inactive">غير نشطين</option>
            </select>
          </div>
        </Card>

        {/* Suppliers Grid */}
        {filteredSuppliers.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد موردين</h3>
            <p className="text-gray-500 mb-4">ابدأ بإضافة موردين لإدارة مشترياتك</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة مورد جديد
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{supplier.name}</h3>
                    {supplier.contact_person && (
                      <p className="text-sm text-gray-600">{supplier.contact_person}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(supplier)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(supplier.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {supplier.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 ml-2" />
                      {supplier.phone}
                    </div>
                  )}
                  {supplier.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 ml-2" />
                      {supplier.email}
                    </div>
                  )}
                  {supplier.city && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 ml-2" />
                      {supplier.city}, {supplier.region}
                    </div>
                  )}
                  {supplier.payment_terms && (
                    <div className="flex items-center text-sm text-gray-600">
                      <CreditCard className="w-4 h-4 ml-2" />
                      {supplier.payment_terms}
                    </div>
                  )}
                </div>

                {supplier.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex">{renderStars(supplier.rating)}</div>
                    <span className="mr-2 text-sm text-gray-600">({supplier.rating}/5)</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    supplier.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {supplier.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                  <Link href={`/store/suppliers/${supplier.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 ml-2" />
                      التفاصيل
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
