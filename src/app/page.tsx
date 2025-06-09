'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Typography, 
  EnhancedCard, 
  EnhancedButton 
} from '@/components/ui/enhanced-components';

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

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Import Supabase client dynamically to prevent build issues
        const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
        const supabase = createClientComponentClient();
        
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-6">
            منصة <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">بناء</span> المتكاملة
          </Typography>
          <Typography variant="body" size="xl" className="text-gray-600 mb-8 max-w-3xl mx-auto">
            نظام متكامل لإدارة مشاريع البناء والمتاجر المتخصصة مع تقنيات حديثة وواجهة سهلة الاستخدام
          </Typography>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/signup">
              <EnhancedButton variant="secondary" size="lg" className="shadow-lg hover:shadow-xl">
                ابدأ الآن مجاناً
              </EnhancedButton>
            </Link>
            <Link href="/login">
              <EnhancedButton variant="outline" size="lg" className="shadow-lg hover:shadow-xl">
                تسجيل الدخول
              </EnhancedButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex rounded-xl bg-white/80 backdrop-blur-sm p-1.5 mb-8 shadow-lg border border-gray-200">
            <EnhancedButton
              variant={activeFeature === 'user' ? 'primary' : 'ghost'}
              size="md"
              onClick={() => setActiveFeature('user')}
              className="rounded-lg"
            >
              خدمات المستخدمين
            </EnhancedButton>
            <EnhancedButton
              variant={activeFeature === 'store' ? 'primary' : 'ghost'}
              size="md"
              onClick={() => setActiveFeature('store')}
              className="rounded-lg"
            >
              خدمات المتاجر
            </EnhancedButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features[activeFeature].map((feature, index) => (
            <EnhancedCard
              key={feature.title}
              variant="elevated"
              hover
              className="p-8 text-center transition-all duration-300 hover:scale-105 group"
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900 mb-3">
                {feature.title}
              </Typography>
              <Typography variant="body" size="md" className="text-gray-600">
                {feature.description}
              </Typography>
            </EnhancedCard>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Typography variant="heading" size="3xl" weight="bold" className="text-white mb-6">
            ابدأ رحلتك مع منصة بناء اليوم
          </Typography>
          <Typography variant="body" size="lg" className="text-blue-100 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المستخدمين والمتاجر الناجحة في عالم البناء والتشييد
          </Typography>
          <Link href="/signup">
            <EnhancedButton 
              variant="secondary" 
              size="xl" 
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              سجل حسابك مجاناً
            </EnhancedButton>
          </Link>
        </div>
      </div>
      {/* Bottom line: MADE WITH LOVE شافي */}
      <div className="w-full py-4 bg-transparent flex justify-center items-center">
        <span className="text-xs text-gray-400 font-semibold tracking-widest">MADE WITH LOVE شافي- بنتي الغالية ريناد تسلم عليكم</span>
      </div>
    </main>
  );
}
