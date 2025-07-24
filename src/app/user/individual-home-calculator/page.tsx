'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Select } from '@/core/shared/components/ui/select';
import { Textarea } from '@/core/shared/components/ui/textarea';
import { Badge } from '@/core/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs';
import { Progress } from '@/core/shared/components/ui/progress';
import { 
  Home, 
  Calculator, 
  PiggyBank, 
  Lightbulb, 
  TrendingUp,
  Shield,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  Target,
  Users,
  Zap,
  Leaf
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface BuildingPhase {
  id: string;
  name: string;
  description: string;
  percentage: number;
  estimatedCost: number;
  duration: number;
  materials: string[];
  tips: string[];
}

interface QualityLevel {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
  features: string[];
  warranty: string;
}

interface SmartRecommendation {
  type: 'cost' | 'quality' | 'timing' | 'sustainability';
  title: string;
  description: string;
  impact: string;
  savings?: number;
  icon: React.ReactNode;
}

export default function IndividualHomeCalculator() {
  const [homeArea, setHomeArea] = useState<number>(200);
  const [rooms, setRooms] = useState<number>(4);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [floors, setFloors] = useState<number>(1);
  const [qualityLevel, setQualityLevel] = useState<string>('standard');
  const [budget, setBudget] = useState<number>(500000);
  const [timeline, setTimeline] = useState<number>(12);
  const [location, setLocation] = useState<string>('riyadh');
  const [hasSolarPanels, setHasSolarPanels] = useState<boolean>(false);
  const [hasGarden, setHasGarden] = useState<boolean>(false);
  const [hasSwimmingPool, setHasSwimmingPool] = useState<boolean>(false);

  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [buildingPhases, setBuildingPhases] = useState<BuildingPhase[]>([]);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const qualityLevels: QualityLevel[] = [
    {
      id: 'basic',
      name: 'أساسي',
      description: 'مواد أساسية بجودة مقبولة',
      priceMultiplier: 0.8,
      features: ['مواد محلية', 'تشطيبات بسيطة', 'عزل أساسي'],
      warranty: 'سنة واحدة'
    },
    {
      id: 'standard',
      name: 'قياسي',
      description: 'مواد جيدة مع تشطيبات متوسطة',
      priceMultiplier: 1.0,
      features: ['مواد جيدة الجودة', 'تشطيبات عصرية', 'عزل حراري ومائي'],
      warranty: 'سنتان'
    },
    {
      id: 'premium',
      name: 'ممتاز',
      description: 'مواد عالية الجودة مع تشطيبات فاخرة',
      priceMultiplier: 1.4,
      features: ['مواد مستوردة', 'تشطيبات فاخرة', 'أنظمة ذكية', 'عزل متقدم'],
      warranty: 'خمس سنوات'
    },
    {
      id: 'luxury',
      name: 'فاخر',
      description: 'أرقى المواد والتشطيبات',
      priceMultiplier: 2.0,
      features: ['مواد فاخرة حصرية', 'تقنيات متقدمة', 'تصميم مخصص', 'ضمان شامل'],
      warranty: 'عشر سنوات'
    }
  ];

  const calculateEstimate = async () => {
    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedQuality = qualityLevels.find(q => q.id === qualityLevel) || qualityLevels[1];
    
    // Base cost calculation (per square meter)
    let baseCostPerSqm = 1200; // SAR per square meter
    
    // Location multiplier
    const locationMultipliers: { [key: string]: number } = {
      'riyadh': 1.0,
      'jeddah': 1.1,
      'dammam': 0.95,
      'mecca': 1.05,
      'medina': 1.05,
      'other': 0.9
    };
    
    baseCostPerSqm *= locationMultipliers[location] || 1.0;
    
    // Quality multiplier
    baseCostPerSqm *= selectedQuality.priceMultiplier;
    
    // Additional features
    let additionalCosts = 0;
    if (hasSolarPanels) additionalCosts += homeArea * 150; // 150 SAR per sqm for solar
    if (hasGarden) additionalCosts += 25000; // Fixed cost for garden
    if (hasSwimmingPool) additionalCosts += 80000; // Fixed cost for pool
    
    // Complexity multiplier based on rooms and bathrooms
    const complexityMultiplier = 1 + ((rooms + bathrooms - 5) * 0.05);
    
    const totalCost = (homeArea * baseCostPerSqm * complexityMultiplier) + additionalCosts;
    
    setEstimatedCost(totalCost);
    
    // Generate building phases
    const phases: BuildingPhase[] = [
      {
        id: 'foundation',
        name: 'الأساسات والخرسانة',
        description: 'حفر الأساسات وصب الخرسانة المسلحة',
        percentage: 25,
        estimatedCost: totalCost * 0.25,
        duration: Math.ceil(timeline * 0.2),
        materials: ['أسمنت', 'حديد التسليح', 'رمل', 'حصى'],
        tips: ['تأكد من جودة الخرسانة', 'اهتم بالعزل المائي للأساسات']
      },
      {
        id: 'structure',
        name: 'الهيكل الإنشائي',
        description: 'بناء الجدران والأعمدة والأسقف',
        percentage: 30,
        estimatedCost: totalCost * 0.30,
        duration: Math.ceil(timeline * 0.35),
        materials: ['بلوك خرساني', 'أسمنت', 'حديد التسليح'],
        tips: ['راجع المخططات بعناية', 'تأكد من دقة القياسات']
      },
      {
        id: 'utilities',
        name: 'الخدمات والمرافق',
        description: 'التمديدات الكهربائية والصحية والتكييف',
        percentage: 20,
        estimatedCost: totalCost * 0.20,
        duration: Math.ceil(timeline * 0.25),
        materials: ['أسلاك كهربائية', 'مواسير', 'وحدات تكييف'],
        tips: ['خطط للتوسعات المستقبلية', 'استخدم مواد عالية الجودة']
      },
      {
        id: 'finishing',
        name: 'التشطيبات',
        description: 'الدهانات والبلاط والأبواب والنوافذ',
        percentage: 25,
        estimatedCost: totalCost * 0.25,
        duration: Math.ceil(timeline * 0.2),
        materials: ['بلاط', 'دهانات', 'أبواب', 'نوافذ'],
        tips: ['اختر ألوان متناسقة', 'استثمر في جودة التشطيبات']
      }
    ];
    
    setBuildingPhases(phases);
    
    // Generate smart recommendations
    const smartRecommendations: SmartRecommendation[] = [];
    
    // Cost recommendations
    if (totalCost > budget * 1.1) {
      smartRecommendations.push({
        type: 'cost',
        title: 'تجاوز الميزانية',
        description: 'التكلفة المقدرة تتجاوز ميزانيتك. يمكنك تقليل المساحة أو تغيير مستوى الجودة.',
        impact: `توفير ${(totalCost - budget).toLocaleString('en-US')} ر.س`,
        savings: totalCost - budget,
        icon: <AlertCircle className="w-5 h-5 text-orange-600" />
      });
    }
    
    // Quality recommendations
    if (qualityLevel === 'basic' && budget > totalCost * 1.2) {
      smartRecommendations.push({
        type: 'quality',
        title: 'ترقية الجودة',
        description: 'ميزانيتك تسمح بترقية مستوى الجودة للحصول على منزل أفضل وأطول عمراً.',
        impact: 'زيادة القيمة والمتانة',
        icon: <Award className="w-5 h-5 text-blue-600" />
      });
    }
    
    // Timing recommendations
    if (timeline < 8) {
      smartRecommendations.push({
        type: 'timing',
        title: 'الجدول الزمني ضيق',
        description: 'المدة المحددة قصيرة قد تؤثر على الجودة. ننصح بإضافة 3-4 أشهر إضافية.',
        impact: 'ضمان جودة البناء',
        icon: <Clock className="w-5 h-5 text-red-600" />
      });
    }
    
    // Sustainability recommendations
    if (!hasSolarPanels && homeArea > 150) {
      smartRecommendations.push({
        type: 'sustainability',
        title: 'الطاقة الشمسية',
        description: 'إضافة ألواح شمسية يمكن أن توفر 40-60% من فاتورة الكهرباء سنوياً.',
        impact: 'توفير 3000-5000 ر.س سنوياً',
        savings: 4000,
        icon: <Leaf className="w-5 h-5 text-green-600" />
      });
    }
    
    setRecommendations(smartRecommendations);
    setLoading(false);
  };

  useEffect(() => {
    if (homeArea > 0) {
      calculateEstimate();
    }
  }, [homeArea, rooms, bathrooms, floors, qualityLevel, hasSolarPanels, hasGarden, hasSwimmingPool, location]);

  const budgetVariance = budget > 0 ? ((estimatedCost - budget) / budget) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6" dir="rtl">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Home className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">حاسبة المنزل الذكية</h1>
          </div>
          <p className="text-xl text-gray-600">
            احسب تكلفة بناء منزلك بدقة واحصل على توصيات ذكية لتحسين الجودة والتوفير
          </p>
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              الحاسبة
            </TabsTrigger>
            <TabsTrigger value="phases" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              مراحل البناء
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              التوصيات الذكية
            </TabsTrigger>
            <TabsTrigger value="quality" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              مستويات الجودة
            </TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Section */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>مواصفات المنزل</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">المساحة (متر مربع)</label>
                      <Input 
                        type="number" 
                        value={homeArea} 
                        onChange={(e) => setHomeArea(Number(e.target.value))}
                        placeholder="مثال: 200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">عدد الغرف</label>
                      <Input 
                        type="number" 
                        value={rooms} 
                        onChange={(e) => setRooms(Number(e.target.value))}
                        placeholder="مثال: 4"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">عدد دورات المياه</label>
                      <Input 
                        type="number" 
                        value={bathrooms} 
                        onChange={(e) => setBathrooms(Number(e.target.value))}
                        placeholder="مثال: 3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">عدد الأدوار</label>
                      <Select 
                        value={floors.toString()} 
                        onChange={(e) => setFloors(Number(e.target.value))}
                        options={[
                          { value: "1", label: "دور واحد" },
                          { value: "2", label: "دورين" },
                          { value: "3", label: "ثلاثة أدوار" }
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الموقع</label>
                      <Select 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)}
                        options={[
                          { value: "riyadh", label: "الرياض" },
                          { value: "jeddah", label: "جدة" },
                          { value: "dammam", label: "الدمام" },
                          { value: "mecca", label: "مكة" },
                          { value: "medina", label: "المدينة" },
                          { value: "other", label: "أخرى" }
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">مستوى الجودة</label>
                      <Select 
                        value={qualityLevel} 
                        onChange={(e) => setQualityLevel(e.target.value)}
                        options={qualityLevels.map(level => ({
                          value: level.id,
                          label: `${level.name} - ${level.description}`
                        }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>الميزانية والجدول الزمني</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">الميزانية المتاحة (ريال سعودي)</label>
                      <Input 
                        type="number" 
                        value={budget} 
                        onChange={(e) => setBudget(Number(e.target.value))}
                        placeholder="مثال: 500000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">المدة المرغوبة (شهر)</label>
                      <Input 
                        type="number" 
                        value={timeline} 
                        onChange={(e) => setTimeline(Number(e.target.value))}
                        placeholder="مثال: 12"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>إضافات اختيارية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={hasSolarPanels} 
                        onChange={(e) => setHasSolarPanels(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span>ألواح الطاقة الشمسية</span>
                      <Badge variant="secondary">توفير في الكهرباء</Badge>
                    </label>
                    
                    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={hasGarden} 
                        onChange={(e) => setHasGarden(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span>حديقة منزلية</span>
                      <Badge variant="secondary">25,000 ر.س</Badge>
                    </label>
                    
                    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={hasSwimmingPool} 
                        onChange={(e) => setHasSwimmingPool(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span>مسبح</span>
                      <Badge variant="secondary">80,000 ر.س</Badge>
                    </label>
                  </CardContent>
                </Card>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-blue-500 to-green-600 text-white">
                  <CardContent className="p-6">
                    {loading ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                        <div>جاري الحساب...</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-sm opacity-90 mb-2">التكلفة المقدرة</div>
                        <div className="text-3xl font-bold mb-4">
                          {estimatedCost.toLocaleString('en-US')} ر.س
                        </div>
                        <div className="text-sm opacity-90">
                          {(estimatedCost / homeArea).toFixed(0)} ر.س للمتر المربع
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      مقارنة الميزانية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>الميزانية المتاحة:</span>
                        <span className="font-semibold">{budget.toLocaleString('en-US')} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span>التكلفة المقدرة:</span>
                        <span className="font-semibold">{estimatedCost.toLocaleString('en-US')} ر.س</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>الفرق:</span>
                          <span className={`font-semibold ${budgetVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {budgetVariance > 0 ? '+' : ''}{budgetVariance.toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={Math.min((estimatedCost / budget) * 100, 100)} 
                          className="h-2"
                        />
                      </div>
                      {budgetVariance > 10 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-red-800">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">تجاوز الميزانية</span>
                          </div>
                        </div>
                      )}
                      {budgetVariance < -10 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">في نطاق الميزانية</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ملخص سريع</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>المساحة الإجمالية:</span>
                        <span>{homeArea} م²</span>
                      </div>
                      <div className="flex justify-between">
                        <span>إجمالي الغرف:</span>
                        <span>{rooms + bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مستوى الجودة:</span>
                        <span>{qualityLevels.find(q => q.id === qualityLevel)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>المدة المقدرة:</span>
                        <span>{timeline} شهر</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Building Phases Tab */}
          <TabsContent value="phases">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {buildingPhases.map((phase, index) => (
                <Card key={phase.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        {phase.name}
                      </CardTitle>
                      <Badge variant="outline">{phase.percentage}%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">{phase.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">التكلفة:</span>
                          <div className="font-semibold text-green-600">
                            {phase.estimatedCost.toLocaleString('en-US')} ر.س
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">المدة:</span>
                          <div className="font-semibold text-blue-600">
                            {phase.duration} شهر
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-600 font-medium">المواد الرئيسية:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {phase.materials.map((material, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <span className="text-sm font-medium text-blue-800">نصائح مهمة:</span>
                        <ul className="text-sm text-blue-700 mt-1 space-y-1">
                          {phase.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-blue-500">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Smart Recommendations Tab */}
          <TabsContent value="recommendations">
            <div className="space-y-6">
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.map((rec, index) => (
                    <Card key={index} className={`border-l-4 ${
                      rec.type === 'cost' ? 'border-l-orange-500' :
                      rec.type === 'quality' ? 'border-l-blue-500' :
                      rec.type === 'timing' ? 'border-l-red-500' :
                      'border-l-green-500'
                    }`}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {rec.icon}
                          {rec.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-3">{rec.description}</p>
                        <div className={`p-3 rounded-lg ${
                          rec.type === 'cost' ? 'bg-orange-50' :
                          rec.type === 'quality' ? 'bg-blue-50' :
                          rec.type === 'timing' ? 'bg-red-50' :
                          'bg-green-50'
                        }`}>
                          <span className="font-medium">التأثير: </span>
                          <span>{rec.impact}</span>
                          {rec.savings && (
                            <div className="text-green-600 font-semibold mt-1">
                              وفورات محتملة: {rec.savings.toLocaleString('en-US')} ر.س
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      لا توجد توصيات حالياً
                    </h3>
                    <p className="text-gray-500">
                      سيتم عرض التوصيات الذكية هنا بناءً على مواصفات منزلك
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Quality Levels Tab */}
          <TabsContent value="quality">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {qualityLevels.map(level => (
                <Card 
                  key={level.id} 
                  className={`cursor-pointer transition-all ${
                    qualityLevel === level.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setQualityLevel(level.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{level.name}</CardTitle>
                      <Badge variant={qualityLevel === level.id ? "default" : "outline"}>
                        {(level.priceMultiplier * 100).toFixed(0)}% من السعر الأساسي
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{level.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium">المميزات:</span>
                        <ul className="text-sm text-gray-600 mt-1 space-y-1">
                          {level.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm font-medium">الضمان:</span>
                        <div className="text-sm text-gray-600">{level.warranty}</div>
                      </div>
                      
                      {estimatedCost > 0 && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <span className="text-sm font-medium">التكلفة التقديرية:</span>
                          <div className="text-lg font-bold text-blue-600">
                            {((estimatedCost / qualityLevels.find(q => q.id === qualityLevel)!.priceMultiplier) * level.priceMultiplier).toLocaleString('en-US')} ر.س
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
