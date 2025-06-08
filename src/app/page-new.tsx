'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Force dynamic rendering to prevent prerender issues
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Feature = {
  title: string;
  description: string;
  icon: string;
};

type Features = {
  user: Feature[];
  store: Feature[];
};

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState<'user' | 'store'>('user');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const features: Features = {
    user: [
      {
        title: "إدارة المشاريع",
        description: "تتبع وإدارة مشاريع البناء الخاصة بك بسهولة",
        icon: "🏗️"
      },
      {
        title: "طلب المواد",
        description: "اطلب مواد البناء من المتاجر المحلية",
        icon: "📦"
      },
      {
        title: "الإشراف المهني",
        description: "احصل على إشراف من خبراء البناء",
        icon: "👷"
      }
    ],
    store: [
      {
        title: "عرض المنتجات",
        description: "اعرض منتجاتك لعملاء البناء",
        icon: "🏪"
      },
      {
        title: "إدارة الطلبات",
        description: "تتبع وإدارة طلبات العملاء",
        icon: "📋"
      },
      {
        title: "تحليل المبيعات",
        description: "احصل على تقارير وتحليلات المبيعات",
        icon: "📊"
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">جاري التحميل...</h2>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            منصة بناء الشاملة
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            حلول متكاملة لإدارة مشاريع البناء، طلب المواد، والحصول على الإشراف المهني
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                ابدأ الآن
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
                تسجيل الدخول
              </button>
            </Link>
          </div>

          {/* Feature Toggle */}
          <div className="flex justify-center mb-16">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <button
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  activeFeature === 'user'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveFeature('user')}
              >
                للمستخدمين
              </button>
              <button
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  activeFeature === 'store'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveFeature('store')}
              >
                للمتاجر
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features[activeFeature].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 group shadow-lg"
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ابدأ رحلتك في البناء اليوم
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            انضم إلى آلاف المستخدمين الذين يثقون في منصتنا لإدارة مشاريعهم
          </p>
          <Link href="/signup">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              سجل مجاناً الآن
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
