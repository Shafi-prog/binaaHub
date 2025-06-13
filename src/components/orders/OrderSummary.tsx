'use client';

import { ShoppingCart, Receipt, CreditCard } from 'lucide-react';

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

interface OrderSummaryProps {
  items: OrderItem[];
  total: number;
  onCreateOrder: () => void;
  disabled?: boolean;
}

export default function OrderSummary({ items, total, onCreateOrder, disabled }: OrderSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = total * 0.15; // 15% VAT
  const grandTotal = total + tax;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
      <div className="flex items-center space-x-3 space-x-reverse mb-6">
        <ShoppingCart className="text-blue-600" size={24} />
        <h2 className="text-lg font-semibold text-gray-800">ملخص الطلب</h2>
      </div>

      {/* Order Statistics */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">عدد المنتجات:</span>
          <span className="font-medium">{items.length}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">إجمالي الكمية:</span>
          <span className="font-medium">{totalItems}</span>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">المجموع الفرعي:</span>
            <span className="font-medium">{formatPrice(total)}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">ضريبة القيمة المضافة (15%):</span>
            <span className="font-medium">{formatPrice(tax)}</span>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <span className="text-lg font-semibold text-gray-800">المجموع الكلي:</span>
            <span className="text-lg font-bold text-blue-600">{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Order Items Summary */}
      {items.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">عناصر الطلب:</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center text-sm">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-gray-800">{item.product.name}</p>
                  <p className="text-gray-500">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <span className="font-medium text-gray-800 ml-2">
                  {formatPrice(item.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">طريقة الدفع:</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-3 space-x-reverse">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              defaultChecked
              className="text-blue-600"
            />
            <span className="text-sm text-gray-700">نقداً</span>
          </label>
          <label className="flex items-center space-x-3 space-x-reverse">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              className="text-blue-600"
            />
            <CreditCard size={16} className="text-gray-500" />
            <span className="text-sm text-gray-700">بطاقة ائتمان</span>
          </label>
          <label className="flex items-center space-x-3 space-x-reverse">
            <input
              type="radio"
              name="paymentMethod"
              value="later"
              className="text-blue-600"
            />
            <span className="text-sm text-gray-700">دفع لاحق</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onCreateOrder}
          disabled={disabled}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 space-x-reverse"
        >
          <Receipt size={20} />
          <span>إنشاء الطلب</span>
        </button>
        
        {disabled && (
          <p className="text-xs text-gray-500 text-center">
            يرجى إضافة منتجات وإدخال معلومات العميل
          </p>
        )}
      </div>

      {/* Additional Options */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex flex-col space-y-2 text-sm">
          <label className="flex items-center space-x-2 space-x-reverse">
            <input type="checkbox" className="text-blue-600" />
            <span className="text-gray-700">طباعة الفاتورة</span>
          </label>
          <label className="flex items-center space-x-2 space-x-reverse">
            <input type="checkbox" className="text-blue-600" />
            <span className="text-gray-700">إرسال نسخة للعميل</span>
          </label>
          <label className="flex items-center space-x-2 space-x-reverse">
            <input type="checkbox" className="text-blue-600" />
            <span className="text-gray-700">إضافة للعملاء المفضلين</span>
          </label>
        </div>
      </div>
    </div>
  );
}
