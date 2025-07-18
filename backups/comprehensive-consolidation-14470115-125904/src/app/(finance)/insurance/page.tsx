// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, LoadingSpinner } from '@/core/shared/components/ui';
import { verifyAuthWithRetry } from '@/core/shared/services/auth-recovery';
import { Shield, Home, Car, Heart, Building2, Factory } from 'lucide-react';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


interface InsuranceService {
  id: string;
  name: string;
  description: string;
  type: 'construction' | 'equipment' | 'liability' | 'property' | 'workers' | 'project';
  icon: string;
  provider: string;
  coverage?: string;
  premium?: number;
  term: string;
  features: string[];
}

export default function InsurancePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insuranceServices, setInsuranceServices] = useState<InsuranceService[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'construction' | 'equipment' | 'liability' | 'property' | 'workers' | 'project'
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
          console.error('❌ [Insurance] Authentication failed');
          router.push('/login');
          return;
        }

        // Mock insurance services data
        const mockServices: InsuranceService[] = [
          {
            id: '1',
            name: 'تأمين المباني السكنية',
            description: 'تأمين شامل للمباني السكنية ضد الحريق والزلازل والفيضانات',
            type: 'construction',
            icon: '🏠',
            provider: 'شركة التأمين الوطنية',
            coverage: '10 مليون ريال',
            premium: 15000,
            term: 'سنوي',
            features: [
              'تغطية الحريق والانفجار',
              'تأمين ضد الكوارث الطبيعية',
              'مسؤولية المقاول',
              'تأمين المعدات',
            ],
          },
          {
            id: '2',
            name: 'تأمين المعدات الثقيلة',
            description: 'حماية شاملة للمعدات والآلات المستخدمة في البناء',
            type: 'equipment',
            icon: '🚧',
            provider: 'التعاونية للتأمين',
            coverage: '5 مليون ريال',
            premium: 25000,
            term: 'سنوي',
            features: [
              'تأمين الآلات والمعدات',
              'تغطية السرقة والتلف',
              'تأمين النقل',
              'صيانة طارئة',
            ],
          },
          {
            id: '3',
            name: 'تأمين المسؤولية المهنية',
            description: 'حماية من المسؤولية القانونية في مشاريع البناء',
            type: 'liability',
            icon: '⚖️',
            provider: 'ساب تكافل',
            coverage: '20 مليون ريال',
            premium: 18000,
            term: 'سنوي',
            features: ['المسؤولية المهنية', 'أخطاء التصميم', 'مسؤولية المنتج', 'الدفاع القانوني'],
          },
          {
            id: '4',
            name: 'تأمين العمال',
            description: 'تأمين شامل لعمال البناء ضد إصابات العمل',
            type: 'workers',
            icon: '👷',
            provider: 'الأهلي تكافل',
            coverage: '500,000 ريال للعامل',
            premium: 8000,
            term: 'سنوي',
            features: ['إصابات العمل', 'التأمين الصحي', 'التعويضات المالية', 'إعادة التأهيل'],
          },
          {
            id: '5',
            name: 'تأمين المشاريع التجارية',
            description: 'حماية شاملة للمشاريع التجارية والصناعية',
            type: 'project',
            icon: '🏢',
            provider: 'بوبا العربية',
            coverage: '50 مليون ريال',
            premium: 45000,
            term: 'حسب المشروع',
            features: ['تأمين شامل للمشروع', 'تأخير الإنجاز', 'الأضرار البيئية', 'مسؤولية المقاول'],
          },
          {
            id: '6',
            name: 'تأمين الممتلكات',
            description: 'حماية الممتلكات والأصول من المخاطر المختلفة',
            type: 'property',
            icon: '🏗️',
            provider: 'وقاية للتأمين',
            coverage: '15 مليون ريال',
            premium: 22000,
            term: 'سنوي',
            features: ['تأمين المباني', 'المحتويات والأثاث', 'فقدان الإيجار', 'المسؤولية العامة'],
          },
        ];

        setInsuranceServices(mockServices);
      } catch (error) {
        console.error('Error loading insurance services:', error);
        setError('حدث خطأ في تحميل خدمات التأمين');
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router, supabase]);

  const filteredServices = insuranceServices.filter(
    (service) => selectedCategory === 'all' || service.type === selectedCategory
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'construction':
        return <Building2 className="w-6 h-6" />;
      case 'equipment':
        return <Factory className="w-6 h-6" />;
      case 'liability':
        return <Shield className="w-6 h-6" />;
      case 'property':
        return <Home className="w-6 h-6" />;
      case 'workers':
        return <Heart className="w-6 h-6" />;
      case 'project':
        return <Car className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'construction':
        return 'bg-blue-100 text-blue-800';
      case 'equipment':
        return 'bg-green-100 text-green-800';
      case 'liability':
        return 'bg-purple-100 text-purple-800';
      case 'property':
        return 'bg-orange-100 text-orange-800';
      case 'workers':
        return 'bg-red-100 text-red-800';
      case 'project':
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
      case 'liability':
        return 'المسؤولية';
      case 'property':
        return 'الممتلكات';
      case 'workers':
        return 'العمال';
      case 'project':
        return 'المشاريع';
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
          <h1 className="text-3xl font-bold text-gray-900">خدمات التأمين</h1>
          <p className="text-gray-600 mt-2">حلول تأمين متخصصة لقطاع البناء والتشييد</p>
        </div>
      </div>

      {/* Category Filter */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">تصفية حسب النوع</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'all', label: 'جميع الخدمات' },
            { key: 'construction', label: 'تأمين البناء' },
            { key: 'equipment', label: 'تأمين المعدات' },
            { key: 'liability', label: 'تأمين المسؤولية' },
            { key: 'property', label: 'تأمين الممتلكات' },
            { key: 'workers', label: 'تأمين العمال' },
            { key: 'project', label: 'تأمين المشاريع' },
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
              {service.coverage && (
                <div className="flex justify-between">
                  <span className="text-gray-600">التغطية:</span>
                  <span className="font-medium">{service.coverage}</span>
                </div>
              )}
              {service.premium && (
                <div className="flex justify-between">
                  <span className="text-gray-600">القسط السنوي:</span>
                  <span className="font-medium">{service.premium.toLocaleString()} ريال</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">المدة:</span>
                <span className="font-medium">{service.term}</span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">المزايا:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {service.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-green-600" />
                    {feature}
                  </li>
                ))}
                {service.features.length > 3 && (
                  <li className="text-blue-600">+{service.features.length - 3} مزايا أخرى</li>
                )}
              </ul>
            </div>

            <div className="flex gap-2 mt-6">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                طلب عرض سعر
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                التفاصيل
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card className="p-8 text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد خدمات تأمين</h3>
          <p className="text-gray-500">لم يتم العثور على خدمات تأمين في هذه الفئة</p>
        </Card>
      )}
    </main>
  );
}


