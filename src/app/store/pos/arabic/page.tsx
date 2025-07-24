// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Label } from '@/core/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/shared/components/ui/select';
import { Textarea } from '@/core/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Separator } from '@/core/shared/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/core/shared/components/ui/dialog';
import { 
  Plus, 
  Minus,
  Search, 
  ShoppingCart, 
  CreditCard, 
  DollarSign,
  Percent,
  Trash2,
  Pause,
  Play,
  Receipt,
  User,
  BarChart3,
  Settings,
  Calculator,
  Edit,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  name_ar: string;
  barcode?: string;
  price: number;
  cost_price: number;
  quantity_in_stock: number;
  category: string;
  image_url?: string;
  allow_discount: boolean;
  min_price?: number;
  created_at: string;
}

interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_number?: string;
  customer_type: 'individual' | 'business';
  outstanding_balance: number;
  created_at: string;
}

interface SaleItem {
  id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total_price: number;
  notes?: string;
}

interface Sale {
  id?: string;
  sale_number: string;
  customer_id?: string;
  customer?: Customer;
  items: SaleItem[];
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  payment_method: 'cash' | 'card' | 'transfer' | 'credit' | 'mixed';
  payment_status: 'paid' | 'pending' | 'partial';
  notes?: string;
  cashier_id: string;
  is_suspended: boolean;
  suspended_at?: string;
  created_at: string;
}

interface SuspendedSale {
  id: string;
  sale_data: Sale;
  suspended_by: string;
  suspended_at: string;
}

export default function EnhancedPOSSystem() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentSale, setCurrentSale] = useState<Sale>({
    sale_number: '',
    items: [],
    subtotal: 0,
    discount_amount: 0,
    tax_amount: 0,
    total_amount: 0,
    payment_method: 'cash',
    payment_status: 'paid',
    cashier_id: 'current_user_id',
    is_suspended: false,
    created_at: new Date().toISOString()
  });
  const [suspendedSales, setSuspendedSales] = useState<SuspendedSale[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSuspendedDialog, setShowSuspendedDialog] = useState(false);
  const [paymentAmounts, setPaymentAmounts] = useState({
    cash: 0,
    card: 0,
    transfer: 0
  });
  const [customerToAdd, setCustomerToAdd] = useState({
    name: '',
    phone: '',
    email: '',
    tax_number: '',
    customer_type: 'individual' as 'individual' | 'business'
  });

  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadProducts();
    loadCustomers();
    loadSuspendedSales();
    generateSaleNumber();
    
    // Focus barcode input on mount
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gt('quantity_in_stock', 0)
        .order('name_ar');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('خطأ في تحميل المنتجات');
    }
  };

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('خطأ في تحميل العملاء');
    }
  };

  const loadSuspendedSales = async () => {
    try {
      const { data, error } = await supabase
        .from('suspended_sales')
        .select('*')
        .order('suspended_at', { ascending: false });

      if (error) throw error;
      setSuspendedSales(data || []);
    } catch (error) {
      console.error('Error loading suspended sales:', error);
      toast.error('خطأ في تحميل المبيعات المعلقة');
    }
  };

  const generateSaleNumber = () => {
    const saleNumber = `SALE-${Date.now()}`;
    setCurrentSale(prev => ({ ...prev, sale_number: saleNumber }));
  };

  const handleBarcodeInput = async (barcode: string) => {
    if (!barcode.trim()) return;

    const product = products.find(p => p.barcode === barcode || p.id === barcode);
    if (product) {
      addItemToSale(product);
      setBarcodeInput('');
    } else {
      toast.error('المنتج غير موجود');
      setBarcodeInput('');
    }
  };

  const addItemToSale = (product: Product, quantity: number = 1) => {
    if (product.quantity_in_stock < quantity) {
      toast.error('الكمية المطلوبة غير متوفرة في المخزون');
      return;
    }

    const existingItemIndex = currentSale.items.findIndex(item => item.product.id === product.id);
    
    let updatedItems;
    if (existingItemIndex >= 0) {
      updatedItems = [...currentSale.items];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.quantity_in_stock) {
        toast.error('الكمية المطلوبة تتجاوز المخزون المتوفر');
        return;
      }
      
      updatedItems[existingItemIndex].quantity = newQuantity;
      updatedItems[existingItemIndex].total_price = newQuantity * updatedItems[existingItemIndex].unit_price - updatedItems[existingItemIndex].discount_amount;
    } else {
      const newItem: SaleItem = {
        id: `item-${Date.now()}-${Math.random()}`,
        product,
        quantity,
        unit_price: product.price,
        discount_amount: 0,
        total_price: quantity * product.price
      };
      updatedItems = [...currentSale.items, newItem];
    }

    updateSaleTotals(updatedItems);
  };

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromSale(itemId);
      return;
    }

    const updatedItems = currentSale.items.map(item => {
      if (item.id === itemId) {
        if (newQuantity > item.product.quantity_in_stock) {
          toast.error('الكمية المطلوبة تتجاوز المخزون المتوفر');
          return item;
        }
        return {
          ...item,
          quantity: newQuantity,
          total_price: newQuantity * item.unit_price - item.discount_amount
        };
      }
      return item;
    });

    updateSaleTotals(updatedItems);
  };

  const updateItemPrice = (itemId: string, newPrice: number) => {
    const updatedItems = currentSale.items.map(item => {
      if (item.id === itemId) {
        // Check minimum price if set
        if (item.product.min_price && newPrice < item.product.min_price) {
          toast.error(`السعر لا يمكن أن يكون أقل من ${item.product.min_price} ريال`);
          return item;
        }
        
        return {
          ...item,
          unit_price: newPrice,
          total_price: item.quantity * newPrice - item.discount_amount
        };
      }
      return item;
    });

    updateSaleTotals(updatedItems);
  };

  const updateItemDiscount = (itemId: string, discountAmount: number) => {
    const updatedItems = currentSale.items.map(item => {
      if (item.id === itemId) {
        if (!item.product.allow_discount && discountAmount > 0) {
          toast.error('هذا المنتج لا يقبل خصم');
          return item;
        }
        
        const maxDiscount = item.quantity * item.unit_price;
        if (discountAmount > maxDiscount) {
          toast.error('مبلغ الخصم لا يمكن أن يتجاوز سعر المنتج');
          return item;
        }
        
        return {
          ...item,
          discount_amount: discountAmount,
          total_price: (item.quantity * item.unit_price) - discountAmount
        };
      }
      return item;
    });

    updateSaleTotals(updatedItems);
  };

  const removeItemFromSale = (itemId: string) => {
    const updatedItems = currentSale.items.filter(item => item.id !== itemId);
    updateSaleTotals(updatedItems);
  };

  const updateSaleTotals = (items: SaleItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const taxAmount = subtotal * 0.15; // 15% VAT
    const totalAmount = subtotal + taxAmount - currentSale.discount_amount;

    setCurrentSale(prev => ({
      ...prev,
      items,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount
    }));
  };

  const applySaleDiscount = (discountAmount: number) => {
    const totalAmount = currentSale.subtotal + currentSale.tax_amount - discountAmount;
    
    setCurrentSale(prev => ({
      ...prev,
      discount_amount: discountAmount,
      total_amount: totalAmount
    }));
  };

  const suspendSale = async () => {
    if (currentSale.items.length === 0) {
      toast.error('لا يمكن تعليق فاتورة فارغة');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('suspended_sales')
        .insert({
          sale_data: currentSale,
          suspended_by: 'current_user_id',
          suspended_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('تم تعليق الفاتورة بنجاح');
      clearCurrentSale();
      await loadSuspendedSales();

    } catch (error) {
      console.error('Error suspending sale:', error);
      toast.error('خطأ في تعليق الفاتورة');
    } finally {
      setLoading(false);
    }
  };

  const resumeSale = async (suspendedSaleId: string) => {
    try {
      const suspendedSale = suspendedSales.find(s => s.id === suspendedSaleId);
      if (!suspendedSale) return;

      setCurrentSale(suspendedSale.sale_data);
      
      // Delete from suspended sales
      await supabase
        .from('suspended_sales')
        .delete()
        .eq('id', suspendedSaleId);

      setShowSuspendedDialog(false);
      await loadSuspendedSales();
      toast.success('تم استئناف الفاتورة');

    } catch (error) {
      console.error('Error resuming sale:', error);
      toast.error('خطأ في استئناف الفاتورة');
    }
  };

  const processSale = async () => {
    if (currentSale.items.length === 0) {
      toast.error('لا يمكن إتمام فاتورة فارغة');
      return;
    }

    try {
      setLoading(true);

      // Create sale record
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert({
          sale_number: currentSale.sale_number,
          customer_id: currentSale.customer_id,
          subtotal: currentSale.subtotal,
          discount_amount: currentSale.discount_amount,
          tax_amount: currentSale.tax_amount,
          total_amount: currentSale.total_amount,
          payment_method: currentSale.payment_method,
          payment_status: currentSale.payment_status,
          notes: currentSale.notes,
          cashier_id: currentSale.cashier_id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Create sale items
      const saleItems = currentSale.items.map(item => ({
        sale_id: saleData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_amount: item.discount_amount,
        total_price: item.total_price,
        notes: item.notes
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      // Update inventory
      for (const item of currentSale.items) {
        await supabase
          .from('products')
          .update({
            quantity_in_stock: item.product.quantity_in_stock - item.quantity
          })
          .eq('id', item.product.id);
      }

      toast.success('تم إتمام البيع بنجاح');
      setShowPaymentDialog(false);
      clearCurrentSale();
      await loadProducts(); // Refresh products to update stock

    } catch (error) {
      console.error('Error processing sale:', error);
      toast.error('خطأ في إتمام البيع');
    } finally {
      setLoading(false);
    }
  };

  const addNewCustomer = async () => {
    if (!customerToAdd.name.trim()) {
      toast.error('اسم العميل مطلوب');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: customerToAdd.name,
          phone: customerToAdd.phone,
          email: customerToAdd.email,
          tax_number: customerToAdd.tax_number,
          customer_type: customerToAdd.customer_type,
          outstanding_balance: 0
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSale(prev => ({ ...prev, customer_id: data.id, customer: data }));
      setCustomerToAdd({ name: '', phone: '', email: '', tax_number: '', customer_type: 'individual' });
      setShowCustomerDialog(false);
      await loadCustomers();
      toast.success('تم إضافة العميل بنجاح');

    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('خطأ في إضافة العميل');
    } finally {
      setLoading(false);
    }
  };

  const clearCurrentSale = () => {
    setCurrentSale({
      sale_number: '',
      items: [],
      subtotal: 0,
      discount_amount: 0,
      tax_amount: 0,
      total_amount: 0,
      payment_method: 'cash',
      payment_status: 'paid',
      cashier_id: 'current_user_id',
      is_suspended: false,
      created_at: new Date().toISOString()
    });
    generateSaleNumber();
    setPaymentAmounts({ cash: 0, card: 0, transfer: 0 });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.barcode && product.barcode.includes(searchTerm));
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="h-screen bg-gray-100 flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">نقطة البيع</h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-3 py-1">
              فاتورة: {currentSale.sale_number}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setShowSuspendedDialog(true)}>
              <Pause className="w-4 h-4 ml-1" />
              المعلقة ({suspendedSales.length})
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Products Panel */}
        <div className="w-2/3 bg-white border-l p-4 overflow-hidden flex flex-col">
          {/* Search and Barcode */}
          <div className="mb-4 space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  ref={barcodeInputRef}
                  placeholder="مسح الباركود أو البحث في المنتجات..."
                  value={barcodeInput || searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 8 && !value.includes(' ')) {
                      // Likely a barcode
                      setBarcodeInput(value);
                      handleBarcodeInput(value);
                    } else {
                      setBarcodeInput('');
                      setSearchTerm(value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && barcodeInput) {
                      handleBarcodeInput(barcodeInput);
                    }
                  }}
                  className="pr-10 text-lg h-12"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="جميع الفئات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الفئات</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-4 gap-3">
              {filteredProducts.map(product => (
                <Card 
                  key={product.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => addItemToSale(product)}
                >
                  <CardContent className="p-3">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name_ar}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                        <BarChart3 className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name_ar}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">
                        {product.price.toFixed(2)} ريال
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {product.quantity_in_stock}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Panel */}
        <div className="w-1/3 bg-gray-50 p-4 flex flex-col">
          {/* Customer Selection */}
          <Card className="mb-4">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                <span className="font-medium">العميل</span>
              </div>
              <div className="flex gap-2">
                <Select
                  value={currentSale.customer_id || ''}
                  onValueChange={(value) => {
                    const customer = customers.find(c => c.id === value);
                    setCurrentSale(prev => ({ 
                      ...prev, 
                      customer_id: value || undefined,
                      customer 
                    }));
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">عميل عام</SelectItem>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} {customer.phone && `- ${customer.phone}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => setShowCustomerDialog(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto mb-4">
            <Card className="h-full">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm">عناصر الفاتورة ({currentSale.items.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                {currentSale.items.length > 0 ? (
                  <div className="space-y-2">
                    {currentSale.items.map(item => (
                      <div key={item.id} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.product.name_ar}</h4>
                            <p className="text-xs text-gray-500">{item.product.barcode}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItemFromSale(item.id)}
                            className="text-red-500 p-1"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <Label className="text-xs">الكمية</Label>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                                className="h-6 text-center text-xs"
                                min="1"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs">السعر</Label>
                            <Input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                              className="h-6 text-xs"
                              step="0.01"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">خصم</Label>
                            <Input
                              type="number"
                              value={item.discount_amount}
                              onChange={(e) => updateItemDiscount(item.id, parseFloat(e.target.value) || 0)}
                              className="h-6 text-xs"
                              step="0.01"
                              disabled={!item.product.allow_discount}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-2 text-right">
                          <span className="font-bold text-green-600">
                            {item.total_price.toFixed(2)} ريال
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">السلة فارغة</p>
                    <p className="text-xs">ابدأ بإضافة منتجات</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Totals and Actions */}
          <div className="space-y-3">
            {/* Sale Discount */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="w-4 h-4" />
                  <Label className="text-sm">خصم على الفاتورة</Label>
                </div>
                <Input
                  type="number"
                  value={currentSale.discount_amount}
                  onChange={(e) => applySaleDiscount(parseFloat(e.target.value) || 0)}
                  className="text-center"
                  step="0.01"
                  min="0"
                />
              </CardContent>
            </Card>

            {/* Totals */}
            <Card>
              <CardContent className="p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>المجموع الفرعي:</span>
                  <span>{currentSale.subtotal.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الخصم:</span>
                  <span>-{currentSale.discount_amount.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الضريبة (15%):</span>
                  <span>{currentSale.tax_amount.toFixed(2)} ريال</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي:</span>
                  <span className="text-green-600">{currentSale.total_amount.toFixed(2)} ريال</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={suspendSale}
                disabled={currentSale.items.length === 0 || loading}
                className="h-12"
              >
                <Pause className="w-4 h-4 ml-1" />
                تعليق
              </Button>
              <Button
                onClick={() => setShowPaymentDialog(true)}
                disabled={currentSale.items.length === 0 || loading}
                className="h-12 bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="w-4 h-4 ml-1" />
                دفع
              </Button>
            </div>
            
            <Button
              variant="destructive"
              onClick={clearCurrentSale}
              disabled={loading}
              className="w-full h-10"
            >
              <Trash2 className="w-4 h-4 ml-1" />
              إلغاء الفاتورة
            </Button>
          </div>
        </div>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة عميل جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customer_name">اسم العميل *</Label>
              <Input
                id="customer_name"
                value={customerToAdd.name}
                onChange={(e) => setCustomerToAdd(prev => ({ ...prev, name: e.target.value }))}
                placeholder="اسم العميل"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_phone">رقم الهاتف</Label>
                <Input
                  id="customer_phone"
                  value={customerToAdd.phone}
                  onChange={(e) => setCustomerToAdd(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="رقم الهاتف"
                />
              </div>
              <div>
                <Label htmlFor="customer_type">نوع العميل</Label>
                <Select
                  value={customerToAdd.customer_type}
                  onValueChange={(value) => setCustomerToAdd(prev => ({ ...prev, customer_type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">فرد</SelectItem>
                    <SelectItem value="business">شركة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="customer_email">البريد الإلكتروني</Label>
              <Input
                id="customer_email"
                type="email"
                value={customerToAdd.email}
                onChange={(e) => setCustomerToAdd(prev => ({ ...prev, email: e.target.value }))}
                placeholder="البريد الإلكتروني"
              />
            </div>

            {customerToAdd.customer_type === 'business' && (
              <div>
                <Label htmlFor="customer_tax">الرقم الضريبي</Label>
                <Input
                  id="customer_tax"
                  value={customerToAdd.tax_number}
                  onChange={(e) => setCustomerToAdd(prev => ({ ...prev, tax_number: e.target.value }))}
                  placeholder="الرقم الضريبي"
                />
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={addNewCustomer} disabled={loading}>
                <Save className="w-4 h-4 ml-1" />
                حفظ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد الدفع</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600">المبلغ المطلوب</p>
                <p className="text-3xl font-bold text-green-600">
                  {currentSale.total_amount.toFixed(2)} ريال
                </p>
              </div>
            </div>

            <div>
              <Label>طريقة الدفع</Label>
              <Select
                value={currentSale.payment_method}
                onValueChange={(value) => setCurrentSale(prev => ({ ...prev, payment_method: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">نقدي</SelectItem>
                  <SelectItem value="card">بطاقة</SelectItem>
                  <SelectItem value="transfer">تحويل بنكي</SelectItem>
                  <SelectItem value="credit">آجل</SelectItem>
                  <SelectItem value="mixed">مختلط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentSale.payment_method === 'mixed' && (
              <div className="space-y-2">
                <div>
                  <Label>نقدي</Label>
                  <Input
                    type="number"
                    value={paymentAmounts.cash}
                    onChange={(e) => setPaymentAmounts(prev => ({ ...prev, cash: parseFloat(e.target.value) || 0 }))}
                    step="0.01"
                  />
                </div>
                <div>
                  <Label>بطاقة</Label>
                  <Input
                    type="number"
                    value={paymentAmounts.card}
                    onChange={(e) => setPaymentAmounts(prev => ({ ...prev, card: parseFloat(e.target.value) || 0 }))}
                    step="0.01"
                  />
                </div>
                <div>
                  <Label>تحويل</Label>
                  <Input
                    type="number"
                    value={paymentAmounts.transfer}
                    onChange={(e) => setPaymentAmounts(prev => ({ ...prev, transfer: parseFloat(e.target.value) || 0 }))}
                    step="0.01"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  المجموع: {(paymentAmounts.cash + paymentAmounts.card + paymentAmounts.transfer).toFixed(2)} ريال
                </div>
              </div>
            )}

            {currentSale.payment_method === 'credit' && (
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  سيتم إضافة هذا المبلغ إلى حساب العميل كدين
                </p>
              </div>
            )}

            <div>
              <Label>ملاحظات</Label>
              <Textarea
                value={currentSale.notes || ''}
                onChange={(e) => setCurrentSale(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="ملاحظات على الفاتورة"
                rows={2}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={processSale} disabled={loading} className="bg-green-600 hover:bg-green-700">
                <Receipt className="w-4 h-4 ml-1" />
                إتمام البيع
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Suspended Sales Dialog */}
      <Dialog open={showSuspendedDialog} onOpenChange={setShowSuspendedDialog}>
        <DialogContent dir="rtl" className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>الفواتير المعلقة</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {suspendedSales.length > 0 ? (
              suspendedSales.map(suspendedSale => (
                <div key={suspendedSale.id} className="bg-gray-50 p-4 rounded border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{suspendedSale.sale_data.sale_number}</p>
                      <p className="text-sm text-gray-600">
                        {suspendedSale.sale_data.items.length} عنصر - {suspendedSale.sale_data.total_amount.toFixed(2)} ريال
                      </p>
                      <p className="text-xs text-gray-500">
                        معلق في: {new Date(suspendedSale.suspended_at).toLocaleString('en-US')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => resumeSale(suspendedSale.id)}
                    >
                      <Play className="w-4 h-4 ml-1" />
                      استئناف
                    </Button>
                  </div>
                  <div className="text-xs text-gray-600">
                    {suspendedSale.sale_data.items.slice(0, 2).map((item, index) => (
                      <span key={index}>
                        {item.product.name_ar} ({item.quantity}x)
                        {index < Math.min(suspendedSale.sale_data.items.length - 1, 1) ? ', ' : ''}
                      </span>
                    ))}
                    {suspendedSale.sale_data.items.length > 2 && ' ...'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Pause className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>لا توجد فواتير معلقة</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
