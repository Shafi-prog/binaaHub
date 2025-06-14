// SupplierManagementWidget.tsx
// Open source (Ever Gauzy-inspired) Supplier Management widget for the store dashboard
'use client';

import React, { useEffect, useState } from 'react';
import { Card, LoadingSpinner } from '@/components/ui';
import { ClientIcon } from '@/components/icons';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  totalPurchases: number;
}

export const SupplierManagementWidget: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Replace with real API call or open source logic
    async function fetchSuppliers() {
      setLoading(true);
      setError(null);
      try {
        // Simulated data (replace with real fetch)
        setSuppliers([
          { id: '1', name: 'شركة المورد الأول', contact: '0501234567', email: 'supplier1@email.com', totalPurchases: 12000 },
          { id: '2', name: 'مؤسسة التوريد الحديثة', contact: '0509876543', email: 'supplier2@email.com', totalPurchases: 8000 },
        ]);
      } catch (err) {
        setError('تعذر تحميل بيانات الموردين');
      } finally {
        setLoading(false);
      }
    }
    fetchSuppliers();
  }, []);

  return (
    <Card className="mb-6">
      <div className="flex items-center mb-4">
        <ClientIcon type="ai" size={24} className="text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">إدارة الموردين</h2>
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
                <th className="px-3 py-2 text-right">رقم التواصل</th>
                <th className="px-3 py-2 text-right">البريد الإلكتروني</th>
                <th className="px-3 py-2 text-right">إجمالي المشتريات</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b">
                  <td className="px-3 py-2">{supplier.name}</td>
                  <td className="px-3 py-2">{supplier.contact}</td>
                  <td className="px-3 py-2">{supplier.email}</td>
                  <td className="px-3 py-2">{supplier.totalPurchases.toLocaleString()} ر.س</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
