'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Badge } from '@/core/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs';
import Link from 'next/link';
import { 
  BookOpen, 
  FileText, 
  ExternalLink, 
  Download, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Building2,
  Hammer,
  Calculator,
  Users,
  Phone,
  MapPin,
  Star
} from 'lucide-react';

interface ConstructionResource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'regulation' | 'checklist' | 'calculator' | 'contact';
  category: string;
  url?: string;
  downloadUrl?: string;
  authority?: string;
  importance: 'high' | 'medium' | 'low';
  lastUpdated: string;
}

export default function ConstructionProfileAdvice() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const resources: ConstructionResource[] = [
    {
      id: 'momah_residential',
      title: 'اشتراطات إنشاء المباني السكنية',
      description: 'الدليل الرسمي لمتطلبات البناء السكني من وزارة الشؤون البلدية والقروية',
      type: 'regulation',
      category: 'تراخيص وموافقات',
      url: 'https://momah.gov.sa/sites/default/files/2024-07/ashtratat%20a%27nsha%20almbany%20alsknyt%20m%60%20alqrar.pdf',
      downloadUrl: 'https://momah.gov.sa/sites/default/files/2024-07/ashtratat%20a%27nsha%20almbany%20alsknyt%20m%60%20alqrar.pdf',
      authority: 'وزارة الشؤون البلدية والقروية',
      importance: 'high',
      lastUpdated: '2024-07-01'
    },
    {
      id: 'sbc_2024',
      title: 'الكود السعودي للبناء SBC 201-2024',
      description: 'الكود السعودي للبناء المحدث لعام 2024 - المواصفات الفنية والإنشائية',
      type: 'regulation',
      category: 'مواصفات فنية',
      url: 'https://sbc.gov.sa/ar/BC/Documents/tableofcontent2024/SBC%20201/SBC201_AR2024.pdf',
      downloadUrl: 'https://sbc.gov.sa/ar/BC/Documents/tableofcontent2024/SBC%20201/SBC201_AR2024.pdf',
      authority: 'الهيئة السعودية للمواصفات والمقاييس والجودة',
      importance: 'high',
      lastUpdated: '2024-01-01'
    },
    {
      id: 'building_permit_guide',
      title: 'دليل الحصول على رخصة البناء',
      description: 'خطوات مفصلة للحصول على رخصة البناء والمستندات المطلوبة',
      type: 'guide',
      category: 'تراخيص وموافقات',
      authority: 'أمانات المناطق',
      importance: 'high',
      lastUpdated: '2024-06-01'
    },
    {
      id: 'construction_phases',
      title: 'مراحل البناء الأساسية',
      description: 'دليل شامل لمراحل البناء من الأساسات إلى التشطيبات النهائية',
      type: 'guide',
      category: 'مراحل البناء',
      importance: 'medium',
      lastUpdated: '2024-05-15'
    },
    {
      id: 'material_quality',
      title: 'معايير جودة مواد البناء',
      description: 'كيفية اختيار مواد البناء عالية الجودة والتأكد من مطابقتها للمعايير',
      type: 'guide',
      category: 'مواد البناء',
      importance: 'medium',
      lastUpdated: '2024-04-20'
    },
    {
      id: 'cost_calculator',
      title: 'حاسبة تكاليف البناء المتقدمة',
      description: 'احسب تكاليف مشروعك بدقة مع إدارة المشتريات والتتبع',
      type: 'calculator',
      category: 'أدوات مساعدة',
      url: '/user/comprehensive-construction-calculator',
      importance: 'high',
      lastUpdated: '2024-07-20'
    },
    {
      id: 'safety_checklist',
      title: 'قائمة مراجعة السلامة',
      description: 'قائمة شاملة لنقاط السلامة المطلوبة في موقع البناء',
      type: 'checklist',
      category: 'السلامة والأمان',
      importance: 'high',
      lastUpdated: '2024-03-10'
    },
    {
      id: 'civil_defense',
      title: 'الدفاع المدني - متطلبات السلامة',
      description: 'اتصل بالدفاع المدني للحصول على موافقة السلامة',
      type: 'contact',
      category: 'جهات الاتصال',
      importance: 'high',
      lastUpdated: '2024-01-01'
    }
  ];

  const categories = [
    { id: 'all', name: 'جميع الموارد', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'تراخيص وموافقات', name: 'التراخيص', icon: <FileText className="w-4 h-4" /> },
    { id: 'مواصفات فنية', name: 'المواصفات', icon: <Shield className="w-4 h-4" /> },
    { id: 'مراحل البناء', name: 'المراحل', icon: <Hammer className="w-4 h-4" /> },
    { id: 'أدوات مساعدة', name: 'الأدوات', icon: <Calculator className="w-4 h-4" /> },
    { id: 'جهات الاتصال', name: 'الاتصالات', icon: <Phone className="w-4 h-4" /> }
  ];

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'regulation': return <Shield className="w-5 h-5" />;
      case 'guide': return <BookOpen className="w-5 h-5" />;
      case 'checklist': return <CheckCircle className="w-5 h-5" />;
      case 'calculator': return <Calculator className="w-5 h-5" />;
      case 'contact': return <Phone className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high': return <Badge className="bg-red-100 text-red-800">أساسي</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">مهم</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">إضافي</Badge>;
      default: return null;
    }
  };

  const quickTips = [
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      title: 'احصل على الرخصة أولاً',
      description: 'لا تبدأ أي أعمال بناء قبل الحصول على رخصة البناء'
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-500" />,
      title: 'تأكد من المواصفات',
      description: 'استخدم مواد معتمدة ومطابقة للكود السعودي للبناء'
    },
    {
      icon: <Users className="w-5 h-5 text-green-500" />,
      title: 'استعن بالخبراء',
      description: 'اعمل مع مهندسين ومقاولين مرخصين ومعتمدين'
    },
    {
      icon: <Calculator className="w-5 h-5 text-purple-500" />,
      title: 'خطط للميزانية',
      description: 'احسب التكاليف بدقة واحتفظ بهامش للطوارئ'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            دليل البناء والموارد المفيدة
          </CardTitle>
          <p className="text-gray-600">
            مجموعة شاملة من المراجع والأدلة الرسمية لمساعدتك في مشروع البناء
          </p>
        </CardHeader>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            نصائح سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                {tip.icon}
                <div>
                  <h4 className="font-medium text-sm">{tip.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
                size="sm"
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    {getTypeIcon(resource.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    {resource.authority && (
                      <p className="text-sm text-gray-500">{resource.authority}</p>
                    )}
                  </div>
                </div>
                {getImportanceBadge(resource.importance)}
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                {resource.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {resource.category}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    محدث: {new Date(resource.lastUpdated).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {resource.url && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(resource.url, '_blank')}
                      className="flex items-center gap-1"
                    >
                      {resource.type === 'calculator' ? (
                        <Calculator className="w-3 h-3" />
                      ) : (
                        <ExternalLink className="w-3 h-3" />
                      )}
                      {resource.type === 'calculator' ? 'استخدم' : 'عرض'}
                    </Button>
                  )}
                  
                  {resource.downloadUrl && (
                    <Button 
                      size="sm"
                      onClick={() => window.open(resource.downloadUrl, '_blank')}
                      className="flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      تحميل
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Official Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            روابط رسمية مهمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="https://momah.gov.sa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building2 className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-medium">وزارة الشؤون البلدية</h4>
                <p className="text-sm text-gray-600">التراخيص والموافقات</p>
              </div>
            </a>
            
            <a 
              href="https://sbc.gov.sa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Shield className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium">الكود السعودي للبناء</h4>
                <p className="text-sm text-gray-600">المواصفات والمعايير</p>
              </div>
            </a>
            
            <a 
              href="https://www.998.gov.sa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-6 h-6 text-red-600" />
              <div>
                <h4 className="font-medium">الدفاع المدني</h4>
                <p className="text-sm text-gray-600">السلامة والأمان</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
