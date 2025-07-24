'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Textarea } from '@/core/shared/components/ui/textarea';
import { Badge } from '@/core/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs';
import { 
  Building2, 
  Calculator, 
  TrendingDown, 
  Package, 
  Truck, 
  Users, 
  BarChart3,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Project {
  id: string;
  name: string;
  area: number;
  units: number;
  timeline: number;
  status: 'planning' | 'execution' | 'completed';
  budget: number;
}

interface Material {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  unit: string;
  quantityPerUnit: number; // Quantity needed per square meter
  supplier: string;
  bulkDiscount: { quantity: number; discount: number }[];
}

interface PurchaseOptimization {
  material: string;
  totalQuantity: number;
  standardCost: number;
  optimizedCost: number;
  savings: number;
  recommendedSupplier: string;
  orderTiming: string;
  notes: string;
}

export default function CompanyBulkPurchaseOptimizer() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj1',
      name: 'مجمع الياسمين السكني',
      area: 200,
      units: 10,
      timeline: 12,
      status: 'planning',
      budget: 4000000
    },
    {
      id: 'proj2', 
      name: 'فلل الروضة',
      area: 300,
      units: 5,
      timeline: 8,
      status: 'execution',
      budget: 2500000
    },
    {
      id: 'proj3',
      name: 'شقق المرجان',
      area: 150,
      units: 20,
      timeline: 15,
      status: 'planning',
      budget: 3000000
    }
  ]);

  const [materials] = useState<Material[]>([
    {
      id: 'cement',
      name: 'أسمنت بورتلاند',
      category: 'خرسانة',
      unitPrice: 18,
      unit: 'كيس 50كغ',
      quantityPerUnit: 0.8, // أكياس لكل متر مربع
      supplier: 'شركة أسمنت الرياض',
      bulkDiscount: [
        { quantity: 1000, discount: 5 },
        { quantity: 5000, discount: 12 },
        { quantity: 10000, discount: 18 }
      ]
    },
    {
      id: 'rebar',
      name: 'حديد التسليح',
      category: 'حديد',
      unitPrice: 2800,
      unit: 'طن',
      quantityPerUnit: 0.12, // طن لكل متر مربع
      supplier: 'مصنع الحديد السعودي',
      bulkDiscount: [
        { quantity: 50, discount: 8 },
        { quantity: 200, discount: 15 },
        { quantity: 500, discount: 22 }
      ]
    },
    {
      id: 'blocks',
      name: 'بلوك خرساني',
      category: 'بناء',
      unitPrice: 2.5,
      unit: 'قطعة',
      quantityPerUnit: 12, // قطعة لكل متر مربع
      supplier: 'مصنع البلوك الحديث',
      bulkDiscount: [
        { quantity: 10000, discount: 10 },
        { quantity: 50000, discount: 18 },
        { quantity: 100000, discount: 25 }
      ]
    },
    {
      id: 'tiles',
      name: 'بلاط سيراميك',
      category: 'تشطيبات',
      unitPrice: 45,
      unit: 'متر مربع',
      quantityPerUnit: 1.1, // مع الفاقد
      supplier: 'شركة السيراميك المتطور',
      bulkDiscount: [
        { quantity: 1000, discount: 12 },
        { quantity: 3000, discount: 20 },
        { quantity: 5000, discount: 28 }
      ]
    }
  ]);

  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [optimizations, setOptimizations] = useState<PurchaseOptimization[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalSavings, setTotalSavings] = useState(0);

  const calculateBulkOptimization = async () => {
    if (selectedProjects.length === 0) return;

    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedProjectData = projects.filter(p => selectedProjects.includes(p.id));
    const totalArea = selectedProjectData.reduce((sum, p) => sum + (p.area * p.units), 0);
    
    const optimizationResults: PurchaseOptimization[] = materials.map(material => {
      const totalQuantity = Math.ceil(totalArea * material.quantityPerUnit);
      const standardCost = totalQuantity * material.unitPrice;
      
      // Find best bulk discount
      let bestDiscount = 0;
      for (const discount of material.bulkDiscount) {
        if (totalQuantity >= discount.quantity) {
          bestDiscount = discount.discount;
        }
      }
      
      const optimizedCost = standardCost * (1 - bestDiscount / 100);
      const savings = standardCost - optimizedCost;
      
      // Determine optimal timing
      let orderTiming = 'فوري';
      if (material.category === 'تشطيبات') {
        orderTiming = 'المرحلة الأخيرة';
      } else if (material.category === 'خرسانة' || material.category === 'حديد') {
        orderTiming = 'بداية المشروع';
      }
      
      return {
        material: material.name,
        totalQuantity,
        standardCost,
        optimizedCost,
        savings,
        recommendedSupplier: material.supplier,
        orderTiming,
        notes: bestDiscount > 15 ? 'خصم ممتاز - ينصح بالشراء المجمع' : 'خصم جيد - يمكن التفاوض للمزيد'
      };
    });

    setOptimizations(optimizationResults);
    setTotalSavings(optimizationResults.reduce((sum, opt) => sum + opt.savings, 0));
    setLoading(false);
  };

  const handleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const totalBudget = projects
    .filter(p => selectedProjects.includes(p.id))
    .reduce((sum, p) => sum + p.budget, 0);

  const savingsPercentage = totalBudget > 0 ? (totalSavings / totalBudget) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6" dir="rtl">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">محسن الشراء المجمع</h1>
          </div>
          <p className="text-xl text-gray-600">
            نظام ذكي لتحسين مشتريات المواد عبر المشاريع المتعددة وتحقيق أقصى وفورات
          </p>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              اختيار المشاريع
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              تحسين الشراء
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              الجدول الزمني
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              التحليلات
            </TabsTrigger>
          </TabsList>

          {/* Projects Selection Tab */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <Card 
                  key={project.id} 
                  className={`cursor-pointer transition-all ${
                    selectedProjects.includes(project.id) 
                      ? 'ring-2 ring-green-500 bg-green-50' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleProjectSelection(project.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant={
                        project.status === 'completed' ? 'default' : 
                        project.status === 'execution' ? 'secondary' : 'outline'
                      }>
                        {project.status === 'planning' ? 'تخطيط' : 
                         project.status === 'execution' ? 'تنفيذ' : 'مكتمل'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>عدد الوحدات:</span>
                        <span className="font-semibold">{project.units} وحدة</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مساحة الوحدة:</span>
                        <span className="font-semibold">{project.area} م²</span>
                      </div>
                      <div className="flex justify-between">
                        <span>المساحة الإجمالية:</span>
                        <span className="font-semibold">{(project.area * project.units).toLocaleString('en-US')} م²</span>
                      </div>
                      <div className="flex justify-between">
                        <span>الميزانية:</span>
                        <span className="font-semibold text-green-600">
                          {project.budget.toLocaleString('en-US')} ر.س
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>المدة المتوقعة:</span>
                        <span className="font-semibold">{project.timeline} شهر</span>
                      </div>
                    </div>
                    {selectedProjects.includes(project.id) && (
                      <div className="mt-3 p-2 bg-green-100 rounded-lg text-center">
                        <CheckCircle className="w-4 h-4 inline-block text-green-600 ml-1" />
                        <span className="text-green-700 font-medium">مُختار للتحسين</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedProjects.length > 0 && (
              <div className="mt-8 text-center">
                <Card className="inline-block p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedProjects.length}
                      </div>
                      <div className="text-sm text-gray-600">مشاريع مختارة</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {totalBudget.toLocaleString('en-US')}
                      </div>
                      <div className="text-sm text-gray-600">إجمالي الميزانية (ر.س)</div>
                    </div>
                    <Button 
                      onClick={calculateBulkOptimization}
                      disabled={loading}
                      size="lg"
                      className="px-8"
                    >
                      {loading ? 'جاري التحليل...' : 'احسب التحسين المجمع'}
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Optimization Results Tab */}
          <TabsContent value="optimization">
            {optimizations.length > 0 ? (
              <div className="space-y-6">
                {/* Summary Card */}
                <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold">{totalSavings.toLocaleString('en-US')}</div>
                        <div className="text-sm opacity-90">إجمالي الوفورات (ر.س)</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{savingsPercentage.toFixed(1)}%</div>
                        <div className="text-sm opacity-90">نسبة الوفورات</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{optimizations.length}</div>
                        <div className="text-sm opacity-90">مواد محسّنة</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{selectedProjects.length}</div>
                        <div className="text-sm opacity-90">مشاريع مجمعة</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Optimization Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {optimizations.map((opt, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{opt.material}</span>
                          <Badge variant="secondary">
                            {((opt.savings / opt.standardCost) * 100).toFixed(1)}% وفورات
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">الكمية المطلوبة:</span>
                              <div className="font-semibold">{opt.totalQuantity.toLocaleString('en-US')}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">التكلفة العادية:</span>
                              <div className="font-semibold text-red-600">
                                {opt.standardCost.toLocaleString('en-US')} ر.س
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">التكلفة المحسّنة:</span>
                              <div className="font-semibold text-green-600">
                                {opt.optimizedCost.toLocaleString('en-US')} ر.س
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">الوفورات:</span>
                              <div className="font-semibold text-blue-600">
                                {opt.savings.toLocaleString('en-US')} ر.س
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm font-medium mb-1">المورد المقترح:</div>
                            <div className="text-gray-700">{opt.recommendedSupplier}</div>
                          </div>
                          
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-sm font-medium mb-1">توقيت الطلب:</div>
                            <div className="text-blue-700">{opt.orderTiming}</div>
                          </div>
                          
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <div className="text-sm font-medium mb-1">ملاحظات:</div>
                            <div className="text-yellow-800 text-sm">{opt.notes}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    لم يتم حساب التحسين بعد
                  </h3>
                  <p className="text-gray-500">
                    اختر المشاريع من التبويب الأول ثم اضغط على "احسب التحسين المجمع"
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  الجدول الزمني للمشتريات المحسّنة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { phase: 'مرحلة التأسيس', months: '1-3', materials: ['أسمنت بورتلاند', 'حديد التسليح'], color: 'bg-red-500' },
                    { phase: 'مرحلة البناء', months: '3-8', materials: ['بلوك خرساني'], color: 'bg-orange-500' },
                    { phase: 'مرحلة التشطيب', months: '8-12', materials: ['بلاط سيراميك'], color: 'bg-green-500' }
                  ].map((phase, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-4 h-4 rounded-full ${phase.color} mt-2 flex-shrink-0`}></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{phase.phase}</h4>
                          <Badge variant="outline">الشهر {phase.months}</Badge>
                        </div>
                        <div className="text-gray-600 mb-2">
                          المواد المطلوبة: {phase.materials.join(' - ')}
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-sm">
                          <strong>توصية:</strong> اطلب هذه المواد قبل {index === 0 ? 'بداية' : index === 1 ? 'منتصف' : 'نهاية'} المشروع بأسبوعين
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>تحليل الوفورات بالفئة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['خرسانة', 'حديد', 'بناء', 'تشطيبات'].map((category, index) => {
                      const categoryOptimizations = optimizations.filter(opt => 
                        materials.find(m => m.name === opt.material)?.category === category
                      );
                      const categorySavings = categoryOptimizations.reduce((sum, opt) => sum + opt.savings, 0);
                      const percentage = totalSavings > 0 ? (categorySavings / totalSavings) * 100 : 0;
                      
                      return (
                        <div key={category}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{category}</span>
                            <span className="text-sm text-gray-600">
                              {categorySavings.toLocaleString('en-US')} ر.س ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>مقارنة التكاليف</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-red-800 font-semibold mb-1">التكلفة بدون تحسين</div>
                      <div className="text-2xl font-bold text-red-600">
                        {optimizations.reduce((sum, opt) => sum + opt.standardCost, 0).toLocaleString('en-US')} ر.س
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-green-800 font-semibold mb-1">التكلفة بعد التحسين</div>
                      <div className="text-2xl font-bold text-green-600">
                        {optimizations.reduce((sum, opt) => sum + opt.optimizedCost, 0).toLocaleString('en-US')} ر.س
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-blue-800 font-semibold mb-1">إجمالي الوفورات</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {totalSavings.toLocaleString('en-US')} ر.س
                      </div>
                      <div className="text-sm text-blue-600">
                        ({savingsPercentage.toFixed(2)}% من إجمالي الميزانية)
                      </div>
                    </div>
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
