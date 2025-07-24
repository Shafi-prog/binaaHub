'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Check, 
  Crown, 
  Star, 
  Zap,
  Users,
  Shield,
  Cloud,
  Smartphone,
  Calendar
} from 'lucide-react';

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'basic',
      name: 'الأساسي',
      price: '99',
      period: 'شهرياً',
      description: 'مناسب للمشاريع الصغيرة',
      icon: <Smartphone className="w-8 h-8" />,
      features: [
        'إدارة حتى 5 مشاريع',
        'حاسبة التكاليف الأساسية',
        'دليل الموردين المحدود',
        'المذكرة الشخصية',
        'الدعم الفني الأساسي'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'المحترف',
      price: '199',
      period: 'شهرياً',
      description: 'الأفضل للمقاولين والمطورين',
      icon: <Crown className="w-8 h-8" />,
      features: [
        'مشاريع غير محدودة',
        'حاسبة التكاليف المتقدمة',
        'دليل شامل للموردين',
        'إدارة الفرق والمهام',
        'تقارير مالية تفصيلية',
        'نسخ احتياطي تلقائي',
        'دعم فني على مدار الساعة'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'المؤسسات',
      price: '499',
      period: 'شهرياً',
      description: 'للشركات الكبرى والمؤسسات',
      icon: <Star className="w-8 h-8" />,
      features: [
        'جميع مميزات الخطة المحترفة',
        'إدارة متعددة المواقع',
        'تكامل مع الأنظمة الخارجية',
        'تقارير مخصصة',
        'مدير حساب مخصص',
        'تدريب للفريق',
        'SLA مضمون'
      ],
      popular: false
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'أمان متقدم',
      description: 'حماية عالية المستوى لبياناتك'
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: 'نسخ احتياطي سحابي',
      description: 'حفظ تلقائي وآمن لجميع بياناتك'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'إدارة الفرق',
      description: 'تعاون سهل مع أعضاء الفريق'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'أداء سريع',
      description: 'استجابة فورية وتحديثات مباشرة'
    }
  ];

  const handleSubscribe = (planId: string) => {
    console.log('Subscribing to plan:', planId);
    // Handle subscription logic here
  };

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
              ترقية الاشتراك
            </Typography>
            <Typography variant="body" className="text-gray-600">
              اختر الخطة المناسبة لاحتياجاتك
            </Typography>
          </div>
        </div>

        {/* Current Plan Status */}
        <EnhancedCard variant="elevated" className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800">
                  الخطة الحالية: الأساسي
                </Typography>
                <Typography variant="body" size="sm" className="text-gray-600">
                  تنتهي في 15 مايو 2024
                </Typography>
              </div>
            </div>
            <div className="text-left">
              <Typography variant="body" size="sm" className="text-gray-600">الاستخدام الحالي</Typography>
              <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800">
                3 من 5 مشاريع
              </Typography>
            </div>
          </div>
        </EnhancedCard>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <EnhancedCard
              key={plan.id}
              variant="elevated"
              hover
              className={`relative p-8 transition-all duration-300 ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-xl scale-105' 
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    الأكثر شعبية
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <div className={plan.popular ? 'text-blue-600' : 'text-gray-600'}>
                    {plan.icon}
                  </div>
                </div>
                <Typography variant="subheading" size="xl" weight="bold" className="text-gray-800 mb-2">
                  {plan.name}
                </Typography>
                <Typography variant="body" size="sm" className="text-gray-600 mb-4">
                  {plan.description}
                </Typography>
                <div className="flex items-baseline justify-center gap-1">
                  <Typography variant="heading" size="3xl" weight="bold" className="text-gray-800">
                    {plan.price}
                  </Typography>
                  <Typography variant="body" size="sm" className="text-gray-600">
                    ر.س / {plan.period}
                  </Typography>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <Typography variant="body" size="sm" className="text-gray-700">
                      {feature}
                    </Typography>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'filled' : 'outline'}
                size="lg"
                className="w-full"
                onClick={() => handleSubscribe(plan.id)}
              >
                {plan.id === 'basic' ? 'الخطة الحالية' : 'ترقية الآن'}
              </Button>
            </EnhancedCard>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800 mb-4">
              لماذا ترقية اشتراكك؟
            </Typography>
            <Typography variant="body" size="lg" className="text-gray-600">
              احصل على المزيد من الميزات المتقدمة لإدارة مشاريعك بكفاءة أكبر
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <EnhancedCard key={index} variant="elevated" className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">{feature.icon}</div>
                </div>
                <Typography variant="subheading" size="sm" weight="semibold" className="text-gray-800 mb-2">
                  {feature.title}
                </Typography>
                <Typography variant="body" size="sm" className="text-gray-600">
                  {feature.description}
                </Typography>
              </EnhancedCard>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <EnhancedCard variant="elevated" className="p-8">
          <Typography variant="heading" size="xl" weight="bold" className="text-gray-800 mb-6 text-center">
            الأسئلة الشائعة
          </Typography>
          <div className="space-y-6">
            <div>
              <Typography variant="subheading" size="sm" weight="semibold" className="text-gray-800 mb-2">
                هل يمكنني إلغاء الاشتراك في أي وقت؟
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                نعم، يمكنك إلغاء اشتراكك في أي وقت من خلال الإعدادات. لن يتم تجديد الاشتراك تلقائياً بعد الإلغاء.
              </Typography>
            </div>
            <div>
              <Typography variant="subheading" size="sm" weight="semibold" className="text-gray-800 mb-2">
                ماذا يحدث لبياناتي عند الترقية؟
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                جميع بياناتك ومشاريعك محفوظة بأمان وستنتقل معك إلى الخطة الجديدة دون أي فقدان.
              </Typography>
            </div>
            <div>
              <Typography variant="subheading" size="sm" weight="semibold" className="text-gray-800 mb-2">
                هل يوجد خصم للدفع السنوي؟
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                نعم، نوفر خصم 20% عند الدفع لفترة سنة كاملة مقدماً.
              </Typography>
            </div>
          </div>
        </EnhancedCard>
      </div>
    </main>
  );
}
