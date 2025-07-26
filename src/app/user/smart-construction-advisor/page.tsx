'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Textarea } from '@/core/shared/components/ui/textarea';
import { Badge } from '@/core/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs';
import { 
  Bot, 
  Calculator, 
  Home, 
  Building2, 
  Lightbulb, 
  TrendingUp, 
  Shield, 
  Leaf, 
  Camera,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Truck,
  ClipboardCheck,
  BarChart3,
  Settings,
  ChevronLeft
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface AIRecommendation {
  id: string;
  type: 'cost' | 'material' | 'timeline' | 'quality' | 'weather';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  savings?: number;
  implementation: string;
}

interface ProjectScenario {
  id: string;
  name: string;
  type: 'individual' | 'company';
  details: {
    area: number;
    floors: number;
    budget: number;
    timeline: number;
    location: string;
    projectCount?: number; // For companies
  };
}

export default function SmartConstructionAdvisor() {
  const [activeTab, setActiveTab] = useState('individual');
  const [userType, setUserType] = useState<'individual' | 'company'>('individual');
  const [currentProject, setCurrentProject] = useState<ProjectScenario | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // AI-powered recommendations based on project type
  const generateRecommendations = async (project: ProjectScenario) => {
    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const individualRecommendations: AIRecommendation[] = [
      {
        id: 'rec1',
        type: 'cost',
        title: 'تحسين تكلفة المواد',
        description: `بناءً على مساحة ${project.details.area}م²، يمكنك توفير 15% من تكلفة المواد عبر الشراء المجمع`,
        priority: 'high',
        savings: Math.floor(project.details.budget * 0.15),
        implementation: 'انضم إلى مجموعة الشراء المحلية أو اشترِ كميات كبيرة مع الجيران'
      },
      {
        id: 'rec2',
        type: 'quality',
        title: 'معايير الجودة السعودية',
        description: 'تأكد من مطابقة جميع المواد لمعايير الهيئة السعودية للمواصفات والمقاييس',
        priority: 'high',
        implementation: 'اطلب شهادات الجودة من جميع الموردين وتحقق من أرقام المطابقة'
      },
      {
        id: 'rec3',
        type: 'timeline',
        title: 'تحسين الجدول الزمني',
        description: `يمكن تقليل مدة البناء من ${project.details.timeline} شهر إلى ${project.details.timeline - 2} شهر`,
        priority: 'medium',
        implementation: 'استخدم تقنية البناء السريع والمواد الجاهزة للتسريع'
      },
      {
        id: 'rec4',
        type: 'weather',
        title: 'تخطيط حسب الطقس',
        description: 'تجنب أعمال الخرسانة في الأشهر الحارة وخطط للمراحل الداخلية صيفاً',
        priority: 'medium',
        implementation: 'ابدأ الأساسات في أكتوبر-نوفمبر، والتشطيبات في يونيو-أغسطس'
      }
    ];

    const companyRecommendations: AIRecommendation[] = [
      {
        id: 'comp1',
        type: 'cost',
        title: 'تحسين الشراء المجمع',
        description: `لـ ${project.details.projectCount} مشروع، يمكن توفير 25% من تكلفة المواد`,
        priority: 'high',
        savings: Math.floor(project.details.budget * project.details.projectCount! * 0.25),
        implementation: 'أنشئ اتفاقيات شراء طويلة المدى مع الموردين الرئيسيين'
      },
      {
        id: 'comp2',
        type: 'material',
        title: 'تنسيق المواد بين المشاريع',
        description: 'استخدم نفس المواد والمواصفات عبر المشاريع لتحقيق وفورات الحجم',
        priority: 'high',
        implementation: 'وحّد قوائم المواد وشراء بكميات كبيرة موزعة على المشاريع'
      },
      {
        id: 'comp3',
        type: 'timeline',
        title: 'تحسين توزيع الموارد',
        description: 'حسّن استخدام الفرق والمعدات عبر تداخل المشاريع الزمني',
        priority: 'medium',
        implementation: 'استخدم نظام إدارة المشاريع لتتبع الموارد والجدولة الذكية'
      },
      {
        id: 'comp4',
        type: 'quality',
        title: 'نظام ضمان الجودة الموحد',
        description: 'طبق معايير جودة موحدة عبر جميع المشاريع لضمان السمعة',
        priority: 'high',
        implementation: 'أنشئ قوائم فحص قياسية ونظام تقييم موحد للمقاولين'
      }
    ];

    setRecommendations(project.type === 'individual' ? individualRecommendations : companyRecommendations);
    setLoading(false);
  };

  const handleProjectAnalysis = () => {
    if (userType === 'individual') {
      const project: ProjectScenario = {
        id: 'proj1',
        name: 'فيلا سكنية',
        type: 'individual',
        details: {
          area: 300,
          floors: 2,
          budget: 500000,
          timeline: 12,
          location: 'الرياض'
        }
      };
      setCurrentProject(project);
      generateRecommendations(project);
    } else {
      const project: ProjectScenario = {
        id: 'comp1',
        name: 'مجمع سكني',
        type: 'company',
        details: {
          area: 200,
          floors: 2,
          budget: 400000,
          timeline: 8,
          location: 'جدة',
          projectCount: 5
        }
      };
      setCurrentProject(project);
      generateRecommendations(project);
    }
  };

  const handleChatSubmit = () => {
    // Simulate AI response
    setChatInput('');
    // Add chat functionality here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6" dir="rtl">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <Link href="/user/dashboard" className="hover:text-blue-600 transition-colors">
            لوحة التحكم
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href="/user/projects" className="hover:text-blue-600 transition-colors">
            المشاريع
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-gray-900 font-medium">المستشار الذكي</span>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">المستشار الذكي للبناء</h1>
          </div>
          <p className="text-xl text-gray-600">
            نظام ذكي متقدم لمساعدة الأفراد وشركات البناء في اتخاذ أفضل القرارات
          </p>
        </div>

        {/* User Type Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={userType === 'individual' ? 'default' : 'outline'}
            onClick={() => setUserType('individual')}
            className="flex items-center gap-2 px-6 py-3"
          >
            <Home className="w-5 h-5" />
            أفراد - بناء منزل
          </Button>
          <Button
            variant={userType === 'company' ? 'default' : 'outline'}
            onClick={() => setUserType('company')}
            className="flex items-center gap-2 px-6 py-3"
          >
            <Building2 className="w-5 h-5" />
            شركات - مشاريع متعددة
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              تحليل المشروع
            </TabsTrigger>
            <TabsTrigger value="calculators" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              الحاسبات الذكية
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              المحادثة الذكية
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              أدوات متقدمة
            </TabsTrigger>
          </TabsList>

          {/* Project Analysis Tab */}
          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {userType === 'individual' ? 'تفاصيل منزلك' : 'تفاصيل مشاريعك'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userType === 'individual' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">مساحة الأرض (م²)</label>
                        <Input placeholder="300" defaultValue="300" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">عدد الأدوار</label>
                        <Input placeholder="2" defaultValue="2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">الميزانية (ر.س)</label>
                        <Input placeholder="500000" defaultValue="500000" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">المدة المطلوبة (شهر)</label>
                        <Input placeholder="12" defaultValue="12" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">عدد المشاريع</label>
                        <Input placeholder="5" defaultValue="5" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">متوسط مساحة الوحدة (م²)</label>
                        <Input placeholder="200" defaultValue="200" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">ميزانية كل وحدة (ر.س)</label>
                        <Input placeholder="400000" defaultValue="400000" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">الجدول الزمني (شهر)</label>
                        <Input placeholder="8" defaultValue="8" />
                      </div>
                    </>
                  )}
                  
                  <Button 
                    onClick={handleProjectAnalysis}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'جاري التحليل...' : 'احصل على التوصيات الذكية'}
                  </Button>
                </CardContent>
              </Card>

              {/* AI Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    التوصيات الذكية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : recommendations.length > 0 ? (
                    <div className="space-y-4">
                      {recommendations.map((rec) => (
                        <div key={rec.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-lg">{rec.title}</h4>
                            <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                              {rec.priority === 'high' ? 'عالي' : rec.priority === 'medium' ? 'متوسط' : 'منخفض'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{rec.description}</p>
                          {rec.savings && (
                            <div className="bg-green-50 border border-green-200 rounded p-2 mb-3">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-green-700 font-semibold">
                                  توفير متوقع: {rec.savings.toLocaleString('en-US')} ر.س
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="bg-blue-50 border border-blue-200 rounded p-2">
                            <h5 className="font-medium text-blue-900 mb-1">كيفية التطبيق:</h5>
                            <p className="text-blue-700 text-sm">{rec.implementation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      أدخل تفاصيل مشروعك للحصول على توصيات ذكية مخصصة
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Smart Calculators Tab */}
          <TabsContent value="calculators">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Calculator className="w-8 h-8" />,
                  title: 'حاسبة التكلفة الشاملة',
                  description: 'احسب التكلفة الإجمالية بدقة عالية شاملة المواد والعمالة',
                  features: ['تقدير دقيق للمواد', 'حساب تكلفة العمالة', 'إضافة الهامش الاحتياطي']
                },
                {
                  icon: <Home className="w-8 h-8" />,
                  title: 'مخطط المساحات الذكي',
                  description: 'تحسين توزيع المساحات داخل المنزل باستخدام الذكاء الاصطناعي',
                  features: ['تحسين التصميم', 'استغلال أمثل للمساحة', 'مراعاة الخصوصية']
                },
                {
                  icon: <Leaf className="w-8 h-8" />,
                  title: 'حاسبة كفاءة الطاقة',
                  description: 'احسب توفير الطاقة والتكلفة طويلة المدى',
                  features: ['عزل حراري', 'أنظمة التبريد', 'الطاقة الشمسية']
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: 'مدقق معايير الجودة',
                  description: 'تحقق من مطابقة مشروعك لمعايير الجودة السعودية',
                  features: ['كود البناء السعودي', 'معايير السلامة', 'شهادات الجودة']
                },
                {
                  icon: <Calendar className="w-8 h-8" />,
                  title: 'منسق الجدول الزمني',
                  description: 'خطط مراحل البناء بناءً على الطقس والموارد المتاحة',
                  features: ['تخطيط حسب الطقس', 'تنسيق الفرق', 'تتبع التقدم']
                },
                {
                  icon: <Truck className="w-8 h-8" />,
                  title: 'محسن الشراء المجمع',
                  description: 'احصل على أفضل العروض للمواد والخدمات',
                  features: ['مقارنة الأسعار', 'عروض الكمية', 'توقيت الشراء']
                }
              ].map((calc, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {calc.icon}
                      </div>
                      <CardTitle className="text-lg">{calc.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{calc.description}</p>
                    <div className="space-y-2">
                      {calc.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline" onClick={() => alert('Button clicked')}>
                      ابدأ الحساب
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="chat">
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  اسأل الخبير الذكي
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">المستشار الذكي</span>
                      </div>
                      <p className="text-gray-700">
                        مرحباً! أنا هنا لمساعدتك في جميع أسئلة البناء والتشييد. 
                        يمكنني مساعدتك في:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600">
                        <li>• تقدير التكاليف وحساب المواد</li>
                        <li>• اختيار أفضل المواد والتقنيات</li>
                        <li>• تخطيط الجدول الزمني للبناء</li>
                        <li>• معايير الجودة والسلامة</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="اكتب سؤالك هنا..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                  />
                  <Button onClick={handleChatSubmit}>إرسال</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tools Tab */}
          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    مراقب التقدم بالذكاء الاصطناعي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    ارفع صور من موقع البناء ودع الذكاء الاصطناعي يحلل التقدم ويكشف المشاكل
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">اسحب الصور هنا أو اضغط للرفع</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    خريطة الموردين الذكية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    اعثر على أقرب الموردين وأفضل الأسعار في منطقتك
                  </p>
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">خريطة تفاعلية للموردين</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
