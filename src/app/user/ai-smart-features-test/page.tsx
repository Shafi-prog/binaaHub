"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { 
  Bot, 
  Calculator, 
  Lightbulb, 
  Home, 
  Building2, 
  TrendingUp, 
  MessageSquare,
  BarChart3,
  Target,
  Zap,
  Brain,
  ArrowRight,
  Sparkles,
  Search,
  FileText,
  Settings,
  Grid,
  Star,
  Upload,
  Eye,
  Shield,
  Receipt,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  PlayCircle,
  DollarSign,
  Crown,
  Lock,
  Unlock
} from 'lucide-react';
import { useIsClient } from '../../../core/shared/utils/hydration-safe';

export const dynamic = 'force-dynamic'

interface AIFeature {
  id: string;
  name: string;
  description: string;
  category: 'AI Assistant' | 'Smart Calculator' | 'AI Analytics' | 'Data Extraction' | 'Business Intelligence';
  url: string;
  status: 'working' | 'broken' | 'limited' | 'untested';
  subscriptionTier: 'free' | 'basic' | 'premium' | 'enterprise';
  expectedFeatures: string[];
  testResults: {
    functionality: 'pass' | 'fail' | 'partial' | 'untested';
    performance: 'excellent' | 'good' | 'poor' | 'untested';
    accuracy: 'high' | 'medium' | 'low' | 'untested';
    userExperience: 'excellent' | 'good' | 'poor' | 'untested';
  };
  issues: string[];
  recommendations: string[];
  lastTested?: string;
}

export default function AISmartFeaturesTestPage() {
  const isClient = useIsClient();
  const [features, setFeatures] = useState<AIFeature[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});

  useEffect(() => {
    setFeatures([
      {
        id: 'ai-hub',
        name: 'مركز الذكاء الاصطناعي',
        description: 'مركز مركزي لجميع خدمات الذكاء الاصطناعي والأدوات الذكية',
        category: 'AI Assistant',
        url: '/user/ai-hub',
        status: 'working',
        subscriptionTier: 'free',
        expectedFeatures: [
          'عرض جميع الأدوات الذكية',
          'تصنيف الأدوات حسب النوع',
          'روابط صحيحة لكل أداة',
          'إحصائيات الاستخدام',
          'واجهة مستخدم سهلة'
        ],
        testResults: {
          functionality: 'pass',
          performance: 'good',
          accuracy: 'high',
          userExperience: 'good'
        },
        issues: [],
        recommendations: [
          'إضافة نظام تقييم للأدوات',
          'تحسين التصنيفات',
          'إضافة بحث متقدم'
        ]
      },
      {
        id: 'ai-assistant',
        name: 'المساعد الذكي',
        description: 'مساعد ذكي للإجابة على أسئلة البناء والمشاريع',
        category: 'AI Assistant',
        url: '/user/ai-assistant',
        status: 'limited',
        subscriptionTier: 'basic',
        expectedFeatures: [
          'الإجابة على أسئلة البناء',
          'تقديم نصائح مخصصة',
          'دعم اللغة العربية',
          'ذاكرة المحادثة',
          'مصادر موثوقة'
        ],
        testResults: {
          functionality: 'partial',
          performance: 'poor',
          accuracy: 'low',
          userExperience: 'poor'
        },
        issues: [
          'إجابات غير دقيقة',
          'لا يحتفظ بسياق المحادثة',
          'بطء في الاستجابة',
          'مشاكل في اللغة العربية'
        ],
        recommendations: [
          'تحسين نموذج الذكاء الاصطناعي',
          'إضافة قاعدة بيانات محلية للبناء',
          'تحسين معالجة اللغة العربية',
          'إضافة آلية التحقق من الدقة'
        ]
      },
      {
        id: 'smart-insights',
        name: 'الرؤى الذكية',
        description: 'تحليلات ذكية لمشاريعك ومصروفاتك باستخدام الذكاء الاصطناعي',
        category: 'AI Analytics',
        url: '/user/smart-insights',
        status: 'broken',
        subscriptionTier: 'premium',
        expectedFeatures: [
          'تحليل المصروفات',
          'توقعات الأسعار',
          'نصائح التوفير',
          'مقارنة المشاريع',
          'تقارير تفصيلية'
        ],
        testResults: {
          functionality: 'fail',
          performance: 'untested',
          accuracy: 'untested',
          userExperience: 'poor'
        },
        issues: [
          'لا يعرض بيانات حقيقية',
          'التحليلات وهمية',
          'لا يتصل بقاعدة البيانات',
          'واجهة مربكة'
        ],
        recommendations: [
          'إعادة بناء من الصفر',
          'ربط بقاعدة البيانات الحقيقية',
          'إضافة خوارزميات تحليل حقيقية',
          'تحسين واجهة المستخدم'
        ]
      },
      {
        id: 'smart-construction-advisor',
        name: 'المستشار الذكي للبناء',
        description: 'مستشار ذكي يقدم نصائح مخصصة للبناء والمشاريع',
        category: 'AI Assistant',
        url: '/user/smart-construction-advisor',
        status: 'limited',
        subscriptionTier: 'premium',
        expectedFeatures: [
          'نصائح مخصصة للمشروع',
          'اقتراحات المواد',
          'تقديرات التكلفة',
          'جدولة المشروع',
          'تحذيرات المخاطر'
        ],
        testResults: {
          functionality: 'partial',
          performance: 'good',
          accuracy: 'medium',
          userExperience: 'good'
        },
        issues: [
          'نصائح عامة وليست مخصصة',
          'لا يأخذ في الاعتبار بيانات المستخدم',
          'معلومات قديمة عن الأسعار'
        ],
        recommendations: [
          'ربط ببيانات المستخدم الحقيقية',
          'تحديث قاعدة بيانات الأسعار',
          'إضافة خوارزميات تخصيص',
          'تحسين دقة التوقعات'
        ]
      },
      {
        id: 'comprehensive-calculator',
        name: 'حاسبة البناء الشاملة',
        description: 'حاسبة متطورة لحساب تكاليف البناء مع إدارة المشاريع',
        category: 'Smart Calculator',
        url: '/user/comprehensive-construction-calculator',
        status: 'working',
        subscriptionTier: 'free',
        expectedFeatures: [
          'حساب تكاليف دقيقة',
          'أسعار محدثة',
          'تصدير التقارير',
          'حفظ المشاريع',
          'مقارنة الخيارات'
        ],
        testResults: {
          functionality: 'pass',
          performance: 'excellent',
          accuracy: 'high',
          userExperience: 'excellent'
        },
        issues: [],
        recommendations: [
          'إضافة المزيد من المناطق',
          'تحديث الأسعار بشكل أسرع',
          'إضافة حاسبات فرعية متخصصة'
        ]
      },
      {
        id: 'individual-home-calculator',
        name: 'حاسبة البيت الفردي',
        description: 'حاسبة متخصصة لبناء البيوت الفردية مع مستويات الجودة',
        category: 'Smart Calculator',
        url: '/user/individual-home-calculator',
        status: 'working',
        subscriptionTier: 'basic',
        expectedFeatures: [
          'مستويات جودة متعددة',
          'تخصيص حسب المساحة',
          'مراحل البناء',
          'توصيات المواد',
          'جدولة زمنية'
        ],
        testResults: {
          functionality: 'pass',
          performance: 'good',
          accuracy: 'high',
          userExperience: 'good'
        },
        issues: [
          'بعض الأسعار غير محدثة'
        ],
        recommendations: [
          'تحديث أسعار المواد',
          'إضافة المزيد من أنواع البيوت',
          'تحسين واجهة المستخدم'
        ]
      },
      {
        id: 'invoice-extractor',
        name: 'مستخرج بيانات الفواتير',
        description: 'خدمة ذكية لاستخراج بيانات الضمان والفواتير تلقائياً',
        category: 'Data Extraction',
        url: '/user/warranties/ai-extract',
        status: 'broken',
        subscriptionTier: 'premium',
        expectedFeatures: [
          'استخراج اسم المنتج',
          'تحديد المتجر',
          'استخراج التاريخ والسعر',
          'تحديد مدة الضمان',
          'دقة عالية 95%'
        ],
        testResults: {
          functionality: 'fail',
          performance: 'poor',
          accuracy: 'low',
          userExperience: 'poor'
        },
        issues: [
          'لا يستخرج البيانات بدقة',
          'يفشل مع الفواتير العربية',
          'النتائج عشوائية',
          'لا يحفظ النتائج'
        ],
        recommendations: [
          'استخدام تقنية OCR محسنة',
          'تدريب النموذج على فواتير عربية',
          'إضافة مراجعة يدوية',
          'تحسين معالجة الصور'
        ]
      },
      {
        id: 'expense-tracker',
        name: 'متتبع المصروفات الذكي',
        description: 'ربط ذكي بين الضمانات والمصروفات لتتبع الاستثمارات',
        category: 'Business Intelligence',
        url: '/user/warranty-expense-tracking',
        status: 'limited',
        subscriptionTier: 'basic',
        expectedFeatures: [
          'تحليل الاستثمارات',
          'تتبع عوائد المطالبات',
          'إحصائيات مالية',
          'تصنيف المصروفات',
          'تقارير ذكية'
        ],
        testResults: {
          functionality: 'partial',
          performance: 'good',
          accuracy: 'medium',
          userExperience: 'good'
        },
        issues: [
          'لا يربط بالبيانات الحقيقية',
          'التحليلات سطحية'
        ],
        recommendations: [
          'ربط ببيانات المصروفات الحقيقية',
          'تحسين خوارزميات التحليل',
          'إضافة تنبؤات مالية'
        ]
      }
    ]);
  }, []);

  const categories = [
    { id: 'all', name: 'جميع الميزات', count: features.length },
    { id: 'AI Assistant', name: 'المساعدون الأذكياء', count: features.filter(f => f.category === 'AI Assistant').length },
    { id: 'Smart Calculator', name: 'الحاسبات الذكية', count: features.filter(f => f.category === 'Smart Calculator').length },
    { id: 'AI Analytics', name: 'التحليلات الذكية', count: features.filter(f => f.category === 'AI Analytics').length },
    { id: 'Data Extraction', name: 'استخراج البيانات', count: features.filter(f => f.category === 'Data Extraction').length },
    { id: 'Business Intelligence', name: 'ذكاء الأعمال', count: features.filter(f => f.category === 'Business Intelligence').length }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'working': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'broken': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'limited': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'untested': return <Clock className="w-5 h-5 text-gray-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'working': return 'يعمل بشكل جيد';
      case 'broken': return 'معطل';
      case 'limited': return 'يعمل جزئياً';
      case 'untested': return 'لم يتم اختباره';
      default: return 'غير معروف';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'working': return 'bg-green-100 text-green-800';
      case 'broken': return 'bg-red-100 text-red-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'untested': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch(tier) {
      case 'free': return <Unlock className="w-4 h-4 text-green-600" />;
      case 'basic': return <DollarSign className="w-4 h-4 text-blue-600" />;
      case 'premium': return <Crown className="w-4 h-4 text-purple-600" />;
      case 'enterprise': return <Lock className="w-4 h-4 text-red-600" />;
      default: return <Lock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTierText = (tier: string) => {
    switch(tier) {
      case 'free': return 'مجاني';
      case 'basic': return 'أساسي';
      case 'premium': return 'مميز';
      case 'enterprise': return 'مؤسسي';
      default: return 'غير محدد';
    }
  };

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch(performance) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'poor': return 'text-red-600';
      case 'untested': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const runFeatureTest = async (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    // Simulate testing
    setTestResults(prev => ({
      ...prev,
      [featureId]: { status: 'testing', startTime: new Date().toISOString() }
    }));

    // Open feature in new tab for manual testing
    window.open(feature.url, '_blank');

    setTimeout(() => {
      setTestResults(prev => ({
        ...prev,
        [featureId]: { status: 'completed', endTime: new Date().toISOString() }
      }));
    }, 3000);
  };

  const stats = {
    total: features.length,
    working: features.filter(f => f.status === 'working').length,
    broken: features.filter(f => f.status === 'broken').length,
    limited: features.filter(f => f.status === 'limited').length,
    untested: features.filter(f => f.status === 'untested').length,
    premium: features.filter(f => f.subscriptionTier === 'premium' || f.subscriptionTier === 'enterprise').length
  };

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl" dir="rtl">
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          اختبار وإدارة الميزات الذكية والذكاء الاصطناعي
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          مراجعة شاملة لجميع ميزات الذكاء الاصطناعي والحاسبات الذكية لتقييم جودتها وتحديد مستويات الاشتراك
        </Typography>
      </div>

      {/* Warning Alert */}
      <EnhancedCard className="p-6 mb-8 bg-red-50 border-red-200">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-red-600 mt-1" />
          <div>
            <Typography variant="subheading" size="lg" weight="semibold" className="text-red-900 mb-2">
              تحذير - مشاكل في الميزات الذكية
            </Typography>
            <Typography variant="body" size="md" className="text-red-800 mb-4">
              تم اكتشاف مشاكل في عدة ميزات ذكية. يجب مراجعتها وإصلاحها قبل تفعيل نظام الاشتراكات المدفوعة.
            </Typography>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
                {stats.broken} ميزة معطلة
              </span>
              <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
                {stats.limited} ميزة تعمل جزئياً
              </span>
              <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                {stats.premium} ميزة مخططة للاشتراك المدفوع
              </span>
            </div>
          </div>
        </div>
      </EnhancedCard>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600">
                {stats.total}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">إجمالي الميزات</Typography>
            </div>
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600">
                {stats.working}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">تعمل بشكل جيد</Typography>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-red-600">
                {stats.broken}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">معطلة</Typography>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-yellow-600">
                {stats.limited}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">تعمل جزئياً</Typography>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-purple-600">
                {stats.premium}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">للاشتراك المدفوع</Typography>
            </div>
            <Crown className="w-8 h-8 text-purple-600" />
          </div>
        </EnhancedCard>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid gap-6">
        {filteredFeatures.map((feature) => (
          <EnhancedCard key={feature.id} className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Feature Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900">
                        {feature.name}
                      </Typography>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}>
                        {getStatusText(feature.status)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTierColor(feature.subscriptionTier)}`}>
                        {getTierIcon(feature.subscriptionTier)}
                        {getTierText(feature.subscriptionTier)}
                      </span>
                    </div>
                    <Typography variant="body" size="md" className="text-gray-600 mb-2">
                      {feature.description}
                    </Typography>
                    <Typography variant="caption" size="sm" className="text-blue-600 font-medium">
                      {feature.category}
                    </Typography>
                  </div>
                  {getStatusIcon(feature.status)}
                </div>

                {/* Test Results */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">الوظائف</Typography>
                    <Typography variant="body" size="sm" weight="medium" className={getPerformanceColor(feature.testResults.functionality)}>
                      {feature.testResults.functionality === 'pass' ? 'ممتاز' : 
                       feature.testResults.functionality === 'partial' ? 'جزئي' :
                       feature.testResults.functionality === 'fail' ? 'فاشل' : 'لم يختبر'}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">الأداء</Typography>
                    <Typography variant="body" size="sm" weight="medium" className={getPerformanceColor(feature.testResults.performance)}>
                      {feature.testResults.performance === 'excellent' ? 'ممتاز' : 
                       feature.testResults.performance === 'good' ? 'جيد' :
                       feature.testResults.performance === 'poor' ? 'ضعيف' : 'لم يختبر'}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">الدقة</Typography>
                    <Typography variant="body" size="sm" weight="medium" className={getPerformanceColor(feature.testResults.accuracy)}>
                      {feature.testResults.accuracy === 'high' ? 'عالية' : 
                       feature.testResults.accuracy === 'medium' ? 'متوسطة' :
                       feature.testResults.accuracy === 'low' ? 'منخفضة' : 'لم تختبر'}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تجربة المستخدم</Typography>
                    <Typography variant="body" size="sm" weight="medium" className={getPerformanceColor(feature.testResults.userExperience)}>
                      {feature.testResults.userExperience === 'excellent' ? 'ممتازة' : 
                       feature.testResults.userExperience === 'good' ? 'جيدة' :
                       feature.testResults.userExperience === 'poor' ? 'ضعيفة' : 'لم تختبر'}
                    </Typography>
                  </div>
                </div>

                {/* Issues */}
                {feature.issues.length > 0 && (
                  <div className="mb-4">
                    <Typography variant="caption" size="sm" className="text-red-600 mb-2 font-medium">المشاكل المكتشفة:</Typography>
                    <ul className="space-y-1">
                      {feature.issues.map((issue, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {feature.recommendations.length > 0 && (
                  <div className="mb-4">
                    <Typography variant="caption" size="sm" className="text-blue-600 mb-2 font-medium">التوصيات للتحسين:</Typography>
                    <ul className="space-y-1">
                      {feature.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 lg:w-48">
                <Link href={feature.url}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2" onClick={() => alert('Button clicked')}>
                    <ArrowRight className="w-4 h-4" />
                    فتح الميزة
                  </Button>
                </Link>
                
                <Button
                  onClick={() => runFeatureTest(feature.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  disabled={testResults[feature.id]?.status === 'testing'}
                >
                  {testResults[feature.id]?.status === 'testing' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      جاري الاختبار
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      اختبار الميزة
                    </>
                  )}
                </Button>

                <Link href="/user/feedback">
                  <Button 
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2"
                   onClick={() => alert('Button clicked')}>
                    <MessageSquare className="w-4 h-4" />
                    تقرير مشكلة
                  </Button>
                </Link>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {/* Subscription Tier Summary */}
      <EnhancedCard className="p-6 mt-8">
        <Typography variant="subheading" size="xl" weight="semibold" className="mb-4 flex items-center gap-3">
          <Crown className="w-6 h-6 text-purple-600" />
          توزيع الميزات حسب مستوى الاشتراك
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Unlock className="w-8 h-8 text-green-600" />
            </div>
            <Typography variant="subheading" size="lg" weight="semibold" className="text-green-700 mb-1">مجاني</Typography>
            <Typography variant="body" size="lg" className="text-gray-600 mb-2">
              {features.filter(f => f.subscriptionTier === 'free').length} ميزة
            </Typography>
            <Typography variant="caption" size="sm" className="text-gray-500">
              الحاسبات الأساسية والميزات العامة
            </Typography>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <Typography variant="subheading" size="lg" weight="semibold" className="text-blue-700 mb-1">أساسي</Typography>
            <Typography variant="body" size="lg" className="text-gray-600 mb-2">
              {features.filter(f => f.subscriptionTier === 'basic').length} ميزة
            </Typography>
            <Typography variant="caption" size="sm" className="text-gray-500">
              حاسبات متقدمة وتتبع مصروفات
            </Typography>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
            <Typography variant="subheading" size="lg" weight="semibold" className="text-purple-700 mb-1">مميز</Typography>
            <Typography variant="body" size="lg" className="text-gray-600 mb-2">
              {features.filter(f => f.subscriptionTier === 'premium').length} ميزة
            </Typography>
            <Typography variant="caption" size="sm" className="text-gray-500">
              ذكاء اصطناعي وتحليلات متقدمة
            </Typography>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <Typography variant="subheading" size="lg" weight="semibold" className="text-red-700 mb-1">مؤسسي</Typography>
            <Typography variant="body" size="lg" className="text-gray-600 mb-2">
              {features.filter(f => f.subscriptionTier === 'enterprise').length} ميزة
            </Typography>
            <Typography variant="caption" size="sm" className="text-gray-500">
              حلول متكاملة للشركات الكبيرة
            </Typography>
          </div>
        </div>
      </EnhancedCard>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/user/ai-hub">
          <EnhancedCard className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <Typography variant="body" size="md" weight="medium">مركز الذكاء الاصطناعي</Typography>
            </div>
          </EnhancedCard>
        </Link>
        
        <Link href="/user/subscriptions">
          <EnhancedCard className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-yellow-600" />
              <Typography variant="body" size="md" weight="medium">إدارة الاشتراكات</Typography>
            </div>
          </EnhancedCard>
        </Link>
        
        <Link href="/user/feedback">
          <EnhancedCard className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <Typography variant="body" size="md" weight="medium">تقرير مشاكل الميزات</Typography>
            </div>
          </EnhancedCard>
        </Link>
      </div>
    </div>
  );
}
