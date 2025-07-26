"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { Building2, Truck, Wrench, Trash2, Users, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic'

const providerTypes = [
  {
    id: 'concrete-supplier',
    title: 'مورد الخرسانة',
    description: 'إدارة طلبات الخرسانة والإنتاج والتوريد',
    icon: <Building2 className="w-8 h-8" />,
    color: 'from-blue-500 to-blue-600',
    dashboard: '/dashboard/concrete-supplier'
  },
  {
    id: 'equipment-rental',
    title: 'تأجير المعدات',
    description: 'إدارة أسطول المعدات والحجوزات',
    icon: <Wrench className="w-8 h-8" />,
    color: 'from-orange-500 to-orange-600',
    dashboard: '/dashboard/equipment-rental'
  },
  {
    id: 'waste-management',
    title: 'إدارة المخلفات',
    description: 'خدمات جمع ونقل مخلفات البناء',
    icon: <Trash2 className="w-8 h-8" />,
    color: 'from-green-500 to-green-600',
    dashboard: '/dashboard/waste-management'
  },
  {
    id: 'contractor',
    title: 'مقاول',
    description: 'إدارة المشاريع والعمالة والمقاولات',
    icon: <Users className="w-8 h-8" />,
    color: 'from-purple-500 to-purple-600',
    dashboard: '/dashboard/contractor'
  }
];

export default function ProviderLoginPage() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const router = useRouter();

  const handleProviderSelect = (provider: any) => {
    setSelectedProvider(provider.id);
    // Simulate login and redirect to provider dashboard
    setTimeout(() => {
      router.push(provider.dashboard);
    }, 500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20" dir="rtl">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Typography variant="heading" size="3xl" weight="bold" className="text-gray-800 mb-4">
            دخول مقدمي الخدمات 🏗️
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-600 mb-6">
            اختر نوع خدمتك للوصول لوحة التحكم المخصصة
          </Typography>
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            ليس لديك حساب؟ سجل كمقدم خدمة ←
          </Link>
        </div>

        {/* Provider Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {providerTypes.map((provider) => (
            <EnhancedCard
              key={provider.id}
              variant="elevated"
              hover
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedProvider === provider.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleProviderSelect(provider)}
            >
              <div className="text-center p-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${provider.color} text-white mb-4`}>
                  {provider.icon}
                </div>
                <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-2">
                  {provider.title}
                </Typography>
                <Typography variant="body" size="sm" className="text-gray-600 mb-4">
                  {provider.description}
                </Typography>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700"
                  disabled={selectedProvider === provider.id}
                >
                  {selectedProvider === provider.id ? 'جاري التحويل...' : 'دخول لوحة التحكم'}
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </EnhancedCard>
          ))}
        </div>

        {/* Login Form Alternative */}
        <EnhancedCard variant="elevated" className="max-w-md mx-auto">
          <div className="p-6">
            <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-4 text-center">
              أو ادخل ببيانات حسابك
            </Typography>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="provider@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <Button className="w-full">
                تسجيل الدخول
              </Button>
            </form>
          </div>
        </EnhancedCard>

        {/* Quick Links */}
        <div className="text-center mt-8">
          <Typography variant="body" size="sm" className="text-gray-600 mb-4">
            روابط سريعة
          </Typography>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/dashboard/bookings" className="text-blue-600 hover:text-blue-700 text-sm">
              عرض الطلبات الواردة
            </Link>
            <Link href="/ai-assistant" className="text-blue-600 hover:text-blue-700 text-sm">
              المساعد الذكي
            </Link>
            <Link href="/construction-journey" className="text-blue-600 hover:text-blue-700 text-sm">
              رحلة البناء
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
