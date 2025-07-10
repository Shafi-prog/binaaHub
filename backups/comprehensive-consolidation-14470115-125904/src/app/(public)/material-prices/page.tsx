// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/domains/shared/components/ui';
import { MapPin, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


interface PriceData {
  city: string;
  price: number;
  change: number;
  lastUpdated: string;
}

const cities = [
  { name: 'الرياض', lat: 24.7136, lng: 46.6753 },
  { name: 'جدة', lat: 21.4858, lng: 39.1925 },
  { name: 'الدمام', lat: 26.3927, lng: 50.1095 },
  { name: 'مكة المكرمة', lat: 21.3891, lng: 39.8579 },
  { name: 'الطائف', lat: 21.2887, lng: 40.4195 },
  { name: 'المدينة المنورة', lat: 24.5247, lng: 39.5692 },
];

export default function MaterialPricesPage() {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - replace with actual API call
    const fetchPriceData = async () => {
      // Simulated API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData: PriceData[] = cities.map((city) => ({
        city: city.name,
        price: Math.round(2800 + Math.random() * 400), // Random price between 2800-3200
        change: Math.round((Math.random() * 10 - 5) * 10) / 10, // Random change between -5 and +5
        lastUpdated: new Date().toLocaleDateString('ar-SA'),
      }));

      setPriceData(mockData);
      setLoading(false);
    };

    fetchPriceData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">أسعار مواد البناء</h1>
          <p className="text-gray-600 mt-2">متابعة أسعار الحديد في المدن الرئيسية</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg p-6 h-40"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {priceData.map((data) => (
              <Card
                key={data.city}
                className="relative overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="absolute top-0 right-0 w-16 h-16">
                  <div
                    className={`transform rotate-45 translate-x-6 -translate-y-6 ${
                      data.change > 0 ? 'bg-red-500' : 'bg-green-500'
                    } text-white py-1 px-8`}
                  ></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                      <h3 className="text-xl font-semibold text-gray-800">{data.city}</h3>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {data.price.toLocaleString()}
                        <span className="text-sm font-normal text-gray-500 mr-1">ر.س/طن</span>
                      </p>
                    </div>
                    <div
                      className={`flex items-center ${
                        data.change > 0 ? 'text-red-500' : 'text-green-500'
                      }`}
                    >
                      {data.change > 0 ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                      <span className="text-sm font-medium mr-1">{Math.abs(data.change)}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>آخر تحديث: {data.lastUpdated}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">ملاحظات هامة</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>الأسعار تقديرية وقابلة للتغيير حسب الكمية والمواصفات</li>
              <li>يتم تحديث الأسعار بشكل يومي</li>
              <li>الأسعار لا تشمل قيمة النقل والتوصيل</li>
              <li>الأسعار تخضع لتغيرات السوق العالمية</li>
            </ul>
          </Card>
        </div>
      </div>
    </main>
  );
}


