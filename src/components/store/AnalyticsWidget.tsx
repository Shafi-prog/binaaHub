// AnalyticsWidget.tsx
// Open source (Ever Gauzy-inspired) Analytics widget for the store dashboard
'use client';

import React, { useEffect, useState } from 'react';
import { Card, LoadingSpinner } from '@/components/ui';
import { ClientIcon } from '@/components/icons';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  date: string;
  sales: number;
  purchases: number;
}

export const AnalyticsWidget: React.FC = () => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Replace with real API call or open source logic
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      try {
        // Simulated data (replace with real fetch)
        setData([
          { date: '2025-06-01', sales: 1200, purchases: 800 },
          { date: '2025-06-02', sales: 1500, purchases: 900 },
          { date: '2025-06-03', sales: 1100, purchases: 700 },
          { date: '2025-06-04', sales: 1800, purchases: 1200 },
          { date: '2025-06-05', sales: 2000, purchases: 1500 },
        ]);
      } catch (err) {
        setError('تعذر تحميل بيانات التحليلات');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <Card className="mb-6">
      <div className="flex items-center mb-4">
        <ClientIcon type="chart" size={24} className="text-purple-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">تحليلات المتجر</h2>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} name="المبيعات" />
            <Line type="monotone" dataKey="purchases" stroke="#10b981" strokeWidth={2} name="المشتريات" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};
