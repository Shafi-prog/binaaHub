// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { LoadingSpinner } from '@/core/shared/components/ui/loading-spinner';
import { Building2, CreditCard, PiggyBank, DollarSign } from 'lucide-react';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


interface BankingService {
  id: string;
  name: string;
  description: string;
  type: 'loan' | 'savings' | 'investment' | 'insurance';
  icon: string;
  provider: string;
  interestRate?: number;
  minAmount?: number;
  term?: string;
}

export default function BankingPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bankingServices, setBankingServices] = useState<BankingService[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'loan' | 'savings' | 'investment' | 'insurance'
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
          console.error('❌ [Banking] Authentication failed');
          router.push('/login');
          return;
        }

        // Mock banking services data
        const mockServices: BankingService[] = [
          {
            id: '1',
            name: 'قرض بناء منزل',
            description: 'قرض عقاري مخصص لبناء المنازل بأسعار فائدة تنافسية',
            type: 'loan',
            icon: '🏠',
            provider: 'البنك الأهلي',
            interestRate: 3.5,
            minAmount: 100000,
            term: '15-30 سنة',
          },
          {
            id: '2',
            name: 'حساب توفير البناء',
            description: 'حساب توفير مخصص لمشاريع البناء والتشييد',
            type: 'savings',
            icon: '🏗️',
            provider: 'بنك الراجحي',
            interestRate: 2.8,
            minAmount: 5000,
            term: 'مفتوح',
          },
          {
            id: '3',
            name: 'تأمين المشاريع',
            description: 'تأمين شامل للمشاريع الإنشائية ضد المخاطر',
            type: 'insurance',
            icon: '🛡️',
            provider: 'شركة التأمين الوطنية',
            minAmount: 1000,
            term: 'سنوية',
          },
          {
            id: '4',
            name: 'استثمار عقاري',
            description: 'صندوق استثماري متخصص في العقارات والبناء',
            type: 'investment',
            icon: '📈',
            provider: 'صندوق الاستثمار السعودي',
            interestRate: 5.2,
            minAmount: 50000,
            term: '3-5 سنوات',
          },
        ];

        setBankingServices(mockServices);
      } catch (error) {
        console.error('Error loading banking services:', error);
        setError('حدث خطأ في تحميل الخدمات المصرفية');
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router, supabase]);

  const filteredServices = bankingServices.filter(
    (service) => selectedCategory === 'all' || service.type === selectedCategory
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'loan':
        return <Building2 className="w-6 h-6" />;
      case 'savings':
        return <PiggyBank className="w-6 h-6" />;
      case 'investment':
        return <DollarSign className="w-6 h-6" />;
      case 'insurance':
        return <CreditCard className="w-6 h-6" />;
      default:
        return <Building2 className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'loan':
        return 'bg-blue-100 text-blue-800';
      case 'savings':
        return 'bg-green-100 text-green-800';
      case 'investment':
        return 'bg-purple-100 text-purple-800';
      case 'insurance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">الخدمات المصرفية</h1>
          <p className="text-gray-600 mt-2">خدمات مصرفية متخصصة في قطاع البناء والتشييد</p>
        </div>
      </div>

      {/* Category Filter */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'all', label: 'جميع الخدمات' },
            { key: 'loan', label: 'القروض' },
            { key: 'savings', label: 'التوفير' },
            { key: 'investment', label: 'الاستثمار' },
            { key: 'insurance', label: 'التأمين' },
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
                {service.type === 'loan' && 'قرض'}
                {service.type === 'savings' && 'توفير'}
                {service.type === 'investment' && 'استثمار'}
                {service.type === 'insurance' && 'تأمين'}
              </span>
            </div>

            <p className="text-gray-700 mb-4">{service.description}</p>

            <div className="space-y-2 text-sm">
              {service.interestRate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">معدل الفائدة:</span>
                  <span className="font-medium">{service.interestRate}%</span>
                </div>
              )}
              {service.minAmount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">الحد الأدنى:</span>
                  <span className="font-medium">{service.minAmount.toLocaleString()} ريال</span>
                </div>
              )}
              {service.term && (
                <div className="flex justify-between">
                  <span className="text-gray-600">المدة:</span>
                  <span className="font-medium">{service.term}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => alert('Button clicked')}>
                طلب الخدمة
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => alert('Button clicked')}>
                التفاصيل
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card className="p-8 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد خدمات</h3>
          <p className="text-gray-600">لم يتم العثور على خدمات مصرفية في هذه الفئة</p>
        </Card>
      )}
    </main>
  );
}


