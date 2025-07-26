"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Simple UI Components
const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const itemCount = searchParams?.get('items') || '0';
  const storeId = searchParams?.get('store');
  
  const [checkoutOption, setCheckoutOption] = useState<'choice' | 'guest' | 'login'>('choice');
  const [guestForm, setGuestForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: ''
  });

  const handleGuestCheckout = () => {
    // Validate form
    if (!guestForm.name || !guestForm.phone || !guestForm.address) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Here you would normally:
    // 1. Get cart items from localStorage
    // 2. Send order to backend
    // 3. Clear cart
    // 4. Show success message

    alert('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.');
    
    // Clear cart from localStorage
    localStorage.removeItem('cart');
    
    // Redirect to success page or home
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">إتمام الطلب</h1>
          <p className="text-gray-600">
            لديك {itemCount} منتج في السلة
            {storeId && ` من المتجر`}
          </p>
          
          {/* Back Link */}
          <div className="mt-4">
            <Link 
              href={storeId ? `/storefront/${storeId}` : '/storefront'} 
              className="text-blue-500 hover:text-blue-600"
            >
              ← العودة للتسوق
            </Link>
          </div>
        </div>

        {/* Checkout Options */}
        {checkoutOption === 'choice' && (
          <div className="space-y-6">
            <Card className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">اختر طريقة المتابعة</h2>
              <p className="text-gray-600 mb-6">يمكنك إتمام الطلب كضيف أو تسجيل الدخول للحصول على مزايا إضافية</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guest Checkout */}
                <Card className="p-6 border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer"
                      onClick={() => setCheckoutOption('guest')}>
                  <div className="text-4xl mb-3">🛒</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">إتمام كضيف</h3>
                  <p className="text-sm text-gray-600 mb-4">سريع وبسيط، فقط املأ بياناتك الأساسية</p>
                  <ul className="text-xs text-gray-500 text-right space-y-1">
                    <li>• لا يحتاج تسجيل حساب</li>
                    <li>• إتمام سريع</li>
                    <li>• تأكيد عبر الهاتف</li>
                  </ul>
                  <button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors">
                    متابعة كضيف
                  </button>
                </Card>

                {/* Login Option */}
                <Card className="p-6 border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => setCheckoutOption('login')}>
                  <div className="text-4xl mb-3">👤</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">تسجيل الدخول</h3>
                  <p className="text-sm text-gray-600 mb-4">سجل دخول أو أنشئ حساب للحصول على مزايا إضافية</p>
                  <ul className="text-xs text-gray-500 text-right space-y-1">
                    <li>• حفظ تاريخ الطلبات</li>
                    <li>• عناوين محفوظة</li>
                    <li>• نقاط ولاء</li>
                    <li>• متابعة الطلبات</li>
                  </ul>
                  <Link 
                    href={`/login?redirect=/checkout${storeId ? `?store=${storeId}` : ''}&items=${itemCount}`}
                    className="block w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-center"
                  >
                    تسجيل الدخول
                  </Link>
                </Card>
              </div>
            </Card>
          </div>
        )}

        {/* Guest Checkout Form */}
        {checkoutOption === 'guest' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">بيانات الطلب</h2>
              <button 
                onClick={() => setCheckoutOption('choice')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← العودة
              </button>
            </div>

            <form className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  required
                  value={guestForm.name}
                  onChange={(e) => setGuestForm({...guestForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  required
                  value={guestForm.phone}
                  onChange={(e) => setGuestForm({...guestForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="05xxxxxxxx"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  type="email"
                  value={guestForm.email}
                  onChange={(e) => setGuestForm({...guestForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="example@email.com"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المدينة *
                </label>
                <select
                  required
                  value={guestForm.city}
                  onChange={(e) => setGuestForm({...guestForm, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">اختر المدينة</option>
                  <option value="riyadh">الرياض</option>
                  <option value="jeddah">جدة</option>
                  <option value="dammam">الدمام</option>
                  <option value="khobar">الخبر</option>
                  <option value="mecca">مكة المكرمة</option>
                  <option value="medina">المدينة المنورة</option>
                  <option value="taif">الطائف</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان التفصيلي *
                </label>
                <textarea
                  required
                  value={guestForm.address}
                  onChange={(e) => setGuestForm({...guestForm, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={3}
                  placeholder="الحي، الشارع، رقم المبنى..."
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ملاحظات إضافية
                </label>
                <textarea
                  value={guestForm.notes}
                  onChange={(e) => setGuestForm({...guestForm, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={2}
                  placeholder="أي ملاحظات خاصة بالطلب..."
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleGuestCheckout}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  تأكيد الطلب
                </button>
              </div>
            </form>

            {/* Notes */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">ماذا بعد تأكيد الطلب؟</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب</li>
                <li>• سيتم تحديد موعد التوصيل حسب المنطقة</li>
                <li>• يمكن الدفع عند الاستلام أو التحويل البنكي</li>
                <li>• ستحصل على رقم متابعة للطلب</li>
              </ul>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
