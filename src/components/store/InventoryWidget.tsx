// InventoryWidget.tsx
'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui';

interface InventoryItem {
  id: string;
  name: string;
  code: string;
  category: string;
  type: string;
  quantity: number;
  price: number;
  enabled: boolean;
}

export function InventoryWidget() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Replace with your Supabase fetch logic
    async function fetchInventory() {
      setLoading(true);
      setError(null);
      try {
        // Example: fetch from /api/inventory (replace with your endpoint)
        const res = await fetch('/api/inventory');
        if (!res.ok) throw new Error('Failed to fetch inventory');
        const data = await res.json();
        setItems(data.items || []);
      } catch (err: any) {
        setError(err.message || 'Error loading inventory');
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">إدارة المخزون</h2>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm rtl text-right">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 font-bold">الاسم</th>
                <th className="px-3 py-2 font-bold">الكود</th>
                <th className="px-3 py-2 font-bold">التصنيف</th>
                <th className="px-3 py-2 font-bold">النوع</th>
                <th className="px-3 py-2 font-bold">الكمية</th>
                <th className="px-3 py-2 font-bold">السعر</th>
                <th className="px-3 py-2 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">لا توجد منتجات في المخزون</td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-900">{item.name}</td>
                    <td className="px-3 py-2 text-gray-700">{item.code}</td>
                    <td className="px-3 py-2 text-gray-700">{item.category}</td>
                    <td className="px-3 py-2 text-gray-700">{item.type}</td>
                    <td className="px-3 py-2 text-gray-700">{item.quantity}</td>
                    <td className="px-3 py-2 text-gray-700">{item.price.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}</td>
                    <td className="px-3 py-2">
                      {item.enabled ? (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700">نشط</span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-red-100 text-red-700">غير نشط</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
