// CRMWidget.tsx
// Open source (Ever Gauzy-inspired) CRM widget for the store dashboard
'use client';

import React, { useEffect, useState } from 'react';
import { Card, LoadingSpinner } from '@/components/ui';
import { ClientIcon } from '@/components/icons';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastPurchase: string;
  totalSpent: number;
}

export const CRMWidget: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Replace with real API call or open source logic
    async function fetchCustomers() {
      setLoading(true);
      setError(null);
      try {
        // Simulated data (replace with real fetch)
        setCustomers([
          { id: '1', name: 'أحمد علي', email: 'ahmed@email.com', phone: '0501112233', lastPurchase: '2025-06-12', totalSpent: 3500 },
          { id: '2', name: 'سارة محمد', email: 'sara@email.com', phone: '0502223344', lastPurchase: '2025-06-10', totalSpent: 2200 },
        ]);
      } catch (err) {
        setError('تعذر تحميل بيانات العملاء');
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  return (
    <Card className="mb-6">
      <div className="flex items-center mb-4">
        <ClientIcon type="ai" size={24} className="text-pink-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">إدارة العملاء (CRM)</h2>
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
                <th className="px-3 py-2 text-right">الاسم</th>
                <th className="px-3 py-2 text-right">البريد الإلكتروني</th>
                <th className="px-3 py-2 text-right">رقم الجوال</th>
                <th className="px-3 py-2 text-right">آخر عملية شراء</th>
                <th className="px-3 py-2 text-right">إجمالي الإنفاق</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b">
                  <td className="px-3 py-2">{customer.name}</td>
                  <td className="px-3 py-2">{customer.email}</td>
                  <td className="px-3 py-2">{customer.phone}</td>
                  <td className="px-3 py-2">{customer.lastPurchase}</td>
                  <td className="px-3 py-2">{customer.totalSpent.toLocaleString()} ر.س</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
