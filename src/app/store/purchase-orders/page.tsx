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
import { 
  Plus, 
  Search, 
  FileText, 
  Upload, 
  Trash2, 
  Save,
  Calendar,
  DollarSign,
  Package,
  User,
  Edit
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
  created_at: string;
}

interface PurchaseOrderItem {
  id?: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  tax_rate: number;
  description?: string;
}

interface PurchaseOrder {
  id?: string;
  po_number: string;
  supplier_id: string;
  supplier: Supplier;
  order_date: string;
  expected_delivery_date?: string;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  payment_method: 'immediate' | 'deferred';
  payment_due_date?: string;
  subtotal: number;
  tax_amount: number;
  additional_costs: number;
  discount_amount: number;
  total_amount: number;
  notes?: string;
  invoice_number?: string;
  invoice_photo_url?: string;
  items: PurchaseOrderItem[];
  created_at: string;
  updated_at: string;
}

export default function PurchaseOrderManagement() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadPurchaseOrders();
    loadSuppliers();
  }, []);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          supplier:suppliers(*),
          items:purchase_order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchaseOrders(data || []);
    } catch (error) {
      console.error('Error loading purchase orders:', error);
      toast.error('خطأ في تحميل أوامر الشراء');
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      toast.error('خطأ في تحميل الموردين');
    }
  };

  const createNewPO = () => {
    const newPO: PurchaseOrder = {
      po_number: `PO-${Date.now()}`,
      supplier_id: '',
      supplier: {} as Supplier,
      order_date: new Date().toISOString().split('T')[0],
      status: 'draft',
      payment_method: 'immediate',
      subtotal: 0,
      tax_amount: 0,
      additional_costs: 0,
      discount_amount: 0,
      total_amount: 0,
      items: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setSelectedPO(newPO);
    setIsCreating(true);
    setIsEditing(true);
  };

  const addPOItem = () => {
    if (!selectedPO) return;
    
    const newItem: PurchaseOrderItem = {
      product_name: '',
      quantity: 1,
      unit_cost: 0,
      total_cost: 0,
      tax_rate: 15 // Default VAT rate
    };

    setSelectedPO({
      ...selectedPO,
      items: [...selectedPO.items, newItem]
    });
  };

  const updatePOItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    if (!selectedPO) return;

    const updatedItems = [...selectedPO.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Calculate total cost for the item
    if (field === 'quantity' || field === 'unit_cost') {
      updatedItems[index].total_cost = updatedItems[index].quantity * updatedItems[index].unit_cost;
    }

    // Recalculate totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total_cost, 0);
    const taxAmount = updatedItems.reduce((sum, item) => sum + (item.total_cost * item.tax_rate / 100), 0);
    const totalAmount = subtotal + taxAmount + selectedPO.additional_costs - selectedPO.discount_amount;

    setSelectedPO({
      ...selectedPO,
      items: updatedItems,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount
    });
  };

  const removePOItem = (index: number) => {
    if (!selectedPO) return;
    
    const updatedItems = selectedPO.items.filter((_, i) => i !== index);
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total_cost, 0);
    const taxAmount = updatedItems.reduce((sum, item) => sum + (item.total_cost * item.tax_rate / 100), 0);
    const totalAmount = subtotal + taxAmount + selectedPO.additional_costs - selectedPO.discount_amount;

    setSelectedPO({
      ...selectedPO,
      items: updatedItems,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount
    });
  };

  const savePurchaseOrder = async () => {
    if (!selectedPO || !selectedPO.supplier_id || selectedPO.items.length === 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة وإضافة عنصر واحد على الأقل');
      return;
    }

    try {
      setLoading(true);

      if (isCreating) {
        // Create new purchase order
        const { data: poData, error: poError } = await supabase
          .from('purchase_orders')
          .insert({
            po_number: selectedPO.po_number,
            supplier_id: selectedPO.supplier_id,
            order_date: selectedPO.order_date,
            expected_delivery_date: selectedPO.expected_delivery_date,
            status: selectedPO.status,
            payment_method: selectedPO.payment_method,
            payment_due_date: selectedPO.payment_due_date,
            subtotal: selectedPO.subtotal,
            tax_amount: selectedPO.tax_amount,
            additional_costs: selectedPO.additional_costs,
            discount_amount: selectedPO.discount_amount,
            total_amount: selectedPO.total_amount,
            notes: selectedPO.notes,
            invoice_number: selectedPO.invoice_number,
            invoice_photo_url: selectedPO.invoice_photo_url
          })
          .select()
          .single();

        if (poError) throw poError;

        // Insert purchase order items
        const itemsToInsert = selectedPO.items.map(item => ({
          purchase_order_id: poData.id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_cost: item.unit_cost,
          total_cost: item.total_cost,
          tax_rate: item.tax_rate,
          description: item.description
        }));

        const { error: itemsError } = await supabase
          .from('purchase_order_items')
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;

        toast.success('تم إنشاء أمر الشراء بنجاح');
      } else {
        // Update existing purchase order
        const { error: poError } = await supabase
          .from('purchase_orders')
          .update({
            supplier_id: selectedPO.supplier_id,
            order_date: selectedPO.order_date,
            expected_delivery_date: selectedPO.expected_delivery_date,
            status: selectedPO.status,
            payment_method: selectedPO.payment_method,
            payment_due_date: selectedPO.payment_due_date,
            subtotal: selectedPO.subtotal,
            tax_amount: selectedPO.tax_amount,
            additional_costs: selectedPO.additional_costs,
            discount_amount: selectedPO.discount_amount,
            total_amount: selectedPO.total_amount,
            notes: selectedPO.notes,
            invoice_number: selectedPO.invoice_number,
            invoice_photo_url: selectedPO.invoice_photo_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedPO.id);

        if (poError) throw poError;

        toast.success('تم تحديث أمر الشراء بنجاح');
      }

      await loadPurchaseOrders();
      setIsCreating(false);
      setIsEditing(false);
      setSelectedPO(null);

    } catch (error) {
      console.error('Error saving purchase order:', error);
      toast.error('خطأ في حفظ أمر الشراء');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: 'مسودة', color: 'bg-gray-100 text-gray-800' },
      sent: { label: 'مُرسل', color: 'bg-blue-100 text-blue-800' },
      confirmed: { label: 'مؤكد', color: 'bg-yellow-100 text-yellow-800' },
      received: { label: 'مُستلم', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800' }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    
    return (
      <Badge className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  const filteredPOs = purchaseOrders.filter(po =>
    po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة أوامر الشراء</h1>
        <p className="text-gray-600">إدارة وتتبع أوامر الشراء من الموردين</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchase Orders List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  أوامر الشراء
                </CardTitle>
                <Button onClick={createNewPO} size="sm">
                  <Plus className="w-4 h-4 ml-1" />
                  جديد
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في أوامر الشراء..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredPOs.map((po) => (
                  <div
                    key={po.id}
                    onClick={() => {
                      setSelectedPO(po);
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedPO?.id === po.id ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{po.po_number}</span>
                      {getStatusBadge(po.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{po.supplier?.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(po.order_date).toLocaleDateString('en-US')}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      {po.total_amount.toLocaleString('en-US')} ريال
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Order Details */}
        <div className="lg:col-span-2">
          {selectedPO ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {isCreating ? 'أمر شراء جديد' : `أمر الشراء ${selectedPO.po_number}`}
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
                        <Button onClick={savePurchaseOrder} disabled={loading} size="sm">
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
                    <Label htmlFor="po_number">رقم أمر الشراء</Label>
                    <Input
                      id="po_number"
                      value={selectedPO.po_number}
                      onChange={(e) => setSelectedPO({ ...selectedPO, po_number: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="supplier">المورد</Label>
                    <Select
                      value={selectedPO.supplier_id}
                      onValueChange={(value) => {
                        const supplier = suppliers.find(s => s.id === value);
                        setSelectedPO({ 
                          ...selectedPO, 
                          supplier_id: value,
                          supplier: supplier || {} as Supplier
                        });
                      }}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المورد" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="order_date">تاريخ الطلب</Label>
                    <Input
                      id="order_date"
                      type="date"
                      value={selectedPO.order_date}
                      onChange={(e) => setSelectedPO({ ...selectedPO, order_date: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">الحالة</Label>
                    <Select
                      value={selectedPO.status}
                      onValueChange={(value) => setSelectedPO({ ...selectedPO, status: value as any })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">مسودة</SelectItem>
                        <SelectItem value="sent">مُرسل</SelectItem>
                        <SelectItem value="confirmed">مؤكد</SelectItem>
                        <SelectItem value="received">مُستلم</SelectItem>
                        <SelectItem value="cancelled">ملغي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="payment_method">طريقة الدفع</Label>
                    <Select
                      value={selectedPO.payment_method}
                      onValueChange={(value) => setSelectedPO({ ...selectedPO, payment_method: value as any })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">فوري</SelectItem>
                        <SelectItem value="deferred">آجل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPO.payment_method === 'deferred' && (
                    <div>
                      <Label htmlFor="payment_due_date">تاريخ الاستحقاق</Label>
                      <Input
                        id="payment_due_date"
                        type="date"
                        value={selectedPO.payment_due_date || ''}
                        onChange={(e) => setSelectedPO({ ...selectedPO, payment_due_date: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Purchase Order Items */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">عناصر أمر الشراء</h3>
                    {isEditing && (
                      <Button onClick={addPOItem} variant="outline" size="sm">
                        <Plus className="w-4 h-4 ml-1" />
                        إضافة عنصر
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {selectedPO.items.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                          <div className="md:col-span-2">
                            <Label>اسم المنتج</Label>
                            <Input
                              value={item.product_name}
                              onChange={(e) => updatePOItem(index, 'product_name', e.target.value)}
                              disabled={!isEditing}
                              placeholder="اسم المنتج"
                            />
                          </div>
                          
                          <div>
                            <Label>الكمية</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updatePOItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                              disabled={!isEditing}
                              min="0"
                            />
                          </div>
                          
                          <div>
                            <Label>سعر الوحدة</Label>
                            <Input
                              type="number"
                              value={item.unit_cost}
                              onChange={(e) => updatePOItem(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                              disabled={!isEditing}
                              min="0"
                              step="0.01"
                            />
                          </div>

                          <div>
                            <Label>نسبة الضريبة (%)</Label>
                            <Input
                              type="number"
                              value={item.tax_rate}
                              onChange={(e) => updatePOItem(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                              disabled={!isEditing}
                              min="0"
                              max="100"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <Label>المجموع</Label>
                              <Input
                                value={item.total_cost.toFixed(2)}
                                disabled
                                className="bg-gray-50"
                              />
                            </div>
                            {isEditing && (
                              <Button
                                onClick={() => removePOItem(index)}
                                variant="destructive"
                                size="sm"
                                className="mt-6"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {isEditing && (
                          <div className="mt-4">
                            <Label>وصف العنصر</Label>
                            <Textarea
                              value={item.description || ''}
                              onChange={(e) => updatePOItem(index, 'description', e.target.value)}
                              placeholder="وصف العنصر (اختياري)"
                              rows={2}
                            />
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="additional_costs">تكاليف إضافية (شحن، رسوم)</Label>
                      <Input
                        id="additional_costs"
                        type="number"
                        value={selectedPO.additional_costs}
                        onChange={(e) => {
                          const additionalCosts = parseFloat(e.target.value) || 0;
                          const totalAmount = selectedPO.subtotal + selectedPO.tax_amount + additionalCosts - selectedPO.discount_amount;
                          setSelectedPO({ 
                            ...selectedPO, 
                            additional_costs: additionalCosts,
                            total_amount: totalAmount
                          });
                        }}
                        disabled={!isEditing}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="discount_amount">خصم على الإجمالي</Label>
                      <Input
                        id="discount_amount"
                        type="number"
                        value={selectedPO.discount_amount}
                        onChange={(e) => {
                          const discountAmount = parseFloat(e.target.value) || 0;
                          const totalAmount = selectedPO.subtotal + selectedPO.tax_amount + selectedPO.additional_costs - discountAmount;
                          setSelectedPO({ 
                            ...selectedPO, 
                            discount_amount: discountAmount,
                            total_amount: totalAmount
                          });
                        }}
                        disabled={!isEditing}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">ملاحظات</Label>
                      <Textarea
                        id="notes"
                        value={selectedPO.notes || ''}
                        onChange={(e) => setSelectedPO({ ...selectedPO, notes: e.target.value })}
                        disabled={!isEditing}
                        rows={3}
                        placeholder="ملاحظات إضافية على أمر الشراء"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card className="p-4 bg-gray-50">
                      <h4 className="font-semibold mb-3">ملخص الفاتورة</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>المجموع الفرعي:</span>
                          <span>{selectedPO.subtotal.toFixed(2)} ريال</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الضريبة:</span>
                          <span>{selectedPO.tax_amount.toFixed(2)} ريال</span>
                        </div>
                        <div className="flex justify-between">
                          <span>تكاليف إضافية:</span>
                          <span>{selectedPO.additional_costs.toFixed(2)} ريال</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الخصم:</span>
                          <span>-{selectedPO.discount_amount.toFixed(2)} ريال</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                          <span>المجموع الإجمالي:</span>
                          <span className="text-green-600">{selectedPO.total_amount.toFixed(2)} ريال</span>
                        </div>
                      </div>
                    </Card>

                    {isEditing && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="invoice_number">رقم فاتورة المورد</Label>
                          <Input
                            id="invoice_number"
                            value={selectedPO.invoice_number || ''}
                            onChange={(e) => setSelectedPO({ ...selectedPO, invoice_number: e.target.value })}
                            placeholder="رقم الفاتورة من المورد"
                          />
                        </div>

                        <div>
                          <Label htmlFor="invoice_photo">رفع صورة الفاتورة</Label>
                          <div className="mt-2">
                            <Button variant="outline" className="w-full" onClick={() => alert('Button clicked')}>
                              <Upload className="w-4 h-4 ml-2" />
                              اختر صورة الفاتورة
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">اختر أمر شراء لعرض التفاصيل</p>
                <p className="text-sm">أو أنشئ أمر شراء جديد للبدء</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
