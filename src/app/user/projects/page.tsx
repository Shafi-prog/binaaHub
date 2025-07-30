'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Package,
  Users,
  Settings,
  BookOpen,
  Calculator,
  Plus
} from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const { user, session, isLoading, error } = useAuth();

  // Project navigation cards
  const projectCards = [
    {
      title: 'مشاريعي',
      description: 'عرض وإدارة جميع مشاريعك',
      icon: Package,
      href: '/user/projects/list',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'الموردين',
      description: 'إدارة الموردين والمقاولين',
      icon: Users,
      href: '/user/projects/suppliers',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: 'الإعدادات',
      description: 'إعدادات المشاريع والتفضيلات',
      icon: Settings,
      href: '/user/settings',
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600'
    },
    {
      title: 'المذكرة',
      description: 'ملاحظاتك ومذكراتك الشخصية',
      icon: BookOpen,
      href: '/user/projects/notebook',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'حاسبة التكلفة',
      description: 'احسب تكلفة مشروعك',
      icon: Calculator,
      href: '/user/comprehensive-construction-calculator',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      title: 'مشروع جديد',
      description: 'إنشاء مشروع جديد',
      icon: Plus,
      href: '/user/projects/create',
      color: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600'
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div>
            <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800">
              المشاريع
            </Typography>
            <Typography variant="body" className="text-gray-600">
              مركز إدارة المشاريع والبناء
            </Typography>
          </div>
        </div>

        {/* Projects Navigation Cards */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectCards.map((card, index) => {
              const IconComponent = card.icon;
              
              return (
                <Link key={index} href={card.href}>
                  <EnhancedCard 
                    variant="elevated" 
                    className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-200"
                  >
                    <div className="text-center space-y-4">
                      <div className={`w-16 h-16 ${card.color} ${card.hoverColor} rounded-full flex items-center justify-center mx-auto transition-colors duration-300 group-hover:scale-110 transform`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <div>
                        <Typography 
                          variant="subheading" 
                          size="lg" 
                          weight="semibold" 
                          className="text-gray-800 mb-2 group-hover:text-blue-600 transition-colors"
                        >
                          {card.title}
                        </Typography>
                        <Typography 
                          variant="body" 
                          size="sm" 
                          className="text-gray-600 group-hover:text-gray-700 transition-colors"
                        >
                          {card.description}
                        </Typography>
                      </div>
                    </div>
                  </EnhancedCard>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <EnhancedCard variant="elevated" className="p-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-4">
              مرحباً بك في مركز المشاريع
            </Typography>
            <Typography variant="body" className="text-gray-600 mb-6 max-w-2xl mx-auto">
              من هنا يمكنك إدارة جميع مشاريعك، التواصل مع الموردين، تتبع التكاليف، وإدارة جميع جوانب مشاريع البناء بسهولة ومرونة.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/user/projects/create">
                <Button variant="filled" size="lg" className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  إنشاء مشروع جديد
                </Button>
              </Link>
              <Link href="/user/projects/list">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  عرض المشاريع الحالية
                </Button>
              </Link>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </main>
  );
}
