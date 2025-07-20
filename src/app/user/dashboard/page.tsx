"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { 
  Calendar, 
  Wallet, 
  FolderOpen, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Lightbulb,
  Star, 
  Trophy, 
  Users, 
  Brain, 
  Shield, 
  Box, 
  Bot, 
  Calculator, 
  Gift,
  Crown,
  Home,
  Folder,
  UserIcon,
  Settings,
  Store,
  LogOut,
  Building2,
  File,
  Trash2,
  BarChart3
} from 'lucide-react';

export const dynamic = 'force-dynamic'

interface DashboardStats {
  activeWarranties: number;
  activeProjects: number;
  totalOrders: number;
  totalInvoices: number;
  loyaltyPoints: number;
  currentLevel: number;
  communityPosts: number;
  monthlySpent: number;
  balanceAmount: number;
  aiInsights: number;
}

interface QuickInsight {
  id: string;
  title: string;
  description: string;
  type: 'saving' | 'trend' | 'alert' | 'opportunity';
  impact: number;
  confidence: number;
}

interface CommunityHighlight {
  id: string;
  author: string;
  content: string;
  likes: number;
  type: 'showcase' | 'tip' | 'question';
  timeAgo: string;
}

export default function UserDashboardPage() {
  console.log('🚀 UserDashboard component is rendering!');
  
  const [stats, setStats] = useState<DashboardStats>({
    activeWarranties: 8,
    activeProjects: 3,
    totalOrders: 24,
    totalInvoices: 6,
    loyaltyPoints: 12450,
    currentLevel: 8,
    communityPosts: 15,
    monthlySpent: 23500,
    balanceAmount: 8750,
    aiInsights: 12
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showAddCost, setShowAddCost] = useState(false);
  const [costForm, setCostForm] = useState({
    project: '',
    amount: '',
    store: '',
    note: ''
  });
  const [costs, setCosts] = useState<any[]>([]);
  const [quickInsights, setQuickInsights] = useState<QuickInsight[]>([
    {
      id: 'INS001',
      title: 'توفير في أسعار الأسمنت',
      description: 'يمكنك توفير 8,500 ر.س بالتبديل لمورد بديل',
      type: 'saving',
      impact: 8500,
      confidence: 92
    },
    {
      id: 'INS002', 
      title: 'انخفاض أسعار الحديد',
      description: 'أسعار الحديد متوقعة للانخفاض 8% الشهر القادم',
      type: 'trend',
      impact: 0,
      confidence: 78
    }
  ]);
  const [communityHighlights, setCommunityHighlights] = useState<CommunityHighlight[]>([
    {
      id: 'COM001',
      author: 'محمد البناء',
      content: 'انتهيت من مشروع فيلا سكنية في الرياض باستخدام أحدث تقنيات العزل',
      likes: 45,
      type: 'showcase',
      timeAgo: 'منذ 3 ساعات'
    },
    {
      id: 'COM002',
      author: 'سارة المعمارية', 
      content: 'نصيحة: تأكد من غسل الرمل جيداً قبل استخدامه في الخرسانة',
      likes: 32,
      type: 'tip',
      timeAgo: 'منذ 5 ساعات'
    }
  ]);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    const loadUserData = async () => {
      try {
        // Try to get user from sessionStorage (our temporary auth)
        const userData = sessionStorage.getItem('temp_user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
        
        // Simulate loading delay
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [isHydrated]);

  const handleAddCost = () => {
    setCosts([
      ...costs,
      { ...costForm, date: new Date().toLocaleDateString() }
    ]);
    setCostForm({ project: '', amount: '', store: '', note: '' });
    setShowAddCost(false);
  };

  const handleLogout = () => {
    // Clear all authentication data
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      localStorage.clear();
      // Remove all cookies
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      });
    }
    // Redirect to login page
    router.push('/login');
  };

  if (!isHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: 'نقاط الولاء',
      value: stats.loyaltyPoints.toLocaleString(),
      subtitle: `مستوى ${stats.currentLevel}`,
      icon: <Trophy className="w-6 h-6" />,
      href: '/user/gamification',
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600'
    },
    {
      title: 'الرصيد المتاح',
      value: `${stats.balanceAmount.toLocaleString()} ر.س`,
      subtitle: 'جاهز للاستخدام',
      icon: <Wallet className="w-6 h-6" />,
      href: '/user/balance',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'الرؤى الذكية',
      value: stats.aiInsights,
      subtitle: 'توصية جديدة',
      icon: <Brain className="w-6 h-6" />,
      href: '/user/smart-insights',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'المجتمع',
      value: stats.communityPosts,
      subtitle: 'منشورات هذا الشهر',
      icon: <Users className="w-6 h-6" />,
      href: '/user/social-community',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'المشاريع النشطة',
      value: stats.activeProjects,
      subtitle: 'قيد التنفيذ',
      icon: <Calendar className="w-6 h-6" />,
      href: '/user/projects/list',
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-600'
    },
    {
      title: 'الضمانات النشطة',
      value: stats.activeWarranties,
      subtitle: 'سارية المفعول',
      icon: <Shield className="w-6 h-6" />,
      href: '/user/warranties',
      color: 'bg-gradient-to-r from-teal-500 to-teal-600',
      textColor: 'text-teal-600'
    },
    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders,
      subtitle: 'طلب مكتمل',
      icon: <Box className="w-6 h-6" />,
      href: '/user/orders',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      textColor: 'text-orange-600'
    },
    {
      title: 'الإنفاق الشهري',
      value: `${stats.monthlySpent.toLocaleString()} ر.س`,
      subtitle: 'هذا الشهر',
      icon: <TrendingUp className="w-6 h-6" />,
      href: '/user/expenses',
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      textColor: 'text-red-600'
    }
  ];

  const quickActions = [
    { title: 'مركز الذكاء الاصطناعي', href: '/user/ai-hub', icon: <Brain className="w-6 h-6" />, color: 'from-purple-50 to-purple-100', textColor: 'text-purple-700' },
    { title: 'حاسبة البناء الشاملة', href: '/user/comprehensive-construction-calculator', icon: <Calculator className="w-6 h-6" />, color: 'from-blue-50 to-blue-100', textColor: 'text-blue-700' },
    { title: 'مركز المكافآت', href: '/user/gamification', icon: <Gift className="w-6 h-6" />, color: 'from-yellow-50 to-yellow-100', textColor: 'text-yellow-700' },
    { title: 'إدارة الرصيد', href: '/user/balance', icon: <Wallet className="w-6 h-6" />, color: 'from-green-50 to-green-100', textColor: 'text-green-700' },
    { title: 'مجتمع البناء', href: '/user/social-community', icon: <Users className="w-6 h-6" />, color: 'from-indigo-50 to-indigo-100', textColor: 'text-indigo-700' },
    { title: 'إدارة المشاريع', href: '/user/projects/list', icon: <Building2 className="w-6 h-6" />, color: 'from-emerald-50 to-emerald-100', textColor: 'text-emerald-700' },
    { title: 'إدارة الضمانات', href: '/user/warranties', icon: <Shield className="w-6 h-6" />, color: 'from-teal-50 to-teal-100', textColor: 'text-teal-700' },
    { title: 'خطط الاشتراك', href: '/user/subscriptions', icon: <Crown className="w-6 h-6" />, color: 'from-rose-50 to-rose-100', textColor: 'text-rose-700' },
    { title: 'إعدادات الحساب', href: '/user/settings', icon: <Settings className="w-6 h-6" />, color: 'from-gray-50 to-gray-100', textColor: 'text-gray-700' }
  ];

  const userPanelLinks = [
    { label: 'لوحة التحكم', href: '/user/dashboard', icon: <Home className="w-5 h-5" /> },
    { label: 'مشاريعي', href: '/user/projects/list', icon: <Folder className="w-5 h-5" /> },
    { label: 'مركز الذكاء الاصطناعي', href: '/user/ai-hub', icon: <Brain className="w-5 h-5" /> },
    { label: 'مجتمع البناء', href: '/user/social-community', icon: <Users className="w-5 h-5" /> },
    { label: 'مركز المكافآت', href: '/user/gamification', icon: <Trophy className="w-5 h-5" /> },
    { label: 'إدارة الرصيد', href: '/user/balance', icon: <Wallet className="w-5 h-5" /> },
    { label: 'خطط الاشتراك', href: '/user/subscriptions', icon: <Crown className="w-5 h-5" /> },
    { label: 'إدارة الضمانات', href: '/user/warranties', icon: <Shield className="w-5 h-5" /> },
    { label: 'الملف الشخصي', href: '/user/profile', icon: <UserIcon className="w-5 h-5" /> },
    { label: 'تصفح المتاجر', href: '/stores', icon: <Store className="w-5 h-5" /> },
    { label: 'الإعدادات', href: '/user/settings', icon: <Settings className="w-5 h-5" /> },
    { label: 'تسجيل الخروج', action: 'logout', icon: <LogOut className="w-5 h-5 text-red-600" />, danger: true },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal" dir="rtl" style={{ fontFamily: "'Tajawal', 'Cairo', 'Arial Unicode MS', sans-serif" }}>
      <div className="container mx-auto px-6 py-8">
        {/* Modern User Panel */}
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {userPanelLinks.map((item, idx) => (
              item.action === 'logout' ? (
                <button key={idx} onClick={handleLogout} className="block">
                  <EnhancedCard
                    variant="elevated"
                    hover
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 hover:scale-105 border border-red-200 bg-red-50 hover:bg-red-100"
                  >
                    <div className="rounded-full p-2 bg-red-100">{item.icon}</div>
                    <Typography variant="caption" size="sm" className="text-center text-red-700">{item.label}</Typography>
                  </EnhancedCard>
                </button>
              ) : (
                <Link key={idx} href={item.href || '#'} className="block">
                  <EnhancedCard
                    variant="elevated"
                    hover
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${item.danger ? 'border border-red-200 bg-red-50 hover:bg-red-100' : 'bg-white/80'}`}
                  >
                    <div className={`rounded-full p-2 ${item.danger ? 'bg-red-100' : 'bg-blue-100'}`}>{item.icon}</div>
                    <Typography variant="caption" size="sm" className={`text-center ${item.danger ? 'text-red-700' : 'text-blue-800'}`}>{item.label}</Typography>
                  </EnhancedCard>
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Success Message */}
        <EnhancedCard variant="elevated" className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <Typography variant="subheading" size="lg" weight="semibold" className="text-green-800 mb-1">
                تم تسجيل الدخول بنجاح!
              </Typography>
              <Typography variant="body" size="sm" className="text-green-700">
                أنت الآن في صفحة لوحة التحكم المحمية
              </Typography>
            </div>
          </div>
        </EnhancedCard>

        {/* Header */}
        <div className="mb-8">
          <Typography variant="heading" size="3xl" weight="bold" className="text-gray-800 mb-3">
            مرحباً، {user?.name || user?.email?.split('@')[0] || 'المستخدم'}! 👋
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-600">
            إليك نظرة عامة على حسابك ومشاريعك
          </Typography>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Link key={index} href={card.href}>
              <EnhancedCard
                variant="elevated"
                hover
                className="group cursor-pointer transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body" size="sm" className="text-gray-600 mb-1">
                      {card.title}
                    </Typography>
                    <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800">
                      {card.value}
                    </Typography>
                  </div>
                  <div className={`p-3 rounded-lg ${card.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                </div>
              </EnhancedCard>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <EnhancedCard variant="elevated" className="mb-8 bg-white/80 backdrop-blur-sm">
          <div className="mb-6">
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2">
              الإجراءات السريعة ⚡
            </Typography>
            <Typography variant="body" size="sm" className="text-gray-600">
              الوصول السريع لأهم الأدوات والميزات
            </Typography>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="group flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:scale-105 border border-blue-100">
                  <div className="mb-3 p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                    {action.icon}
                  </div>
                  <Typography variant="caption" size="sm" className="text-blue-800 group-hover:text-blue-900">
                    {action.title}
                  </Typography>
                </div>
              </Link>
            ))}
          </div>
        </EnhancedCard>

        {/* Community Highlights & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Community Highlights */}
          <EnhancedCard variant="elevated" className="bg-white/80 backdrop-blur-sm">
            <div className="mb-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                أبرز المجتمع 👥
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                احدث الأنشطة والإحصائيات
              </Typography>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الأعضاء النشطون</span>
                <span className="text-lg font-bold text-indigo-600">15,420</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">مشاريع مشتركة</span>
                <span className="text-lg font-bold text-blue-600">2,340</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">نصائح هذا الأسبوع</span>
                <span className="text-lg font-bold text-green-600">156</span>
              </div>
              <div className="border-t pt-4">
                <Link href="/user/social-community" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  انضم للمحادثة ←
                </Link>
              </div>
            </div>
          </EnhancedCard>

          {/* AI Insights */}
          <EnhancedCard variant="elevated" className="bg-white/80 backdrop-blur-sm">
            <div className="mb-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                الرؤى الذكية 🧠
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                توصيات مخصصة لك
              </Typography>
            </div>
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">توفير محتمل</p>
                    <p className="text-xs text-purple-600">يمكنك توفير 15% من تكاليف المواد</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">توصية ذكية</p>
                    <p className="text-xs text-blue-600">الوقت المثالي لبدء مشروع الأسقف</p>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <Link href="/user/smart-insights" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  عرض جميع الرؤى ←
                </Link>
              </div>
            </div>
          </EnhancedCard>

          {/* Gamification Progress */}
          <EnhancedCard variant="elevated" className="bg-white/80 backdrop-blur-sm">
            <div className="mb-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                مركز المكافآت 🏆
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                تقدمك ومكافآتك
              </Typography>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <Typography variant="body" weight="bold" className="text-gray-800">المستوى الذهبي</Typography>
                <Typography variant="caption" size="sm" className="text-gray-600">12,450 نقطة</Typography>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="text-center">
                <Typography variant="caption" size="xs" className="text-gray-600">2,550 نقطة للمستوى التالي</Typography>
              </div>
              <div className="border-t pt-4">
                <Link href="/user/gamification" className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                  عرض المكافآت ←
                </Link>
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* Cost Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Add Cost Form */}
          <EnhancedCard variant="elevated" className="bg-white/80 backdrop-blur-sm">
            <div className="mb-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2">
                إدارة التكاليف 💰
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                أضف وتتبع تكاليف مشاريعك
              </Typography>
            </div>
            
            {!showAddCost ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowAddCost(true)}
                className="w-full"
              >
                <Box className="w-5 h-5 ml-2" />
                إضافة تكلفة جديدة
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المشروع</label>
                  <input
                    type="text"
                    value={costForm.project}
                    onChange={(e) => setCostForm(prev => ({ ...prev, project: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اسم المشروع"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (ريال)</label>
                  <input
                    type="number"
                    value={costForm.amount}
                    onChange={(e) => setCostForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المتجر</label>
                  <input
                    type="text"
                    value={costForm.store}
                    onChange={(e) => setCostForm(prev => ({ ...prev, store: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اسم المتجر"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظة</label>
                  <textarea
                    value={costForm.note}
                    onChange={(e) => setCostForm(prev => ({ ...prev, note: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="ملاحظات إضافية..."
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    onClick={handleAddCost}
                    className="flex-1"
                  >
                    حفظ
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddCost(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </EnhancedCard>

          {/* Recent Costs */}
          <EnhancedCard variant="elevated" className="bg-white/80 backdrop-blur-sm">
            <div className="mb-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2">
                التكاليف الأخيرة 📊
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                نظرة على آخر التكاليف المضافة
              </Typography>
            </div>
            
            {costs.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <Typography variant="body" size="sm" className="text-gray-500">
                  لا توجد تكاليف مضافة بعد
                </Typography>
              </div>
            ) : (
              <div className="space-y-3">
                {costs.map((cost, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <Typography variant="body" weight="medium" className="text-gray-800">
                          {cost.project}
                        </Typography>
                        <Typography variant="caption" size="sm" className="text-gray-600">
                          {cost.store} • {cost.date}
                        </Typography>
                      </div>
                      <Typography variant="body" weight="semibold" className="text-green-600">
                        {cost.amount} ريال
                      </Typography>
                    </div>
                    {cost.note && (
                      <Typography variant="caption" size="sm" className="text-gray-500 mt-1">
                        {cost.note}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            )}
          </EnhancedCard>
        </div>

        {/* Recent Activity */}
        <EnhancedCard variant="elevated" className="bg-white/80 backdrop-blur-sm">
          <div className="mb-6">
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-2">
              النشاط الأخير 🕐
            </Typography>
            <Typography variant="body" size="sm" className="text-gray-600">
              تتبع آخر الأنشطة والتحديثات
            </Typography>
          </div>
          
          <div className="space-y-4">
            {[
              { action: 'تم إنشاء مشروع جديد', time: 'قبل ساعتين', icon: <Calendar className="w-4 h-4" /> },
              { action: 'تم تحديث الملف الشخصي', time: 'قبل 3 ساعات', icon: <UserIcon className="w-4 h-4" /> },
              { action: 'تم استلام فاتورة جديدة', time: 'قبل يوم واحد', icon: <File className="w-4 h-4" /> },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <Typography variant="body" size="sm" className="text-gray-800">
                    {activity.action}
                  </Typography>
                  <Typography variant="caption" size="xs" className="text-gray-500">
                    {activity.time}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </EnhancedCard>
      </div>
    </main>
  );
}
