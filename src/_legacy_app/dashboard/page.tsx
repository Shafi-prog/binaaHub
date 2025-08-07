"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { 
  Bot, 
  Calendar, 
  Building2, 
  Users, 
  ArrowRight,
  User,
  Store
} from 'lucide-react';

export const dynamic = 'force-dynamic'

const userTypes = [
  {
    type: 'user',
    title: 'عميل/مستخدم',
    description: 'أريد بناء منزل أو البحث عن خدمات البناء',
    href: '/user/dashboard',
    icon: <User className="w-8 h-8" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    type: 'provider',
    title: 'مقدم خدمة',
    description: 'أقدم خدمات البناء (مقاول، مورد، معدات)',
    href: '/auth/login',
    icon: <Users className="w-8 h-8" />,
    color: 'from-green-500 to-green-600'
  },
  {
    type: 'store',
    title: 'متجر مواد البناء',
    description: 'أدير متجر لبيع مواد ومنتجات البناء',
    href: '/store/dashboard',
    icon: <Store className="w-8 h-8" />,
    color: 'from-purple-500 to-purple-600'
  }
];

const quickFeatures = [
  {
    title: 'المساعد الذكي',
    href: '/ai-assistant',
    icon: <Bot className="w-6 h-6" />,
    description: 'إجابات فورية لجميع أسئلة البناء'
  },
  {
    title: 'حجز الخدمات',
    href: '/dashboard/bookings',
    icon: <Calendar className="w-6 h-6" />,
    description: 'تقويم موحد لحجز جميع خدمات البناء'
  },
  {
    title: 'تسجيل مقدم خدمة',
    href: '/auth/signup',
    icon: <Building2 className="w-6 h-6" />,
    description: 'انضم كمقدم خدمة في منصة بِنّا'
  }
];

export default function DashboardHomePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalOrders: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch real dashboard statistics from Supabase
        const { data: users } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact' });

        const { data: projects } = await supabase
          .from('construction_projects')
          .select('*', { count: 'exact' });

        const { data: orders } = await supabase
          .from('orders')
          .select('*', { count: 'exact' });

        setDashboardStats({
          totalUsers: users?.length || 0,
          totalProjects: projects?.length || 0,
          totalOrders: orders?.length || 0
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20" dir="rtl">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Typography variant="heading" size="3xl" weight="bold" className="text-gray-800 mb-4">
            مرحباً بك في منصة بِنّا 🏗️
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-600 mb-6">
            اختر نوع حسابك للوصول للوحة التحكم المناسبة
          </Typography>
        </div>

        {/* User Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {userTypes.map((userType, index) => (
            <Link key={index} href={userType.href}>
              <EnhancedCard
                variant="elevated"
                hover
                className="cursor-pointer transition-all duration-300 hover:scale-105 h-full"
              >
                <div className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${userType.color} text-white mb-4`}>
                    {userType.icon}
                  </div>
                  <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-2">
                    {userType.title}
                  </Typography>
                  <Typography variant="body" size="sm" className="text-gray-600 mb-4">
                    {userType.description}
                  </Typography>
                  <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                    دخول لوحة التحكم
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </EnhancedCard>
            </Link>
          ))}
        </div>

        {/* Quick Access to New Features */}
        <EnhancedCard variant="elevated" className="mb-8 bg-white/80 backdrop-blur-sm">
          <div className="p-6">
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-4">
              الميزات الجديدة - جرب الآن! 🚀
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickFeatures.map((feature, index) => (
                <Link key={index} href={feature.href}>
                  <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <Typography variant="body" size="md" weight="medium" className="text-gray-800 mb-1">
                        {feature.title}
                      </Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">
                        {feature.description}
                      </Typography>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </EnhancedCard>

        {/* Additional Info */}
        <div className="text-center">
          <Typography variant="body" size="sm" className="text-gray-600 mb-4">
            أو تصفح جميع الميزات الجديدة
          </Typography>
          <Link href="/features">
            <Button variant="outline">
              عرض جميع الميزات
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
