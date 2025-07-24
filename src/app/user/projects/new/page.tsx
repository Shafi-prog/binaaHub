'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { useRouter } from 'next/navigation';
import { Calendar, BarChart3, Users, FileText, Settings, Bookmark, Store } from 'lucide-react';

export default function ConstructionMainScreen() {
  const router = useRouter();

  const mainIcons = [
    { 
      title: 'مشاريعي', 
      icon: <Calendar className="w-8 h-8" />, 
      href: '/user/projects/list',
      description: 'إدارة مشاريع البناء الخاصة بك'
    },
    { 
      title: 'حاسبة التكاليف', 
      icon: <BarChart3 className="w-8 h-8" />, 
      href: '/user/projects/calculator',
      description: 'تقدير تكاليف مشاريع البناء'
    },
    { 
      title: 'الإعدادات', 
      icon: <Settings className="w-8 h-8" />, 
      href: '/user/projects/settings',
      description: 'إعدادات التطبيق والملف الشخصي'
    },
    { 
      title: 'ترقية الاشتراك', 
      icon: <Store className="w-8 h-8" />, 
      href: '/user/projects/subscription',
      description: 'ترقية حسابك للمزيد من المميزات'
    },
    { 
      title: 'المذكرة', 
      icon: <Bookmark className="w-8 h-8" />, 
      href: '/user/projects/notebook',
      description: 'ملاحظات ومذكرات المشروع'
    },
    { 
      title: 'دليل الموردين', 
      icon: <Users className="w-8 h-8" />, 
      href: '/user/projects/suppliers',
      description: 'دليل الموردين والمقاولين'
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <Typography variant="heading" size="3xl" weight="bold" className="text-gray-800 mb-3">
            منصة إدارة مشاريع البناء
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-600 mb-6">
            مركز إدارة شامل لجميع احتياجات مشاريع البناء الخاصة بك
          </Typography>
          
          {/* Quick Action Button */}
          <Button
            variant="filled"
            size="lg"
            onClick={() => router.push('/user/projects/create')}
            className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 text-lg"
          >
            <Calendar className="w-5 h-5 ml-2" />
            إنشاء مشروع جديد
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {mainIcons.map((item, index) => (
            <EnhancedCard
              key={index}
              variant="elevated"
              hover
              className="p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group cursor-pointer"
              onClick={() => router.push(item.href)}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <div className="text-blue-600">{item.icon}</div>
              </div>
              <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-2">
                {item.title}
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                {item.description}
              </Typography>
            </EnhancedCard>
          ))}
        </div>
      </div>
    </main>
  );
}
