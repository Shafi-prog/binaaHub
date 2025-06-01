'use client';

// Force dynamic rendering to prevent prerender issues
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
  const supabase = createClientComponentClient();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Just update loading state, no automatic redirect
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const features: Features = {
    user: [
      { title: 'إدارة المشاريع', description: 'تتبع وإدارة مشاريع البناء بسهولة', icon: '🏗️' },
      { title: 'تتبع المصروفات', description: 'متابعة وتحليل مصروفات المشاريع', icon: '💰' },
      { title: 'ضمانات المنتجات', description: 'إدارة ضمانات مواد البناء', icon: '🛡️' },
      { title: 'خدمات البناء', description: 'خدمات التصميم والإشراف والتنفيذ', icon: '🏢' },
    ],
    store: [
      { title: 'إدارة المتجر', description: 'إدارة منتجات وطلبات متجرك بكفاءة', icon: '🏪' },
      { title: 'التحليلات والمبيعات', description: 'تحليلات متقدمة لأداء المتجر', icon: '📊' },
      { title: 'إدارة العملاء', description: 'التواصل وإدارة علاقات العملاء', icon: '👥' },
      { title: 'التسويق الذكي', description: 'أدوات تسويقية فعالة لنمو مبيعاتك', icon: '🎯' },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-50 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-gray-900 mb-6"
          >
            منصة <span className="text-blue-600">بناء</span> المتكاملة
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 mb-8"
          >
            نظام متكامل لإدارة مشاريع البناء والمتاجر المتخصصة
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center gap-4"
          >
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ابدأ الآن مجاناً
            </Link>
            <Link
              href="/login"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              تسجيل الدخول
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex rounded-lg bg-gray-100 p-1 mb-8">
            <button
              onClick={() => setActiveFeature('user')}
              className={`px-6 py-2 rounded-md ${
                activeFeature === 'user'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              خدمات المستخدمين
            </button>
            <button
              onClick={() => setActiveFeature('store')}
              className={`px-6 py-2 rounded-md ${
                activeFeature === 'store'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              خدمات المتاجر
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features[activeFeature].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">ابدأ رحلتك مع منصة بناء اليوم</h2>
          <p className="text-lg text-blue-100 mb-8">
            انضم إلى آلاف المستخدمين والمتاجر الناجحة في عالم البناء والتشييد
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            سجل حسابك مجاناً
          </Link>
        </div>
      </div>
    </main>
  );
}
