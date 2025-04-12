'use client';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ProfileLayout from '@/components/layouts/ProfileLayout';

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const orders = [
    { id: 1, userId: user.id, item: 'بلك أسود 20 سم', date: '2025-04-01', status: 'قيد التوصيل' },
    { id: 2, userId: user.id, item: 'حديد تسليح 12مم', date: '2025-03-27', status: 'تم التوصيل' },
  ];

  const warranties = [
    {
      id: 1,
      userId: user.id,
      item: 'سخان كهربائي',
      store: 'متجر الأجهزة المتميزة',
      purchaseDate: '2023-03-20',
      warrantyYears: 2,
      warrantyFile: '/warranty/sample.pdf',
    },
    {
      id: 2,
      userId: user.id,
      item: 'مكيف سبيلت',
      store: 'مكيفات الخليج',
      purchaseDate: '2022-04-05',
      warrantyYears: 1,
      warrantyFile: '/warranty/ac.pdf',
    },
  ];

  const projects = [
    {
      id: 1,
      userId: user.id,
      name: 'مشروع فيلا شمال الرياض',
      location: 'حي الياسمين',
      status: 'قيد التنفيذ',
      startDate: '2024-01-15',
    },
  ];

  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div id="account" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">بيانات الحساب</h2>
          <p><strong>البريد:</strong> {user.email}</p>
          <p><strong>موقع المنزل:</strong> الرياض - حي النرجس</p>
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
          <Link href="/orders" className="text-blue-600 text-sm underline mt-2 inline-block">عرض كل الطلبات</Link>
        </div>

        <div id="warranty" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">ضماناتي</h2>
          <ul className="space-y-4">
            {warranties.map(warranty => {
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
          {projects.length ? (
            <ul className="space-y-2">
              {projects.map(project => (
                <li key={project.id} className="border-b pb-2">
                  <p><strong>{project.name}</strong></p>
                  <p>الموقع: {project.location}</p>
                  <p>الحالة: {project.status}</p>
                  <p>تاريخ البدء: {project.startDate}</p>
                  <Link href={`/projects/${project.id}`} className="text-sm text-blue-600 underline">
                    عرض التفاصيل
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">لا توجد مشاريع حالياً.</p>
          )}
        </div>

        <div id="notifications" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">الإشعارات</h2>
          <p className="text-gray-500">لا توجد إشعارات جديدة.</p>
        </div>
      </div>
    </ProfileLayout>
  );
}
