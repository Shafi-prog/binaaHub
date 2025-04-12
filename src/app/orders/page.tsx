'use client';

import ProfileLayout from '@/components/layouts/ProfileLayout';
import { getMockOrdersByUser } from '@/mock/orders';

type Order = {
  id: number;
  item: string;
  date: string;
};

export default function OrdersPage() {
  const user = { id: 'mock-user-id', name: 'أحمد' };
  const orders: Order[] = getMockOrdersByUser(user.id);

  return (
    <ProfileLayout>
      <div className="bg-white p-6 rounded-lg shadow font-[Tajawal] space-y-10">
        <section>
          <h1 className="text-2xl font-bold text-blue-700 mb-4">الطلبات</h1>
          <ul className="space-y-4">
            {orders.map((order: Order) => (
              <li key={order.id} className="border-b pb-3">
                <p><strong>المنتج:</strong> {order.item}</p>
                <p><strong>تاريخ الطلب:</strong> {order.date}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ProfileLayout>
  );
}
