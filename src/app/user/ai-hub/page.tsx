'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Badge } from '@/core/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Star
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  category: 'calculator' | 'advisor' | 'insights' | 'assistant';
  status: 'active' | 'beta' | 'coming-soon';
  features: string[];
  popularity: number;
}

export default function AIHubPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const aiFeatures: AIFeature[] = [
    {
      id: 'comprehensive-calc',
      name: 'حاسبة البناء الشاملة',
      description: 'حاسبة متطورة لحساب تكاليف البناء مع إدارة المشاريع وتتبع المشتريات',
      icon: <Calculator className="w-8 h-8" />,
      href: '/user/comprehensive-construction-calculator',
      category: 'calculator',
      status: 'active',
      features: ['حساب دقيق للمواد', 'تتبع المشتريات', 'حفظ المشاريع', 'تقديرات التكلفة'],
      popularity: 95
    },
    {
      id: 'ai-assistant',
      name: 'المساعد الذكي',
      description: 'مساعد ذكي للإجابة على أسئلة البناء وتقديم المشورة المتخصصة',
      icon: <Bot className="w-8 h-8" />,
      href: '/user/ai-assistant',
      category: 'assistant',
      status: 'active',
      features: ['إجابات فورية', 'مشورة متخصصة', 'محادثات محفوظة', 'دعم مستمر'],
      popularity: 88
    },
    {
      id: 'smart-insights',
      name: 'الرؤى الذكية',
      description: 'تحليلات ذكية واتجاهات السوق لاتخاذ قرارات بناء مدروسة',
      icon: <Lightbulb className="w-8 h-8" />,
      href: '/user/smart-insights',
      category: 'insights',
      status: 'active',
      features: ['تحليل السوق', 'توقعات الأسعار', 'توصيات شخصية', 'تنبيهات ذكية'],
      popularity: 82
    },
    {
      id: 'smart-advisor',
      name: 'مستشار البناء الذكي',
      description: 'مستشار متطور للأفراد والشركات مع تحليلات شاملة وحاسبات متخصصة',
      icon: <Building2 className="w-8 h-8" />,
      href: '/user/smart-construction-advisor',
      category: 'advisor',
      status: 'active',
      features: ['مشاريع الأفراد', 'مشاريع الشركات', 'تحليل المخاطر', 'تحسين التكاليف'],
      popularity: 76
    },
    {
      id: 'individual-calc',
      name: 'حاسبة البيت الفردي',
      description: 'حاسبة متخصصة لبناء البيوت الفردية مع مستويات الجودة والمراحل',
      icon: <Home className="w-8 h-8" />,
      href: '/user/individual-home-calculator',
      category: 'calculator',
      status: 'beta',
      features: ['مراحل البناء', 'مستويات الجودة', 'توصيات ذكية', 'توفير التكاليف'],
      popularity: 71
    }
  ];

  const categories = [
    { id: 'all', name: 'جميع الأدوات', icon: <Grid className="w-4 h-4" /> },
    { id: 'calculator', name: 'الحاسبات', icon: <Calculator className="w-4 h-4" /> },
    { id: 'assistant', name: 'المساعدين', icon: <Bot className="w-4 h-4" /> },
    { id: 'insights', name: 'الرؤى', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'advisor', name: 'المستشارين', icon: <Building2 className="w-4 h-4" /> }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? aiFeatures.sort((a, b) => b.popularity - a.popularity)
    : aiFeatures.filter(feature => feature.category === selectedCategory).sort((a, b) => b.popularity - a.popularity);

  const stats = {
    totalFeatures: aiFeatures.length,
    activeFeatures: aiFeatures.filter(f => f.status === 'active').length,
    betaFeatures: aiFeatures.filter(f => f.status === 'beta').length,
    avgPopularity: Math.round(aiFeatures.reduce((sum, f) => sum + f.popularity, 0) / aiFeatures.length)
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">متاح</Badge>;
      case 'beta':
        return <Badge className="bg-yellow-100 text-yellow-800">تجريبي</Badge>;
      case 'coming-soon':
        return <Badge className="bg-gray-100 text-gray-800">قريباً</Badge>;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'calculator':
        return 'text-blue-600 bg-blue-50';
      case 'assistant':
        return 'text-purple-600 bg-purple-50';
      case 'insights':
        return 'text-amber-600 bg-amber-50';
      case 'advisor':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">مركز الذكاء الاصطناعي</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            مجموعة شاملة من أدوات الذكاء الاصطناعي لمساعدتك في جميع مراحل مشروع البناء
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-blue-600">{stats.totalFeatures}</span>
              </div>
              <p className="text-gray-600">أداة ذكية</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{stats.activeFeatures}</span>
              </div>
              <p className="text-gray-600">أداة متاحة</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">{stats.betaFeatures}</span>
              </div>
              <p className="text-gray-600">أداة تجريبية</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-purple-500" />
                <span className="text-2xl font-bold text-purple-600">{stats.avgPopularity}%</span>
              </div>
              <p className="text-gray-600">متوسط الرضا</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  {category.icon}
                  {category.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredFeatures.map((feature) => (
            <Card key={feature.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${getCategoryColor(feature.category)}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{feature.name}</CardTitle>
                      {getStatusBadge(feature.status)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{feature.popularity}%</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">الميزات الرئيسية:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {feature.features.map((featureItem, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">{featureItem}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link href={feature.href} className="flex-1">
                    <Button 
                      className="w-full"
                      disabled={feature.status === 'coming-soon'}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {feature.status === 'coming-soon' ? 'قريباً' : 'استخدم الآن'}
                        {feature.status !== 'coming-soon' && <ArrowRight className="w-4 h-4" />}
                      </div>
                    </Button>
                  </Link>
                  
                  <Button variant="outline" size="sm" className="px-4">
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              إجراءات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/user/projects/create">
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 w-full">
                  <Building2 className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">إنشاء مشروع جديد</div>
                    <div className="text-sm text-gray-500">ابدأ مشروع واستخدم AI</div>
                  </div>
                </Button>
              </Link>
              
              <Link href="/user/comprehensive-construction-calculator">
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 w-full">
                  <Calculator className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">حاسبة سريعة</div>
                    <div className="text-sm text-gray-500">احسب التكاليف بسرعة</div>
                  </div>
                </Button>
              </Link>
              
              <Link href="/user/ai-assistant">
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 w-full">
                  <MessageSquare className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">اسأل المساعد</div>
                    <div className="text-sm text-gray-500">احصل على إجابات فورية</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              نصائح الاستخدام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">للمبتدئين:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <span>ابدأ بحاسبة البناء الشاملة لتقدير مشروعك</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <span>استخدم المساعد الذكي للإجابة على أسئلتك</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <span>تابع الرؤى الذكية لأحدث اتجاهات السوق</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">للمحترفين:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span>استخدم مستشار البناء الذكي للمشاريع المعقدة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span>ادمج جميع الأدوات مع إدارة المشاريع</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span>تتبع المشتريات والتقدم بدقة</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
