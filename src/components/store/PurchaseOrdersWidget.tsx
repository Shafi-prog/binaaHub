// PurchaseOrdersWidget.tsx
// Open source (Ever Gauzy-inspired) Purchase Orders widget for the store dashboard
'use client';

import React, { useEffect, useState } from 'react';
import { Card, LoadingSpinner } from '@/components/ui';
import { ClientIcon } from '@/components/icons';

interface PurchaseOrder {
  id: string;
  supplier: string;
  date: string;
  status: string;
  total: number;
}

export const PurchaseOrdersWidget: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Replace with real API call or open source logic
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        // Simulated data (replace with real fetch)
        setOrders([
          { id: 'PO-001', supplier: 'شركة المورد الأول', date: '2025-06-10', status: 'مكتمل', total: 5000 },
          { id: 'PO-002', supplier: 'مؤسسة التوريد الحديثة', date: '2025-06-12', status: 'قيد التنفيذ', total: 3200 },
        ]);
      } catch (err) {
        setError('تعذر تحميل أوامر الشراء');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <Card className="mb-6">
      <div className="flex items-center mb-4">
        <ClientIcon type="ai" size={24} className="text-green-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">أوامر الشراء</h2>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-right">رقم الأمر</th>
                <th className="px-3 py-2 text-right">المورد</th>
                <th className="px-3 py-2 text-right">التاريخ</th>
                <th className="px-3 py-2 text-right">الحالة</th>
                <th className="px-3 py-2 text-right">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-3 py-2">{order.id}</td>
                  <td className="px-3 py-2">{order.supplier}</td>
                  <td className="px-3 py-2">{order.date}</td>
                  <td className="px-3 py-2">{order.status}</td>
                  <td className="px-3 py-2">{order.total.toLocaleString()} ر.س</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
