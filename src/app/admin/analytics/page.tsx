'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shared/components/ui/card'
import { Button } from '@/core/shared/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs'
import { Progress } from '@/core/shared/components/ui/progress'
import { Badge } from '@/core/shared/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Store, 
  DollarSign, 
  Globe,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { AdvancedAnalyticsEngine } from './engine'

export const dynamic = 'force-dynamic'

interface PlatformMetrics {
  totalUsers: number
  activeStores: number
  monthlyRevenue: number
  globalReach: number
  growthRate: number
}

interface RegionData {
  region: string
  users: number
  stores: number
  revenue: number
  growth: number
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null)
  const [regionData, setRegionData] = useState<RegionData[]>([])
  const [analyticsEngine] = useState(() => new AdvancedAnalyticsEngine())

  useEffect(() => {
    // Simulate loading platform analytics
    const timer = setTimeout(() => {
      setMetrics({
        totalUsers: 25000,
        activeStores: 1250,
        monthlyRevenue: 2500000,
        globalReach: 6,
        growthRate: 18.5
      })

      setRegionData([
        { region: 'المملكة العربية السعودية', users: 12000, stores: 600, revenue: 1200000, growth: 22 },
        { region: 'الإمارات العربية المتحدة', users: 6000, stores: 300, revenue: 650000, growth: 16 },
        { region: 'الكويت', users: 3500, stores: 180, revenue: 320000, growth: 14 },
        { region: 'قطر', users: 2000, stores: 100, revenue: 180000, growth: 20 },
        { region: 'البحرين', users: 1000, stores: 50, revenue: 100000, growth: 12 },
        { region: 'عُمان', users: 500, stores: 20, revenue: 50000, growth: 15 }
      ])

      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">جارٍ تحميل تحليلات المنصة...</p>
        </div>
      </div>
    )
  }

  const reportData = analyticsEngine.getAnalyticsReport()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">تحليلات المنصة</h1>
          <p className="text-muted-foreground">مراقبة شاملة لأداء منصة بنّا عبر منطقة الخليج</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('تصدير التقرير')}>
            <Download className="h-4 w-4 ml-2" />
            تصدير التقرير
          </Button>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث البيانات
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalUsers.toLocaleString('ar-SA')}</div>
            <p className="text-xs text-muted-foreground">عبر دول الخليج</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المتاجر النشطة</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeStores.toLocaleString('ar-SA')}</div>
            <p className="text-xs text-muted-foreground">متجر نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.monthlyRevenue.toLocaleString('ar-SA')} ريال</div>
            <p className="text-xs text-muted-foreground">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الانتشار الجغرافي</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.globalReach}</div>
            <p className="text-xs text-muted-foreground">دول خليجية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل النمو</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{metrics?.growthRate}%</div>
            <p className="text-xs text-muted-foreground">مقارنة بالشهر السابق</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Activity className="h-5 w-5" />
            محرك التحليلات المتقدم
          </CardTitle>
          <CardDescription className="text-blue-700">
            تحليلات مدعومة بالذكاء الاصطناعي لفهم أعمق لسلوك المستخدمين
          </CardDescription>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">إجمالي المبيعات</p>
              <p className="text-2xl font-bold">{reportData.totalSales.toLocaleString('ar-SA')}</p>
            </div>
            <div>
              <p className="text-sm font-medium">إجمالي الزيارات</p>
              <p className="text-2xl font-bold">{reportData.totalVisits.toLocaleString('ar-SA')}</p>
            </div>
            <div>
              <p className="text-sm font-medium">متوسط التحويل</p>
              <p className="text-2xl font-bold">{reportData.averageConversion.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="regions">التحليل الإقليمي</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="insights">الرؤى</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>نمو المستخدمين</CardTitle>
                <CardDescription>نمو قاعدة المستخدمين خلال الأشهر الستة الماضية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { month: 'يناير', users: 15000, growth: 12 },
                  { month: 'فبراير', users: 17500, growth: 16.7 },
                  { month: 'مارس', users: 19200, growth: 9.7 },
                  { month: 'أبريل', users: 21000, growth: 9.4 },
                  { month: 'مايو', users: 23500, growth: 11.9 },
                  { month: 'يونيو', users: 25000, growth: 6.4 }
                ].map((data, index) => (
                  <div key={data.month} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{data.month}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={data.users / 250} className="w-32 h-2" />
                      <span className="text-sm font-medium">{data.users.toLocaleString('ar-SA')}</span>
                      <Badge variant={data.growth > 10 ? "default" : "secondary"}>
                        +{data.growth}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أداء المتاجر</CardTitle>
                <CardDescription>إحصائيات أداء المتاجر عبر المنصة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { category: 'مواد البناء', stores: 450, performance: 92 },
                  { category: 'الأدوات والمعدات', stores: 320, performance: 88 },
                  { category: 'خدمات المقاولين', stores: 280, performance: 94 },
                  { category: 'التصميم الداخلي', stores: 200, performance: 87 }
                ].map((data, index) => (
                  <div key={data.category} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{data.category}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={data.performance} className="w-24 h-2" />
                      <span className="text-sm">{data.stores} متجر</span>
                      <span className="text-sm font-medium">{data.performance}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التحليل الإقليمي لدول الخليج</CardTitle>
              <CardDescription>توزيع المستخدمين والمتاجر والإيرادات حسب البلد</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionData.map((region, index) => (
                  <div key={region.region} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{region.region}</h3>
                      <Badge variant={region.growth > 15 ? "default" : "secondary"}>
                        +{region.growth}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">المستخدمون</p>
                        <p className="font-medium">{region.users.toLocaleString('ar-SA')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">المتاجر</p>
                        <p className="font-medium">{region.stores.toLocaleString('ar-SA')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">الإيرادات</p>
                        <p className="font-medium">{region.revenue.toLocaleString('ar-SA')} ريال</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>مؤشرات الأداء الرئيسية</CardTitle>
              <CardDescription>مقاييس الأداء الحرجة للمنصة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { metric: 'وقت الاستجابة', value: '1.2 ثانية', target: '< 2 ثانية', performance: 85 },
                  { metric: 'معدل التحويل', value: '12.5%', target: '> 10%', performance: 92 },
                  { metric: 'رضا المستخدمين', value: '4.6/5', target: '> 4.0', performance: 95 },
                  { metric: 'وقت التشغيل', value: '99.8%', target: '> 99%', performance: 98 }
                ].map((kpi, index) => (
                  <div key={kpi.metric} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{kpi.metric}</p>
                      <p className="text-sm text-muted-foreground">الهدف: {kpi.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{kpi.value}</p>
                      <Progress value={kpi.performance} className="w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>رؤى مدعومة بالذكاء الاصطناعي</CardTitle>
              <CardDescription>تحليلات تنبؤية وتوصيات استراتيجية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  title: 'فرصة توسع في السوق القطري',
                  insight: 'تُظهر البيانات نمواً بنسبة 20% في الطلب على خدمات البناء في قطر، مما يشير إلى فرصة توسع استراتيجية.',
                  action: 'زيادة الاستثمار التسويقي في قطر بنسبة 30%',
                  priority: 'عالية'
                },
                {
                  title: 'تحسين تجربة المستخدم في التطبيق المحمول',
                  insight: 'معدل التحويل من الجوال أقل بـ 15% من سطح المكتب، مما يتطلب تحسينات في التطبيق المحمول.',
                  action: 'إعادة تصميم واجهة التطبيق المحمول',
                  priority: 'متوسطة'
                },
                {
                  title: 'اتجاه موسمي في مبيعات مواد البناء',
                  insight: 'تزداد المبيعات بنسبة 40% خلال الربع الثاني من كل عام، مما يستدعي تحسين إدارة المخزون.',
                  action: 'وضع استراتيجية مخزون موسمية',
                  priority: 'متوسطة'
                }
              ].map((insight, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{insight.title}</h3>
                    <Badge variant={insight.priority === 'عالية' ? 'default' : 'secondary'}>
                      أولوية {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{insight.insight}</p>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-blue-800 font-medium">التوصية:</p>
                    <p className="text-blue-700">{insight.action}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
