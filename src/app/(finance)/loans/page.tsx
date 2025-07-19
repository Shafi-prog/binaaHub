// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card } from '@/core/shared/components/ui/card';
import { LoadingSpinner } from '@/core/shared/components/ui/loading-spinner';
import { verifyAuthWithRetry } from '@/core/shared/services/auth-recovery';
import { Building2, Home, Factory, Truck, Calculator, CreditCard } from 'lucide-react';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


interface LoanService {
  id: string;
  name: string;
  description: string;
  type: 'personal' | 'construction' | 'equipment' | 'mortgage' | 'business' | 'vehicle';
  icon: string;
  provider: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  term: string;
  requirements: string[];
}

export default function LoansPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loanServices, setLoanServices] = useState<LoanService[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'personal' | 'construction' | 'equipment' | 'mortgage' | 'business' | 'vehicle'
  >('all');

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verify authentication
        const authResult = await verifyAuthWithRetry();
        if (authResult.error || !authResult.user) {
          console.error('❌ [Loans] Authentication failed');
          router.push('/login');
          return;
        }

        // Mock loan services data
        const mockServices: LoanService[] = [
          {
            id: '1',
            name: 'قرض بناء منزل',
            description: 'قرض متخصص لبناء المنازل السكنية بأسعار فائدة تنافسية',
            type: 'construction',
            icon: '🏗️',
            provider: 'البنك الأهلي السعودي',
            interestRate: 3.5,
            minAmount: 100000,
            maxAmount: 2000000,
            term: '1-5 سنوات',
            requirements: [
              'وثائق ملكية الأرض',
              'مخططات البناء المعتمدة',
              'تصريح البناء',
              'إثبات الدخل',
            ],
          },
          {
            id: '2',
            name: 'قرض المعدات الثقيلة',
            description: 'تمويل شراء المعدات والآلات اللازمة للمشاريع الإنشائية',
            type: 'equipment',
            icon: '🚧',
            provider: 'بنك الراجحي',
            interestRate: 4.2,
            minAmount: 50000,
            maxAmount: 5000000,
            term: '2-7 سنوات',
            requirements: ['عروض أسعار المعدات', 'رخصة تجارية', 'كشف حساب بنكي', 'ضمانات إضافية'],
          },
          {
            id: '3',
            name: 'قرض عقاري سكني',
            description: 'تمويل شراء العقارات السكنية الجاهزة أو تحت الإنشاء',
            type: 'mortgage',
            icon: '🏠',
            provider: 'بنك الإنماء',
            interestRate: 3.2,
            minAmount: 200000,
            maxAmount: 10000000,
            term: '5-25 سنة',
            requirements: [
              'تقييم عقاري معتمد',
              'إثبات دخل ثابت',
              'بيانات ائتمانية',
              'دفعة أولى 20%',
            ],
          },
          {
            id: '4',
            name: 'قرض المشاريع التجارية',
            description: 'تمويل المشاريع التجارية والصناعية في قطاع البناء',
            type: 'business',
            icon: '🏢',
            provider: 'البنك السعودي للاستثمار',
            interestRate: 4.8,
            minAmount: 500000,
            maxAmount: 20000000,
            term: '3-10 سنوات',
            requirements: [
              'دراسة جدوى اقتصادية',
              'رخصة تجارية سارية',
              'قوائم مالية مدققة',
              'ضمانات عينية',
            ],
          },
          {
            id: '5',
            name: 'قرض شخصي للمقاولين',
            description: 'قرض شخصي مخصص للمقاولين والعاملين في قطاع البناء',
            type: 'personal',
            icon: '👤',
            provider: 'بنك البلاد',
            interestRate: 5.5,
            minAmount: 10000,
            maxAmount: 500000,
            term: '1-5 سنوات',
            requirements: ['إثبات مهنة المقاولة', 'كشف راتب أو دخل', 'سجل ائتماني نظيف', 'ضامن'],
          },
          {
            id: '6',
            name: 'قرض المركبات التجارية',
            description: 'تمويل شراء الشاحنات والمركبات التجارية للمشاريع',
            type: 'vehicle',
            icon: '🚛',
            provider: 'مصرف الراجحي',
            interestRate: 4.0,
            minAmount: 30000,
            maxAmount: 1000000,
            term: '2-5 سنوات',
            requirements: [
              'رخصة قيادة سارية',
              'تأمين شامل للمركبة',
              'ضمان مالي',
              'إثبات الحاجة التجارية',
            ],
          },
        ];

        setLoanServices(mockServices);
      } catch (error) {
        console.error('Error loading loan services:', error);
        setError('حدث خطأ في تحميل خدمات القروض');
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router, supabase]);

  const filteredServices = loanServices.filter(
    (service) => selectedCategory === 'all' || service.type === selectedCategory
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'construction':
        return <Building2 className="w-6 h-6" />;
      case 'equipment':
        return <Factory className="w-6 h-6" />;
      case 'mortgage':
        return <Home className="w-6 h-6" />;
      case 'business':
        return <CreditCard className="w-6 h-6" />;
      case 'personal':
        return <Calculator className="w-6 h-6" />;
      case 'vehicle':
        return <Truck className="w-6 h-6" />;
      default:
        return <Building2 className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'construction':
        return 'bg-blue-100 text-blue-800';
      case 'equipment':
        return 'bg-green-100 text-green-800';
      case 'mortgage':
        return 'bg-purple-100 text-purple-800';
      case 'business':
        return 'bg-orange-100 text-orange-800';
      case 'personal':
        return 'bg-red-100 text-red-800';
      case 'vehicle':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'construction':
        return 'البناء';
      case 'equipment':
        return 'المعدات';
      case 'mortgage':
        return 'العقاري';
      case 'business':
        return 'التجاري';
      case 'personal':
        return 'الشخصي';
      case 'vehicle':
        return 'المركبات';
      default:
        return 'عام';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">خدمات القروض</h1>
          <p className="text-gray-600 mt-2">حلول تمويل متخصصة لقطاع البناء والتشييد</p>
        </div>
      </div>

      {/* Category Filter */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">تصفية حسب النوع</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'all', label: 'جميع القروض' },
            { key: 'construction', label: 'قروض البناء' },
            { key: 'equipment', label: 'قروض المعدات' },
            { key: 'mortgage', label: 'قروض عقارية' },
            { key: 'business', label: 'قروض تجارية' },
            { key: 'personal', label: 'قروض شخصية' },
            { key: 'vehicle', label: 'قروض المركبات' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">{getTypeIcon(service.type)}</div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.provider}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(service.type)}`}
              >
                {getTypeLabel(service.type)}
              </span>
            </div>

            <p className="text-gray-700 mb-4">{service.description}</p>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">معدل الفائدة:</span>
                <span className="font-medium text-green-600">{service.interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الحد الأدنى:</span>
                <span className="font-medium">{service.minAmount.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الحد الأقصى:</span>
                <span className="font-medium">{service.maxAmount.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">مدة السداد:</span>
                <span className="font-medium">{service.term}</span>
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">المتطلبات:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {service.requirements.slice(0, 3).map((requirement, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {requirement}
                  </li>
                ))}
                {service.requirements.length > 3 && (
                  <li className="text-blue-600">+{service.requirements.length - 3} متطلبات أخرى</li>
                )}
              </ul>
            </div>

            <div className="flex gap-2 mt-6">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                طلب القرض
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                الحاسبة
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card className="p-8 text-center">
          <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد قروض</h3>
          <p className="text-gray-500">لم يتم العثور على قروض في هذه الفئة</p>
        </Card>
      )}
    </main>
  );
}


