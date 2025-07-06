/**
 * Advanced Reporting Engine
 * Comprehensive business intelligence with custom report builder
 */

'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  BarChart3, 
  LineChart, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  Settings,
  Clock,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Building,
  FileText,
  Mail,
  RefreshCw,
  Eye,
  Plus,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ReportMetric {
  id: string
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ComponentType
  color: string
}

interface CustomReport {
  id: string
  name: string
  description: string
  type: 'chart' | 'table' | 'metric'
  config: any
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    email?: string
    enabled: boolean
  }
  created_at: string
  last_run?: string
}

interface ReportFilter {
  dateRange: {
    start: Date
    end: Date
  }
  storeId?: string
  categoryId?: string
  customFilters: Record<string, any>
}

const PRE_BUILT_REPORTS = [
  {
    id: 'sales_overview',
    name: 'نظرة عامة على المبيعات',
    description: 'تقرير شامل عن أداء المبيعات والإيرادات',
    category: 'sales',
    icon: TrendingUp
  },
  {
    id: 'inventory_status',
    name: 'حالة المخزون',
    description: 'تحليل مستويات المخزون والمنتجات الأكثر مبيعاً',
    category: 'inventory',
    icon: Package
  },
  {
    id: 'customer_analytics',
    name: 'تحليل العملاء',
    description: 'سلوك العملاء وقيمة العمر الافتراضي',
    category: 'customers',
    icon: Users
  },
  {
    id: 'financial_summary',
    name: 'الملخص المالي',
    description: 'الأرباح والخسائر والتدفق النقدي',
    category: 'financial',
    icon: DollarSign
  },
  {
    id: 'store_performance',
    name: 'أداء المتاجر',
    description: 'مقارنة أداء المتاجر المختلفة',
    category: 'stores',
    icon: Building
  }
]

const CHART_TYPES = [
  { id: 'bar', name: 'أعمدة', icon: BarChart3 },
  { id: 'line', name: 'خطي', icon: LineChart },
  { id: 'pie', name: 'دائري', icon: PieChart },
  { id: 'doughnut', name: 'حلقي', icon: PieChart }
]

export default function AdvancedReportingEngine() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [customReports, setCustomReports] = useState<CustomReport[]>([])
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [filters, setFilters] = useState<ReportFilter>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    },
    customFilters: {}
  })
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  // Report builder state
  const [reportBuilder, setReportBuilder] = useState({
    name: '',
    description: '',
    type: 'chart' as 'chart' | 'table' | 'metric',
    chartType: 'bar',
    dataSource: '',
    metrics: [] as string[],
    dimensions: [] as string[],
    schedule: {
      frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
      email: '',
      enabled: false
    }
  })

  // Key metrics for dashboard
  const keyMetrics: ReportMetric[] = useMemo(() => [
    {
      id: 'total_sales',
      title: 'إجمالي المبيعات',
      value: '247,350 ريال',
      change: 12.5,
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 'total_orders',
      title: 'إجمالي الطلبات',
      value: '1,432',
      change: 8.2,
      changeType: 'increase',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      id: 'avg_order_value',
      title: 'متوسط قيمة الطلب',
      value: '172.80 ريال',
      change: -2.1,
      changeType: 'decrease',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
    {
      id: 'new_customers',
      title: 'عملاء جدد',
      value: '89',
      change: 15.7,
      changeType: 'increase',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 'low_stock_items',
      title: 'منتجات منخفضة المخزون',
      value: '23',
      change: -18.3,
      changeType: 'decrease',
      icon: Package,
      color: 'text-red-600'
    },
    {
      id: 'active_stores',
      title: 'المتاجر النشطة',
      value: '47',
      change: 4.2,
      changeType: 'increase',
      icon: Building,
      color: 'text-indigo-600'
    }
  ], [])

  // Sample chart data
  const salesChartData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'المبيعات (ريال)',
        data: [65000, 78000, 89000, 81000, 95000, 102000],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        fill: true
      }
    ]
  }

  const categoryChartData = {
    labels: ['إلكترونيات', 'ملابس', 'مستحضرات تجميل', 'كتب', 'رياضة'],
    datasets: [
      {
        data: [35, 25, 20, 12, 8],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6'
        ],
        borderWidth: 0
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  // Load data based on filters
  useEffect(() => {
    loadReportData()
  }, [filters])

  const loadReportData = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update report data based on filters
      setReportData({
        metrics: keyMetrics,
        charts: {
          sales: salesChartData,
          categories: categoryChartData
        }
      })
    } catch (error) {
      toast.error('فشل في تحميل البيانات')
    } finally {
      setIsLoading(false)
    }
  }

  const generateReport = async (reportId: string) => {
    setIsLoading(true)
    try {
      // Generate report based on ID
      console.log('Generating report:', reportId)
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('تم إنشاء التقرير بنجاح')
    } catch (error) {
      toast.error('فشل في إنشاء التقرير')
    } finally {
      setIsLoading(false)
    }
  }

  const exportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      toast.loading('جاري تصدير التقرير...')
      
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success(`تم تصدير التقرير بصيغة ${format.toUpperCase()}`)
    } catch (error) {
      toast.error('فشل في تصدير التقرير')
    }
  }

  const scheduleReport = async (reportId: string, schedule: any) => {
    try {
      console.log('Scheduling report:', reportId, schedule)
      toast.success('تم جدولة التقرير بنجاح')
    } catch (error) {
      toast.error('فشل في جدولة التقرير')
    }
  }

  const createCustomReport = async () => {
    if (!reportBuilder.name || !reportBuilder.dataSource) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    try {
      const newReport: CustomReport = {
        id: `custom_${Date.now()}`,
        name: reportBuilder.name,
        description: reportBuilder.description,
        type: reportBuilder.type,
        config: {
          chartType: reportBuilder.chartType,
          dataSource: reportBuilder.dataSource,
          metrics: reportBuilder.metrics,
          dimensions: reportBuilder.dimensions
        },
        schedule: reportBuilder.schedule.enabled ? reportBuilder.schedule : undefined,
        created_at: new Date().toISOString()
      }

      setCustomReports([...customReports, newReport])
      
      // Reset builder
      setReportBuilder({
        name: '',
        description: '',
        type: 'chart',
        chartType: 'bar',
        dataSource: '',
        metrics: [],
        dimensions: [],
        schedule: {
          frequency: 'weekly',
          email: '',
          enabled: false
        }
      })

      toast.success('تم إنشاء التقرير المخصص بنجاح')
      setActiveTab('custom')
    } catch (error) {
      toast.error('فشل في إنشاء التقرير المخصص')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-800">محرك التقارير المتقدم</h1>
            <Badge variant="default">
              <BarChart3 className="w-4 h-4 mr-1" />
              ذكي
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Select value={filters.storeId || 'all'} onValueChange={(value) => 
              setFilters({...filters, storeId: value === 'all' ? undefined : value})
            }>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="اختر المتجر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المتاجر</SelectItem>
                <SelectItem value="store1">متجر الرياض</SelectItem>
                <SelectItem value="store2">متجر جدة</SelectItem>
                <SelectItem value="store3">متجر الدمام</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={loadReportData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
            <TabsTrigger value="reports">التقارير الجاهزة</TabsTrigger>
            <TabsTrigger value="custom">التقارير المخصصة</TabsTrigger>
            <TabsTrigger value="builder">منشئ التقارير</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {keyMetrics.map((metric) => (
                <Card key={metric.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">{metric.title}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {metric.changeType === 'increase' ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : metric.changeType === 'decrease' ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : null}
                          <span className={`text-sm font-medium ${
                            metric.changeType === 'increase' ? 'text-green-600' :
                            metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                          <span className="text-sm text-slate-500">عن الشهر الماضي</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg bg-slate-100`}>
                        <metric.icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    اتجاه المبيعات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line data={salesChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    توزيع الفئات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Doughnut data={categoryChartData} options={{
                      ...chartOptions,
                      scales: undefined
                    }} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={() => exportReport('pdf')} className="h-16">
                    <div className="text-center">
                      <FileText className="w-6 h-6 mx-auto mb-1" />
                      <p>تصدير PDF</p>
                    </div>
                  </Button>
                  <Button onClick={() => exportReport('excel')} variant="outline" className="h-16">
                    <div className="text-center">
                      <Download className="w-6 h-6 mx-auto mb-1" />
                      <p>تصدير Excel</p>
                    </div>
                  </Button>
                  <Button onClick={() => setActiveTab('builder')} variant="outline" className="h-16">
                    <div className="text-center">
                      <Plus className="w-6 h-6 mx-auto mb-1" />
                      <p>إنشاء تقرير</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pre-built Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRE_BUILT_REPORTS.map((report) => (
                <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <report.icon className="w-5 h-5" />
                      {report.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">{report.description}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => generateReport(report.id)}
                        disabled={isLoading}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        عرض
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => exportReport('pdf')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        تصدير
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          // Open schedule modal
                          toast.info('جدولة التقرير', { description: 'سيتم إضافة هذه الميزة قريباً' })
                        }}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        جدولة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Custom Reports Tab */}
          <TabsContent value="custom" className="space-y-6">
            {customReports.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-medium mb-2">لا توجد تقارير مخصصة</h3>
                  <p className="text-slate-600 mb-4">
                    ابدأ بإنشاء تقريرك الأول باستخدام منشئ التقارير
                  </p>
                  <Button onClick={() => setActiveTab('builder')}>
                    <Plus className="w-4 h-4 mr-2" />
                    إنشاء تقرير مخصص
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customReports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{report.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setCustomReports(customReports.filter(r => r.id !== report.id))
                            toast.success('تم حذف التقرير')
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4">{report.description}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline">{report.type}</Badge>
                        {report.schedule?.enabled && (
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            مجدول
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          عرض
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          تصدير
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Report Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  منشئ التقارير المخصصة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">اسم التقرير</label>
                    <Input
                      value={reportBuilder.name}
                      onChange={(e) => setReportBuilder({...reportBuilder, name: e.target.value})}
                      placeholder="أدخل اسم التقرير"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">نوع التقرير</label>
                    <Select 
                      value={reportBuilder.type} 
                      onValueChange={(value: 'chart' | 'table' | 'metric') => 
                        setReportBuilder({...reportBuilder, type: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chart">مخطط بياني</SelectItem>
                        <SelectItem value="table">جدول</SelectItem>
                        <SelectItem value="metric">مقاييس</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">وصف التقرير</label>
                  <Input
                    value={reportBuilder.description}
                    onChange={(e) => setReportBuilder({...reportBuilder, description: e.target.value})}
                    placeholder="وصف مختصر للتقرير"
                  />
                </div>

                {/* Chart Type (if chart selected) */}
                {reportBuilder.type === 'chart' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">نوع المخطط</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {CHART_TYPES.map((chart) => (
                        <Button
                          key={chart.id}
                          variant={reportBuilder.chartType === chart.id ? 'default' : 'outline'}
                          onClick={() => setReportBuilder({...reportBuilder, chartType: chart.id})}
                          className="h-16"
                        >
                          <div className="text-center">
                            <chart.icon className="w-6 h-6 mx-auto mb-1" />
                            <p className="text-xs">{chart.name}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Data Source */}
                <div>
                  <label className="block text-sm font-medium mb-2">مصدر البيانات</label>
                  <Select 
                    value={reportBuilder.dataSource} 
                    onValueChange={(value) => setReportBuilder({...reportBuilder, dataSource: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر مصدر البيانات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">المبيعات</SelectItem>
                      <SelectItem value="orders">الطلبات</SelectItem>
                      <SelectItem value="customers">العملاء</SelectItem>
                      <SelectItem value="inventory">المخزون</SelectItem>
                      <SelectItem value="stores">المتاجر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Schedule Settings */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={reportBuilder.schedule.enabled}
                      onChange={(e) => setReportBuilder({
                        ...reportBuilder,
                        schedule: {...reportBuilder.schedule, enabled: e.target.checked}
                      })}
                    />
                    <label className="text-sm font-medium">جدولة التقرير التلقائية</label>
                  </div>

                  {reportBuilder.schedule.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">التكرار</label>
                        <Select 
                          value={reportBuilder.schedule.frequency} 
                          onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                            setReportBuilder({
                              ...reportBuilder,
                              schedule: {...reportBuilder.schedule, frequency: value}
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">يومي</SelectItem>
                            <SelectItem value="weekly">أسبوعي</SelectItem>
                            <SelectItem value="monthly">شهري</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                        <Input
                          type="email"
                          value={reportBuilder.schedule.email}
                          onChange={(e) => setReportBuilder({
                            ...reportBuilder,
                            schedule: {...reportBuilder.schedule, email: e.target.value}
                          })}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button onClick={createCustomReport} className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    إنشاء التقرير
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setReportBuilder({
                        name: '',
                        description: '',
                        type: 'chart',
                        chartType: 'bar',
                        dataSource: '',
                        metrics: [],
                        dimensions: [],
                        schedule: {
                          frequency: 'weekly',
                          email: '',
                          enabled: false
                        }
                      })
                    }}
                  >
                    إعادة تعيين
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
