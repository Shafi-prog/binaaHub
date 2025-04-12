'use client';

import React, { useEffect, useState } from "react";
import ProfileLayout from "@/components/layouts/ProfileLayout";

export default function OrdersPage() {
  const [orders, setOrders] = useState([
    { id: 1, item: 'بلك أسود 20 سم', date: '2025-04-01', status: 'قيد التوصيل' },
    { id: 2, item: 'حديد تسليح 12مم', date: '2025-03-27', status: 'تم التوصيل' },
  ]);

  return (
    <ProfileLayout>
      <div className="bg-white p-6 rounded-lg shadow font-[Tajawal]">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">الطلبات</h1>
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border-b pb-3">
              <p><strong>المنتج:</strong> {order.item}</p>
              <p><strong>تاريخ الطلب:</strong> {order.date}</p>
              <p className="text-sm text-green-600"><strong>الحالة:</strong> {order.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </ProfileLayout>
  );
}
