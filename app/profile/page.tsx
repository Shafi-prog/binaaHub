'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileLayout from "@/components/layouts/ProfileLayout";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/login');
    }
  }, []);

  const orders = [
    { id: 1, item: 'بلك أسود 20 سم', date: '2025-04-01', status: 'قيد التوصيل' },
    { id: 2, item: 'حديد تسليح 12مم', date: '2025-03-27', status: 'تم التوصيل' },
  ];

  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div id="account" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">بيانات الحساب</h2>
          {user && (
            <>
              <p><strong>الاسم:</strong> {user.name}</p>
              <p><strong>البريد:</strong> {user.email}</p>
              <p><strong>موقع المنزل:</strong> الرياض - حي النرجس</p>
            </>
          )}
        </div>

        <div id="orders" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">طلباتي</h2>
          <ul className="space-y-2">
            {orders.map(order => (
              <li key={order.id} className="border-b pb-2">
                <p><strong>{order.item}</strong> - <span className="text-sm text-gray-500">{order.date}</span></p>
                <p className="text-sm text-green-600">{order.status}</p>
              </li>
            ))}
          </ul>
        </div>

        <div id="warranty" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">ضماناتي</h2>
          <ul className="space-y-4">
            {[{
              id: 1,
              item: 'سخان كهربائي',
              store: 'متجر الأجهزة المتميزة',
              purchaseDate: '2023-03-20',
              warrantyYears: 2,
              warrantyFile: '/warranty/sample.pdf',
            },
            {
              id: 2,
              item: 'مكيف سبيلت',
              store: 'مكيفات الخليج',
              purchaseDate: '2022-04-05',
              warrantyYears: 1,
              warrantyFile: '/warranty/ac.pdf',
            }].map(warranty => {
              const endDate = new Date(
                new Date(warranty.purchaseDate).setFullYear(
                  new Date(warranty.purchaseDate).getFullYear() + warranty.warrantyYears
                )
              );
              const today = new Date();
              const isActive = endDate > today;

              return (
                <li key={warranty.id} className="border-b pb-3">
                  <p><strong>المنتج:</strong> {warranty.item}</p>
                  <p><strong>المتجر:</strong> {warranty.store}</p>
                  <p><strong>تاريخ الشراء:</strong> {warranty.purchaseDate}</p>
                  <p><strong>مدة الضمان:</strong> {warranty.warrantyYears} سنوات</p>
                  <p>
                    <strong>تاريخ الانتهاء:</strong> {endDate.toLocaleDateString('ar-EG')}{' '}
                    <span className={isActive ? 'text-green-600' : 'text-red-600'}>
                      ({isActive ? 'ساري ✅' : 'منتهي ❌'})
                    </span>
                  </p>
                  <a
                    href={warranty.warrantyFile}
                    className="text-blue-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    تحميل الضمان
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div id="projects" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">مشاريعي</h2>
          <p className="text-gray-500">لا توجد مشاريع حالياً.</p>
        </div>

        <div id="notifications" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">الإشعارات</h2>
          <p className="text-gray-500">لا توجد إشعارات جديدة.</p>
        </div>
      </div>
    </ProfileLayout>
  );
}
