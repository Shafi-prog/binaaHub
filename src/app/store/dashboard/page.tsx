'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  AlertTriangle, 
  Store, 
  LogOut, 
  FileText, 
  Calculator, 
  DollarSign, 
  Receipt,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  ExternalLink,
  Eye,
  Edit,
  Plus,
  ArrowUp,
  ArrowDown,
  Calendar,
  Target,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Wifi,
  Server
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface DashboardStats {
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  stats: DashboardStats;
  description: string;
}

export default function StoreDashboardPage() {
const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [medusaRunning, setMedusaRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Check if Medusa admin is running
    fetch('http://localhost:9000/admin', { 
      method: 'HEAD',
      mode: 'no-cors'
    })
    .then(() => setMedusaRunning(true))
    .catch(() => setMedusaRunning(false));

    return () => clearInterval(timer);
  }, []);

  const storeDashboardStats: StatCard[] = [
    {
      title: 'إجمالي المنتجات',
      value: '248',
      icon: <Package className="w-6 h-6" />,
      href: '/store/products',
      color: 'bg-blue-500',
      stats: { current: 248, previous: 231, change: 7.4, trend: 'up' },
      description: 'منتج نشط'
    },
    {
      title: 'الطلبات اليوم',
      value: '18',
      icon: <ShoppingCart className="w-6 h-6" />,
      href: '/store/orders',
      color: 'bg-green-500',
      stats: { current: 18, previous: 12, change: 50, trend: 'up' },
      description: 'طلب جديد'
    },
    {
      title: 'إجمالي العملاء',
      value: '1,456',
      icon: <Users className="w-6 h-6" />,
      href: '/store/customers',
      color: 'bg-purple-500',
      stats: { current: 1456, previous: 1398, change: 4.1, trend: 'up' },
      description: 'عميل مسجل'
    },
    {
      title: 'مبيعات اليوم',
      value: '24,580',
      icon: <BarChart3 className="w-6 h-6" />,
      href: '/store/analytics',
      color: 'bg-orange-500',
      stats: { current: 24580, previous: 21340, change: 15.2, trend: 'up' },
      description: 'ريال سعودي'
    },
    {
      title: 'أوامر الشراء',
      value: '12',
      icon: <FileText className="w-6 h-6" />,
      href: '/store/purchase-orders',
      color: 'bg-indigo-500',
      stats: { current: 12, previous: 8, change: 50, trend: 'up' },
      description: 'أمر نشط'
    },
    {
      title: 'إجمالي المصروفات',
      value: '8,750',
      icon: <Calculator className="w-6 h-6" />,
      href: '/store/expenses',
      color: 'bg-red-500',
      stats: { current: 8750, previous: 9200, change: -4.9, trend: 'down' },
      description: 'ريال سعودي'
    }
  ];

  const quickActions = [
    { name: 'إضافة منتج جديد', href: '/store/products', icon: Package, color: 'bg-blue-500' },
    { name: 'طلب شراء جديد', href: '/store/purchase-orders', icon: FileText, color: 'bg-indigo-500' },
    { name: 'إضافة عميل', href: '/store/customers', icon: Users, color: 'bg-purple-500' },
    { name: 'تسجيل مصروف', href: '/store/expenses', icon: Calculator, color: 'bg-red-500' }
  ];

  const systemStatus = [
    { name: 'نقطة البيع', status: 'نشط', color: 'bg-green-500', icon: Receipt },
    { name: 'إدارة المخزون', status: 'نشط', color: 'bg-green-500', icon: Package },
    { name: 'نظام الدفع', status: 'نشط', color: 'bg-green-500', icon: DollarSign },
    { name: 'النسخ الاحتياطي', status: 'نشط', color: 'bg-green-500', icon: Server }
  ];

  const recentActivities = [
    { 
      id: 1, 
      action: 'طلب شراء جديد', 
      details: 'أمر شراء #PO-2025-001 تم إنشاؤه',
      time: '5 دقائق مضت',
      icon: FileText,
      color: 'text-indigo-600'
    },
    { 
      id: 2, 
      action: 'عميل جديد', 
      details: 'أحمد محمد علي تم تسجيله كعميل',
      time: '15 دقيقة مضت',
      icon: Users,
      color: 'text-purple-600'
    },
    { 
      id: 3, 
      action: 'بيع منتج', 
      details: 'تم بيع 50 كيس أسمنت',
      time: '30 دقيقة مضت',
      icon: ShoppingCart,
      color: 'text-green-600'
    },
    { 
      id: 4, 
      action: 'تحديث مخزون', 
      details: 'تم تحديث مخزون الحديد 16 ملم',
      time: '45 دقيقة مضت',
      icon: Package,
      color: 'text-blue-600'
    }
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      localStorage.clear();
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      });
    }
    router.push('/login');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المتجر المتقدمة</h1>
          <p className="text-gray-600">مرحباً بك في نظام إدارة المتجر الشامل</p>
          <p className="text-sm text-gray-500 mt-1">{currentTime.toLocaleString('ar-SA')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            تسجيل الخروج
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            الإعدادات
          </Button>
        </div>
      </div>

      {/* System Status Alert */}
      {!medusaRunning && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 mb-1">تنبيه النظام</h3>
                <p className="text-sm text-yellow-700 mb-3">بعض الخدمات قد تكون غير متاحة</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">فحص الحالة</Button>
                  <Button size="sm">دليل الإعداد</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {storeDashboardStats.map((card, index) => (
          <Link key={index} href={card.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className={`${card.color} p-2 rounded-lg`}>
                    <div className="text-white">{card.icon}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-gray-500">{card.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-xs">
                  {card.stats.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3 text-green-600" />
                  ) : card.stats.trend === 'down' ? (
                    <ArrowDown className="h-3 w-3 text-red-600" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-gray-400" />
                  )}
                  <span className={`${
                    card.stats.trend === 'up' ? 'text-green-600' : 
                    card.stats.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {Math.abs(card.stats.change)}%
                  </span>
                  <span className="text-gray-500">من الأمس</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              الإجراءات السريعة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className={`${action.color} p-2 rounded-lg`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{action.name}</span>
                    <ExternalLink className="h-4 w-4 text-gray-400 mr-auto" />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              حالة النظام
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemStatus.map((system, index) => {
              const Icon = system.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{system.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${system.color}`}></div>
                    <span className="text-sm text-gray-600">{system.status}</span>
                  </div>
                </div>
              );
            })}
            
            <div className="pt-3 border-t border-gray-200">
              <Button variant="outline" size="sm" className="w-full">
                <Monitor className="h-4 w-4 mr-2" />
                عرض تفاصيل النظام
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              النشاطات الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                  <Icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{activity.action}</h4>
                    <p className="text-xs text-gray-600 mb-1">{activity.details}</p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              );
            })}
            
            <div className="pt-3 border-t border-gray-200">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                عرض جميع النشاطات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              أداء المبيعات الأسبوعي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">هذا الأسبوع</span>
                <span className="font-bold text-green-600">156,850 ريال</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">الهدف:</span>
                  <span className="font-medium ml-2">200,000 ريال</span>
                </div>
                <div>
                  <span className="text-gray-600">المتبقي:</span>
                  <span className="font-medium ml-2">43,150 ريال</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              الأهداف الشهرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">تقدم الشهر</span>
                <span className="font-bold text-blue-600">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">المحقق:</span>
                  <span className="font-medium ml-2">420,000 ريال</span>
                </div>
                <div>
                  <span className="text-gray-600">الهدف:</span>
                  <span className="font-medium ml-2">1,000,000 ريال</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
