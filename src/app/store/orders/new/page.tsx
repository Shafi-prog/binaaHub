'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Scan, Plus, Search, ShoppingCart } from 'lucide-react';
import { ClientIcon } from '@/components/icons';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { verifyTempAuth } from '@/lib/temp-auth';
import BarcodeScanner from '@/components/barcode/BarcodeScanner';
import UnifiedBarcodeScanner from '@/components/barcode/UnifiedBarcodeScanner';
import ProductSearch from '@/components/orders/ProductSearch';
import OrderSummary from '@/components/orders/OrderSummary';

interface Product {
  id: string;
  name: string;
  barcode?: string;
  price: number;
  stock: number;
  description?: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Customer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
}

export default function CreateOrderPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({ name: '' });
  const [showScanner, setShowScanner] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authResult = await verifyTempAuth(5);
        if (!authResult?.user) {
          router.push('/login');
          return;
        }
        setUser(authResult.user);
      } catch (error) {
        console.error('Error loading user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  useEffect(() => {
    const newTotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    setTotal(newTotal);
  }, [orderItems]);

  const handleBarcodeScanned = async (barcode: string) => {
    try {
      // Search for product by barcode
      const product = await searchProductByBarcode(barcode);
      if (product) {
        addProductToOrder(product);
        setShowScanner(false);
      } else {
        alert(`لم يتم العثور على منتج بالباركود: ${barcode}`);
      }
    } catch (error) {
      console.error('Error searching product by barcode:', error);
      alert('خطأ في البحث عن المنتج');
    }
  };
  const handleUnifiedProductSelect = (product: any) => {
    const formattedProduct: Product = {
      id: product.id,
      name: product.name || product.name_ar,
      barcode: product.barcode,
      price: product.price,
      stock: product.stock || product.stock_quantity || 0,
      description: product.description || product.description_ar
    };
    
    addProductToOrder(formattedProduct);
    setShowScanner(false);
  };

  const searchProductByBarcode = async (barcode: string): Promise<Product | null> => {
    try {
      // First try construction products API
      const constructionResponse = await fetch(`/api/construction-products?barcode=${barcode}`);
      if (constructionResponse.ok) {
        const constructionData = await constructionResponse.json();
        if (constructionData.products && constructionData.products.length > 0) {          const constructionProduct = constructionData.products[0];
          // Convert construction product to order product format
          return {
            id: constructionProduct.id,
            name: constructionProduct.name_ar,
            barcode: constructionProduct.barcode,
            price: constructionProduct.price,
            stock: constructionProduct.stock_quantity,
            description: constructionProduct.description_ar
          };
        }
      }

      // Fallback to mock data or other product sources
      const mockProducts: Product[] = [
        { id: '1', name: 'iPhone 14', barcode: '1234567890123', price: 999, stock: 10 },
        { id: '2', name: 'Samsung Galaxy S23', barcode: '2345678901234', price: 899, stock: 15 },
        { id: '3', name: 'MacBook Pro', barcode: '3456789012345', price: 1999, stock: 5 },
      ];

      return mockProducts.find(p => p.barcode === barcode) || null;
    } catch (error) {
      console.error('Error searching product by barcode:', error);
      return null;
    }
  };

  const addProductToOrder = (product: Product, quantity: number = 1) => {
    const existingItemIndex = orderItems.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unitPrice;
      setOrderItems(updatedItems);
    } else {
      // Add new item
      const newItem: OrderItem = {
        product,
        quantity,
        unitPrice: product.price,
        total: product.price * quantity
      };
      setOrderItems([...orderItems, newItem]);
    }
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromOrder(productId);
      return;
    }

    const updatedItems = orderItems.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity: newQuantity,
          total: newQuantity * item.unitPrice
        };
      }
      return item;
    });
    setOrderItems(updatedItems);
  };

  const removeItemFromOrder = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.product.id !== productId));
  };
  const handleCreateOrder = async () => {
    if (orderItems.length === 0) {
      alert('يرجى إضافة منتجات للطلب');
      return;
    }

    if (!customer.name.trim()) {
      alert('يرجى إدخال اسم العميل');
      return;
    }

    try {
      const orderData = {
        userId: user.id,
        storeId: user.id,
        items: orderItems.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.total
        })),
        customerInfo: customer,
        notes: orderNotes,
        totalAmount: total
      };

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('تم إنشاء الطلب بنجاح!');
        router.push('/store/orders');
      } else {
        const error = await response.json();
        alert(`خطأ في إنشاء الطلب: ${error.error || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('خطأ في إنشاء الطلب');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <SimpleLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link href="/store/orders" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">إنشاء طلب جديد</h1>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center justify-center space-x-3 space-x-reverse p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl transition-all duration-300 group"
          >
            <Scan className="text-blue-600 group-hover:text-blue-700" size={24} />
            <span className="font-medium text-blue-700">مسح الباركود</span>
          </button>
          
          <button
            onClick={() => setShowProductSearch(true)}
            className="flex items-center justify-center space-x-3 space-x-reverse p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl transition-all duration-300 group"
          >
            <Search className="text-green-600 group-hover:text-green-700" size={24} />
            <span className="font-medium text-green-700">البحث عن منتج</span>
          </button>
          
          <button
            onClick={() => {/* Open product categories */}}
            className="flex items-center justify-center space-x-3 space-x-reverse p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-xl transition-all duration-300 group"
          >
            <Plus className="text-purple-600 group-hover:text-purple-700" size={24} />
            <span className="font-medium text-purple-700">تصفح المنتجات</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">معلومات العميل</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم العميل *
                  </label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل اسم العميل"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={customer.phone || ''}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={customer.email || ''}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">عناصر الطلب</h2>
              
              {orderItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">لم يتم إضافة أي منتجات بعد</p>
                  <p className="text-sm text-gray-400 mt-2">استخدم مسح الباركود أو البحث لإضافة منتجات</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                        {item.product.barcode && (
                          <p className="text-sm text-gray-500">الباركود: {item.product.barcode}</p>
                        )}
                        <p className="text-sm text-gray-600">السعر: {item.unitPrice.toLocaleString()} ريال</p>
                      </div>
                      
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => updateItemQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">{item.total.toLocaleString()} ريال</p>
                        </div>
                          <button
                          onClick={() => removeItemFromOrder(item.product.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <span className="text-xl">×</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">ملاحظات الطلب</h2>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="أضف أي ملاحظات خاصة بالطلب..."
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={orderItems}
              total={total}
              onCreateOrder={handleCreateOrder}
              disabled={orderItems.length === 0 || !customer.name.trim()}
            />
          </div>
        </div>        {/* Unified Barcode Scanner Modal */}
        {showScanner && (
          <UnifiedBarcodeScanner
            onProductSelect={handleUnifiedProductSelect}
            onClose={() => setShowScanner(false)}
            title="مسح باركود المنتج"
            mode="all"
            storeId={user?.id}
          />
        )}

        {/* Product Search Modal */}
        {showProductSearch && (
          <ProductSearch
            onProductSelect={addProductToOrder}
            onClose={() => setShowProductSearch(false)}
          />
        )}
      </div>
    </SimpleLayout>
  );
}
