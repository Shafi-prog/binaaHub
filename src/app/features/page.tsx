"use client"

import React from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard } from '@/core/shared/components/ui/enhanced-components';
import { 
  Bot, 
  Calendar, 
  Building2, 
  Users, 
  Truck, 
  Wrench, 
  UserPlus,
  ArrowRight,
  Sparkles,
  MapPin,
  Calculator
} from 'lucide-react';

export const dynamic = 'force-dynamic'

const features = [
  {
    title: 'المساعد الذكي المتقدم',
    description: 'مساعد ذكي متطور لإجابة جميع أسئلة البناء مع تقديرات التكلفة والتخطيط',
    href: '/ai-assistant',
    icon: <Bot className="w-8 h-8" />,
    color: 'from-purple-500 to-purple-600',
    featured: true
  },
  {
    title: 'نظام الحجز الموحد',
    description: 'تقويم شامل لحجز جميع خدمات البناء من مكان واحد',
    href: '/dashboard/bookings',
    icon: <Calendar className="w-8 h-8" />,
    color: 'from-blue-500 to-blue-600',
    featured: true
  },
  {
    title: 'تسجيل مقدمي الخدمات',
    description: 'نظام متكامل لتسجيل جميع أنواع مقدمي الخدمات في البناء',
    href: '/register',
    icon: <UserPlus className="w-8 h-8" />,
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'لوحة موردي الخرسانة',
    description: 'لوحة تحكم متخصصة لإدارة طلبات وإنتاج الخرسانة',
    href: '/dashboard/concrete-supplier',
    icon: <Building2 className="w-8 h-8" />,
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'دخول مقدمي الخدمات',
    description: 'وصول سريع لجميع مقدمي الخدمات للوحات التحكم الخاصة بهم',
    href: '/provider/login',
    icon: <Users className="w-8 h-8" />,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    title: 'التوصيات الذكية',
    description: 'نظام توصيات مدعوم بالذكاء الاصطناعي لاختيار أفضل مقدمي الخدمات',
    href: '/user/dashboard',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'from-pink-500 to-pink-600'
  }
];

const quickAccess = [
  { title: 'رحلة البناء', href: '/construction-journey', icon: <MapPin className="w-5 h-5" /> },
  { title: 'حاسبة التكاليف', href: '/user/comprehensive-construction-calculator', icon: <Calculator className="w-5 h-5" /> },
  { title: 'المشاريع', href: '/projects', icon: <Building2 className="w-5 h-5" /> },
  { title: 'المتاجر', href: '/stores', icon: <Truck className="w-5 h-5" /> }
];

export default function FeaturesHubPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20" dir="rtl">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Typography variant="heading" size="3xl" weight="bold" className="text-gray-800 mb-4">
            مركز ميزات بِنّا المتقدمة 🚀
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-600 mb-6">
            اكتشف جميع الميزات الجديدة المدعومة بالذكاء الاصطناعي
          </Typography>
        </div>

        {/* Featured Features */}
        <div className="mb-12">
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-6">
            الميزات المميزة ⭐
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {features.filter(f => f.featured).map((feature, index) => (
              <Link key={index} href={feature.href}>
                <EnhancedCard
                  variant="elevated"
                  hover
                  className="cursor-pointer transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} text-white flex items-center justify-center`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-2">
                          {feature.title}
                        </Typography>
                        <Typography variant="body" size="sm" className="text-gray-600 mb-4">
                          {feature.description}
                        </Typography>
                        <div className="flex items-center text-blue-600 hover:text-blue-700">
                          <span className="text-sm font-medium">اكتشف الآن</span>
                          <ArrowRight className="w-4 h-4 mr-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </EnhancedCard>
              </Link>
            ))}
          </div>
        </div>

        {/* All Features */}
        <div className="mb-12">
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-6">
            جميع الميزات الجديدة 🔧
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.filter(f => !f.featured).map((feature, index) => (
              <Link key={index} href={feature.href}>
                <EnhancedCard
                  variant="elevated"
                  hover
                  className="cursor-pointer transition-all duration-300 hover:scale-105 h-full"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} text-white flex items-center justify-center mb-4`}>
                      {feature.icon}
                    </div>
                    <Typography variant="subheading" size="md" weight="semibold" className="text-gray-800 mb-2">
                      {feature.title}
                    </Typography>
                    <Typography variant="body" size="sm" className="text-gray-600 mb-4 flex-1">
                      {feature.description}
                    </Typography>
                    <div className="flex items-center text-blue-600 hover:text-blue-700">
                      <span className="text-sm font-medium">جرب الآن</span>
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </div>
                  </div>
                </EnhancedCard>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <EnhancedCard variant="elevated" className="bg-white/80 backdrop-blur-sm">
          <div className="p-6">
            <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-4">
              وصول سريع 📌
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickAccess.map((item, index) => (
                <Link key={index} href={item.href}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <Typography variant="body" size="sm" className="text-gray-700">
                      {item.title}
                    </Typography>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </EnhancedCard>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Typography variant="body" size="sm" className="text-gray-600 mb-4">
            هل تحتاج مساعدة في استخدام هذه الميزات؟
          </Typography>
          <Link href="/ai-assistant">
            <EnhancedCard variant="elevated" hover className="inline-block cursor-pointer transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 px-6 py-3">
                <Bot className="w-6 h-6 text-purple-600" />
                <Typography variant="body" size="md" weight="medium" className="text-purple-800">
                  اسأل المساعد الذكي
                </Typography>
              </div>
            </EnhancedCard>
          </Link>
        </div>
      </div>
    </main>
  );
}
