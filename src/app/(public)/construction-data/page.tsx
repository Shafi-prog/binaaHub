'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Badge } from '@/core/shared/components/ui/badge';
import { Progress } from '@/core/shared/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs';
import { ConstructionGuidanceService } from '@/core/services/constructionGuidanceService';
import Link from 'next/link';
import { 
  Building2, 
  Clock, 
  FileText, 
  CheckCircle, 
  Camera,
  Download,
  ExternalLink,
  BookOpen,
  Hammer,
  Shield,
  AlertTriangle,
  Users,
  MapPin,
  Calendar,
  ArrowRight,
  PlayCircle
} from 'lucide-react';

interface ConstructionStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  requirements: string[];
  tips: string[];
  visualGuide?: string;
  officialDocs?: Array<{
    title: string;
    url: string;
    authority: string;
  }>;
}

export default function ConstructionDataPage() {
  const [activePhase, setActivePhase] = useState<string>('planning');
  const [selectedProject, setSelectedProject] = useState<'villa' | 'apartment' | 'commercial'>('villa');

  // Get construction phases from the service
  const phases = ConstructionGuidanceService.getProjectPhases({
    projectType: selectedProject,
    area: 250,
    floors: 2,
    compliance: 'enhanced',
    supervision: 'engineer',
    location: 'الرياض'
  });

  const constructionSteps: Record<string, ConstructionStep[]> = {
    planning: [
      {
        id: 'site_survey',
        title: 'مسح الموقع والدراسة الأولية',
        description: 'تحديد حدود الأرض ودراسة التربة والموقع العام',
        duration: '3-5 أيام',
        difficulty: 'سهل',
        requirements: ['مخططات الأرض', 'هوية المالك', 'عقد الملكية'],
        tips: ['تأكد من وضوح الحدود', 'احفظ إحداثيات GPS للموقع'],
        officialDocs: [
          {
            title: 'دليل مسح الأراضي',
            url: 'https://momah.gov.sa/land-survey-guide',
            authority: 'وزارة الشؤون البلدية'
          }
        ]
      },
      {
        id: 'permits',
        title: 'استخراج رخصة البناء',
        description: 'الحصول على التراخيص اللازمة من الجهات المختصة',
        duration: '15-30 يوم',
        difficulty: 'متوسط',
        requirements: ['صك الملكية', 'مخططات معمارية معتمدة', 'فحص تربة'],
        tips: ['راجع متطلبات أمانة المنطقة', 'تأكد من مطابقة المخططات للكود السعودي'],
        officialDocs: [
          {
            title: 'اشتراطات إنشاء المباني السكنية',
            url: 'https://momah.gov.sa/sites/default/files/2024-07/ashtratat%20a%27nsha%20almbany%20alsknyt%20m%60%20alqrar.pdf',
            authority: 'وزارة الشؤون البلدية والقروية'
          }
        ]
      }
    ],
    excavation: [
      {
        id: 'soil_preparation',
        title: 'تحضير الموقع والحفر',
        description: 'تنظيف الموقع وحفر الأساسات حسب المخططات',
        duration: '5-10 أيام',
        difficulty: 'متوسط',
        requirements: ['معدات حفر', 'مهندس موقع', 'عمال مدربين'],
        tips: ['تأكد من عمق الحفر المطلوب', 'احذر من المرافق تحت الأرض'],
        visualGuide: '/construction-guides/excavation-guide.jpg'
      }
    ],
    structure: [
      {
        id: 'foundation',
        title: 'صب الأساسات',
        description: 'تركيب حديد التسليح وصب خرسانة الأساسات',
        duration: '7-14 يوم',
        difficulty: 'صعب',
        requirements: ['خرسانة جاهزة', 'حديد تسليح معتمد', 'مهندس إشراف'],
        tips: ['تأكد من جودة الخرسانة', 'اتبع معايير المعالجة'],
        officialDocs: [
          {
            title: 'الكود السعودي للبناء - الأساسات',
            url: 'https://sbc.gov.sa/foundation-code',
            authority: 'الهيئة السعودية للمواصفات'
          }
        ]
      }
    ],
    utilities: [
      {
        id: 'electrical_rough',
        title: 'التمديدات الكهربائية الأولية',
        description: 'تمديد الأسلاك والمواسير الكهربائية',
        duration: '10-15 يوم',
        difficulty: 'صعب',
        requirements: ['كهربائي مرخص', 'مواد كهربائية معتمدة'],
        tips: ['اتبع المعايير السعودية للكهرباء', 'استخدم مواد عالية الجودة']
      }
    ],
    finishing: [
      {
        id: 'interior_finishing',
        title: 'التشطيبات الداخلية',
        description: 'الدهان والأرضيات والتشطيبات النهائية',
        duration: '20-30 يوم',
        difficulty: 'متوسط',
        requirements: ['مواد تشطيب', 'فنيين مهرة'],
        tips: ['تأكد من جفاف الجدران', 'استخدم مواد صديقة للبيئة']
      }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'سهل': return 'bg-green-100 text-green-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'صعب': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            دليل خطوات البناء الشامل
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            دليل مفصل لجميع مراحل البناء مع الخطوات العملية والوثائق الرسمية المطلوبة
            حسب المعايير السعودية واللوائح المعتمدة
          </p>
          
          {/* Quick Actions */}
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/auth/register">
              <Button className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4" />
                ابدأ مشروعك الآن
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تحميل الدليل الكامل
            </Button>
          </div>
        </div>

        {/* Project Type Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">اختر نوع المشروع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4">
              {[
                { type: 'villa', title: 'فيلا سكنية', icon: <Building2 className="w-5 h-5" /> },
                { type: 'apartment', title: 'شقة سكنية', icon: <Building2 className="w-5 h-5" /> },
                { type: 'commercial', title: 'مبنى تجاري', icon: <Building2 className="w-5 h-5" /> }
              ].map(({ type, title, icon }) => (
                <Button
                  key={type}
                  variant={selectedProject === type ? 'default' : 'outline'}
                  onClick={() => setSelectedProject(type as any)}
                  className="flex items-center gap-2"
                >
                  {icon}
                  {title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Construction Timeline Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              الجدول الزمني للمشروع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {phases.map((phase, index) => (
                <div 
                  key={phase.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    activePhase === phase.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setActivePhase(phase.id)}
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                      {index + 1}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{phase.name}</h4>
                    <p className="text-xs text-gray-500">{phase.duration} يوم</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hammer className="w-5 h-5" />
                  خطوات المرحلة التفصيلية
                </CardTitle>
                <p className="text-sm text-gray-600">
                  المرحلة الحالية: {phases.find(p => p.id === activePhase)?.name}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {constructionSteps[activePhase]?.map((step, index) => (
                    <div key={step.id} className="border rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{step.title}</h3>
                            <Badge className={getDifficultyColor(step.difficulty)}>
                              {step.difficulty}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {step.duration}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{step.description}</p>

                          {/* Requirements */}
                          <div className="mb-4">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              المتطلبات
                            </h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {step.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Tips */}
                          <div className="mb-4">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              نصائح مهمة
                            </h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {step.tips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Official Documents */}
                          {step.officialDocs && (
                            <div className="mb-4">
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-500" />
                                المراجع الرسمية
                              </h4>
                              <div className="space-y-2">
                                {step.officialDocs.map((doc, i) => (
                                  <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                    <div>
                                      <p className="font-medium text-sm">{doc.title}</p>
                                      <p className="text-xs text-gray-500">{doc.authority}</p>
                                    </div>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="outline">
                                        <ExternalLink className="w-3 h-3" />
                                      </Button>
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Visual Guide */}
                          {step.visualGuide && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Camera className="w-4 h-4 text-blue-500" />
                                <span className="font-medium text-blue-800">دليل مصور</span>
                              </div>
                              <p className="text-sm text-blue-700">
                                يتوفر دليل مصور مفصل لهذه الخطوة مع أمثلة عملية
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>قريباً: دليل مفصل لهذه المرحلة</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Phase Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">تقدم المراحل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {phases.map((phase) => (
                    <div key={phase.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{phase.name}</span>
                        <span className="text-xs text-gray-500">{phase.duration} يوم</span>
                      </div>
                      <Progress 
                        value={activePhase === phase.id ? 50 : 0} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">روابط مفيدة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link 
                  href="/user/building-advice" 
                  className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">نصائح البناء التفاعلية</span>
                </Link>
                
                <Link 
                  href="/user/smart-construction-advisor" 
                  className="flex items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm">المستشار الذكي</span>
                </Link>
                
                <Link 
                  href="/(public)/projects" 
                  className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">مشاريع تطبيقية</span>
                </Link>
              </CardContent>
            </Card>

            {/* Contact Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">تحتاج مساعدة؟</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>استشارة هندسية مجانية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-500" />
                    <span>خبراء البناء المعتمدين</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    <span>مراجعة المخططات</span>
                  </div>
                  <Button className="w-full mt-4" size="sm">
                    تواصل معنا
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


