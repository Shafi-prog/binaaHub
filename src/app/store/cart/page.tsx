'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Heart,
  CreditCard,
  Truck,
  ArrowRight,
  Tag,
  Package
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'جهاز كمبيوتر محمول HP',
      price: 2500,
      quantity: 1,
      image: '/placeholder-product.jpg',
      category: 'إلكترونيات'
    },
    {
      id: '2', 
      name: 'سماعات لاسلكية',
      price: 150,
      quantity: 2,
      image: '/placeholder-product.jpg',
      category: 'إكسسوارات'
    },
    {
      id: '3',
      name: 'كيبورد ميكانيكي',
      price: 80,
      quantity: 1,
      image: '/placeholder-product.jpg',
      category: 'إكسسوارات'
    }
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(items => items.filter(item => item.id !== id));
    } else {
      setCartItems(items =>
        items.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 50;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-2xl font-bold text-gray-900">سلة المشتريات من الموردين</h1>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          {cartItems.length} منتج
        </span>
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">سلة المشتريات فارغة</h3>
            <p className="text-gray-600 mb-6">ابدأ بإضافة المنتجات من الموردين إلى سلة المشتريات</p>
            <Button>
              <Package className="h-4 w-4 mr-2" />
              تصفح المنتجات
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                      <p className="text-lg font-bold text-blue-600">{item.price.toLocaleString()} ريال</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 border rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-3 py-1 min-w-[3rem] text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">المجموع الفرعي:</span>
                      <span className="font-medium">{(item.price * item.quantity).toLocaleString()} ريال</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-gray-900 mb-4">كوبون الخصم</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="أدخل كود الخصم"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button variant="outline">
                    <Tag className="h-4 w-4 mr-2" />
                    تطبيق
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span>{subtotal.toLocaleString()} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الشحن:</span>
                  <span>{shipping.toLocaleString()} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الضريبة:</span>
                  <span>{tax.toLocaleString()} ريال</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع الكلي:</span>
                    <span className="text-blue-600">{total.toLocaleString()} ريال</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>خيارات الشحن</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" defaultChecked />
                    <div>
                      <p className="font-medium">الشحن العادي</p>
                      <p className="text-sm text-gray-600">3-5 أيام عمل</p>
                    </div>
                  </div>
                  <span className="text-sm">50 ريال</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" />
                    <div>
                      <p className="font-medium">الشحن السريع</p>
                      <p className="text-sm text-gray-600">1-2 أيام عمل</p>
                    </div>
                  </div>
                  <span className="text-sm">100 ريال</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button className="w-full" size="lg">
                <CreditCard className="h-5 w-5 mr-2" />
                متابعة إلى الدفع
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <Button variant="outline" className="w-full">
                <Truck className="h-4 w-4 mr-2" />
                حفظ للشراء لاحقاً
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                شحن مجاني للطلبات أكثر من 500 ريال
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
