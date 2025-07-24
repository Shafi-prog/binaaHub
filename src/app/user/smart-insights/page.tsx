"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { 
  Brain, Lightbulb, MessageSquare, Calculator, FileText, 
  TrendingUp, Target, Zap, Sparkles, Clock, CheckCircle,
  AlertTriangle, Info, ArrowRight, RefreshCw, Download,
  BarChart3, PieChart, Calendar, DollarSign, Wrench
} from 'lucide-react';

export const dynamic = 'force-dynamic'

interface InsightCard {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  type: 'cost-optimization' | 'market-trend' | 'seasonal-advice' | 'risk-alert' | 'opportunity';
  priority: 'high' | 'medium' | 'low';
  impact: number; // Potential savings or benefit in SAR
  confidence: number; // AI confidence level 0-100
  actionable: boolean;
  category: string;
  categoryAr: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface PersonalizedRecommendation {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  products: Array<{
    name: string;
    price: number;
    savings?: number;
    supplier: string;
  }>;
  reasoning: string[];
  reasoningAr: string[];
  confidence: number;
}

interface MarketAlert {
  id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: 'price-drop' | 'price-increase' | 'shortage' | 'new-product' | 'promotion';
  urgency: 'high' | 'medium' | 'low';
  expiresAt?: string;
  affectedProducts: string[];
}

export default function SmartInsightsPage() {
  const [insights, setInsights] = useState<InsightCard[]>([
    {
      id: 'INS001',
      title: 'Cement Price Optimization',
      titleAr: 'تحسين أسعار الأسمنت',
      description: 'Switch to alternative cement supplier for 12% cost reduction',
      descriptionAr: 'التبديل إلى مورد أسمنت بديل لتوفير 12% من التكلفة',
      type: 'cost-optimization',
      priority: 'high',
      impact: 8500,
      confidence: 92,
      actionable: true,
      category: 'Materials',
      categoryAr: 'المواد',
      timestamp: '2025-01-18T10:00:00',
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      id: 'INS002',
      title: 'Seasonal Steel Price Trend',
      titleAr: 'اتجاه أسعار الحديد الموسمي',
      description: 'Steel prices expected to drop 8% in next month based on market analysis',
      descriptionAr: 'من المتوقع انخفاض أسعار الحديد 8% الشهر القادم حسب تحليل السوق',
      type: 'market-trend',
      priority: 'medium',
      impact: 15000,
      confidence: 78,
      actionable: true,
      category: 'Market Analysis',
      categoryAr: 'تحليل السوق',
      timestamp: '2025-01-18T08:30:00',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      id: 'INS003',
      title: 'Winter Construction Advisory',
      titleAr: 'نصائح البناء الشتوية',
      description: 'Optimal timing for concrete work during winter months in your region',
      descriptionAr: 'التوقيت الأمثل لأعمال الخرسانة خلال أشهر الشتاء في منطقتك',
      type: 'seasonal-advice',
      priority: 'medium',
      impact: 3200,
      confidence: 85,
      actionable: true,
      category: 'Weather Advisory',
      categoryAr: 'نصائح جوية',
      timestamp: '2025-01-18T07:15:00',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      id: 'INS004',
      title: 'Supply Chain Risk Alert',
      titleAr: 'تنبيه مخاطر سلسلة التوريد',
      description: 'Potential shortage of insulation materials due to increased demand',
      descriptionAr: 'نقص محتمل في مواد العزل بسبب زيادة الطلب',
      type: 'risk-alert',
      priority: 'high',
      impact: 0,
      confidence: 71,
      actionable: true,
      category: 'Supply Chain',
      categoryAr: 'سلسلة التوريد',
      timestamp: '2025-01-18T06:45:00',
      icon: <AlertTriangle className="w-6 h-6" />
    }
  ]);

  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([
    {
      id: 'REC001',
      title: 'Bulk Purchase Optimization',
      titleAr: 'تحسين الشراء بالجملة',
      description: 'Optimal bulk purchase strategy for your upcoming projects',
      descriptionAr: 'استراتيجية الشراء بالجملة المثلى لمشاريعك القادمة',
      products: [
        { name: 'أسمنت عادي', price: 28, savings: 3.5, supplier: 'مؤسسة البناء المتقدم' },
        { name: 'حديد التسليح', price: 2850, savings: 340, supplier: 'شركة الحديد الوطنية' },
        { name: 'رمل مغسول', price: 45, savings: 7, supplier: 'مقالع النجاح' }
      ],
      reasoning: [
        'Based on your project timeline and volume requirements',
        'Supplier reliability and delivery capacity analysis',
        'Quality standards matching your specifications'
      ],
      reasoningAr: [
        'بناءً على الجدول الزمني لمشروعك ومتطلبات الحجم',
        'تحليل موثوقية المورد وقدرة التسليم',
        'معايير الجودة المطابقة لمواصفاتك'
      ],
      confidence: 88
    },
    {
      id: 'REC002',
      title: 'Alternative Material Suggestion',
      titleAr: 'اقتراح مواد بديلة',
      description: 'Cost-effective alternatives without compromising quality',
      descriptionAr: 'بدائل فعالة من ناحية التكلفة دون المساس بالجودة',
      products: [
        { name: 'بلوك خفيف الوزن', price: 3.2, savings: 0.8, supplier: 'مصنع البلوك الحديث' },
        { name: 'عازل حراري صديق للبيئة', price: 85, savings: 15, supplier: 'شركة العزل المتطورة' }
      ],
      reasoning: [
        'Lower environmental impact',
        'Better insulation properties',
        'Reduced labor costs due to lighter weight'
      ],
      reasoningAr: [
        'تأثير بيئي أقل',
        'خصائص عزل أفضل',
        'تكاليف عمالة أقل بسبب الوزن الأخف'
      ],
      confidence: 76
    }
  ]);

  const [marketAlerts, setMarketAlerts] = useState<MarketAlert[]>([
    {
      id: 'ALERT001',
      title: 'Flash Sale Alert',
      titleAr: 'تنبيه تخفيض سريع',
      message: '30% discount on premium tiles - Limited time offer',
      messageAr: 'خصم 30% على البلاط المميز - عرض لفترة محدودة',
      type: 'promotion',
      urgency: 'high',
      expiresAt: '2025-01-20T23:59:59',
      affectedProducts: ['بلاط بورسلان', 'سيراميك إيطالي', 'رخام طبيعي']
    },
    {
      id: 'ALERT002',
      title: 'Price Increase Warning',
      titleAr: 'تحذير زيادة الأسعار',
      message: 'Copper pipes prices expected to increase by 15% next week',
      messageAr: 'من المتوقع زيادة أسعار أنابيب النحاس بنسبة 15% الأسبوع القادم',
      type: 'price-increase',
      urgency: 'medium',
      affectedProducts: ['أنابيب نحاس', 'تجهيزات نحاسية', 'وصلات نحاس']
    }
  ]);

  const [activeTab, setActiveTab] = useState('insights');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredInsights = insights.filter(insight => 
    filterPriority === 'all' || insight.priority === filterPriority
  );

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch(priority) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return 'غير محدد';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'cost-optimization': return <DollarSign className="w-5 h-5" />;
      case 'market-trend': return <TrendingUp className="w-5 h-5" />;
      case 'seasonal-advice': return <Calendar className="w-5 h-5" />;
      case 'risk-alert': return <AlertTriangle className="w-5 h-5" />;
      case 'opportunity': return <Target className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch(type) {
      case 'price-drop': return 'bg-green-100 text-green-800';
      case 'price-increase': return 'bg-red-100 text-red-800';
      case 'shortage': return 'bg-orange-100 text-orange-800';
      case 'new-product': return 'bg-blue-100 text-blue-800';
      case 'promotion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-yellow-400 bg-yellow-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleExportInsights = () => {
    console.log('Exporting insights...');
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffInHours = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours} ساعة متبقية`;
    return `${Math.floor(diffInHours / 24)} يوم متبقي`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          الرؤى الذكية والتوصيات
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          تحليلات ذكية مدعومة بالذكاء الاصطناعي لتحسين قرارات البناء والشراء
        </Typography>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث الرؤى
          </Button>
          
          <Button
            onClick={handleExportInsights}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            تصدير التقرير
          </Button>
        </div>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">جميع الأولويات</option>
          <option value="high">أولوية عالية</option>
          <option value="medium">أولوية متوسطة</option>
          <option value="low">أولوية منخفضة</option>
        </select>
      </div>

      {/* Market Alerts Banner */}
      {marketAlerts.length > 0 && (
        <div className="space-y-3 mb-8">
          {marketAlerts.map((marketAlert) => (
            <EnhancedCard key={marketAlert.id} className={`p-4 border-l-4 ${getUrgencyColor(marketAlert.urgency)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <AlertTriangle className={`w-5 h-5 ${
                      marketAlert.urgency === 'high' ? 'text-red-600' :
                      marketAlert.urgency === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`} />
                  </div>
                  
                  <div>
                    <Typography variant="subheading" size="lg" weight="semibold" className="mb-1">{marketAlert.titleAr}</Typography>
                    <Typography variant="caption" size="sm" className="text-gray-600">{marketAlert.messageAr}</Typography>
                    {marketAlert.expiresAt && (
                      <Typography variant="caption" size="sm" className="text-red-600 mt-1">
                        <Clock className="w-4 h-4 inline ml-1" />
                        {formatTimeRemaining(marketAlert.expiresAt)}
                      </Typography>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getAlertTypeColor(marketAlert.type)}`}>
                    {marketAlert.type === 'promotion' ? 'عرض خاص' :
                     marketAlert.type === 'price-increase' ? 'زيادة سعر' :
                     marketAlert.type === 'price-drop' ? 'انخفاض سعر' :
                     marketAlert.type === 'shortage' ? 'نقص' : 'منتج جديد'}
                  </span>
                  
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                   onClick={() => window.alert('Button clicked')}>
                    عرض التفاصيل
                  </Button>
                </div>
              </div>
            </EnhancedCard>
          ))}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {[
          { id: 'insights', label: 'الرؤى الذكية', icon: <Lightbulb className="w-5 h-5" /> },
          { id: 'recommendations', label: 'التوصيات المخصصة', icon: <Target className="w-5 h-5" /> },
          { id: 'analytics', label: 'التحليلات', icon: <BarChart3 className="w-5 h-5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="grid gap-6">
          {filteredInsights.map((insight) => (
            <EnhancedCard key={insight.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    {insight.icon}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Typography variant="subheading" size="xl" weight="semibold">{insight.titleAr}</Typography>
                      <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(insight.priority)}`}>
                        {getPriorityText(insight.priority)}
                      </span>
                    </div>
                    
                    <Typography variant="body" size="lg" className="text-gray-700 mb-2">
                      {insight.descriptionAr}
                    </Typography>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        {getTypeIcon(insight.type)}
                        {insight.categoryAr}
                      </span>
                      <span>الثقة: {insight.confidence}%</span>
                      <span>{new Date(insight.timestamp).toLocaleDateString('en-US')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-left">
                  {insight.impact > 0 && (
                    <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600">
                      {insight.impact.toLocaleString('en-US')} ر.س
                    </Typography>
                  )}
                  <Typography variant="caption" size="sm" className="text-gray-600">
                    {insight.impact > 0 ? 'توفير محتمل' : 'تنبيه'}
                  </Typography>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>مستوى الثقة في التوصية</span>
                  <span>{insight.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      insight.confidence >= 80 ? 'bg-green-500' :
                      insight.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${insight.confidence}%` }}
                  ></div>
                </div>
              </div>

              {insight.actionable && (
                <div className="flex gap-3">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2" onClick={() => alert('Button clicked')}>
                    <ArrowRight className="w-4 h-4" />
                    تطبيق التوصية
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                   onClick={() => alert('Button clicked')}>
                    عرض التفاصيل
                  </Button>
                </div>
              )}
            </EnhancedCard>
          ))}
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="grid gap-6">
          {recommendations.map((rec) => (
            <EnhancedCard key={rec.id} className="p-6">
              <div className="mb-4">
                <Typography variant="subheading" size="xl" weight="semibold" className="mb-2">{rec.titleAr}</Typography>
                <Typography variant="body" size="lg" className="text-gray-700 mb-3">{rec.descriptionAr}</Typography>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-600">مستوى الثقة:</span>
                  <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${rec.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{rec.confidence}%</span>
                </div>
              </div>

              {/* Products */}
              <div className="mb-4">
                <Typography variant="subheading" size="lg" weight="semibold" className="mb-3">المنتجات الموصى بها:</Typography>
                <div className="space-y-3">
                  {rec.products.map((product, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <Typography variant="subheading" size="lg" weight="medium">{product.name}</Typography>
                          <Typography variant="caption" size="sm" className="text-gray-600">{product.supplier}</Typography>
                        </div>
                        
                        <div className="text-left">
                          <Typography variant="subheading" size="lg" weight="bold" className="text-blue-600">
                            {product.price.toLocaleString('en-US')} ر.س
                          </Typography>
                          {product.savings && (
                            <Typography variant="caption" size="sm" className="text-green-600">
                              وفر {product.savings.toLocaleString('en-US')} ر.س
                            </Typography>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reasoning */}
              <div className="mb-4">
                <Typography variant="subheading" size="lg" weight="semibold" className="mb-3">أسباب التوصية:</Typography>
                <ul className="space-y-2">
                  {rec.reasoningAr.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => alert('Button clicked')}>
                  عرض المنتجات
                </Button>
                
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                 onClick={() => alert('Button clicked')}>
                  حفظ التوصية
                </Button>
              </div>
            </EnhancedCard>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EnhancedCard className="p-6">
            <Typography variant="subheading" size="lg" weight="semibold" className="mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              توزيع التوفير حسب الفئة
            </Typography>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <Typography variant="caption" size="sm" className="text-gray-500">مخطط دائري للتوفير</Typography>
            </div>
          </EnhancedCard>

          <EnhancedCard className="p-6">
            <Typography variant="subheading" size="lg" weight="semibold" className="mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              اتجاهات الأسعار الشهرية
            </Typography>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <Typography variant="caption" size="sm" className="text-gray-500">مخطط أعمدة للاتجاهات</Typography>
            </div>
          </EnhancedCard>

          <EnhancedCard className="p-6">
            <Typography variant="subheading" size="lg" weight="semibold" className="mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              أداء التوصيات
            </Typography>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>توصيات مطبقة</span>
                <span className="font-bold text-purple-600">23/35</span>
              </div>
              <div className="flex justify-between items-center">
                <span>متوسط التوفير</span>
                <span className="font-bold text-green-600">12,450 ر.س</span>
              </div>
              <div className="flex justify-between items-center">
                <span>دقة التنبؤات</span>
                <span className="font-bold text-blue-600">87%</span>
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="p-6">
            <Typography variant="subheading" size="lg" weight="semibold" className="mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-600" />
              مقاييس الأداء
            </Typography>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>استخدام الرؤى</span>
                  <span>78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>رضا المستخدم</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </EnhancedCard>
        </div>
      )}

      {/* Floating Help */}
      <Link href="/user/help-center" className="fixed bottom-8 left-8 bg-purple-600 text-white rounded-full shadow-lg px-5 py-3 hover:bg-purple-700 z-50">
        مساعدة؟
      </Link>
    </div>
  );
}
