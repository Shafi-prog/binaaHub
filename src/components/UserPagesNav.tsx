'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Trophy, 
  Brain, 
  Wallet, 
  Crown, 
  Shield, 
  Bot,
  FileText,
  Heart,
  MessageSquare,
  HelpCircle,
  Headphones,
  Settings
} from 'lucide-react';
import { Typography } from '@/core/shared/components/ui/enhanced-components';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}

const UserPagesNav: React.FC = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    // Core Features
    { 
      label: 'لوحة التحكم', 
      href: '/user/dashboard', 
      icon: <Home className="w-5 h-5" />, 
      description: 'نظرة عامة على حسابك',
      category: 'الأساسيات'
    },
    { 
      label: 'المساعد الذكي', 
      href: '/user/ai-assistant', 
      icon: <Bot className="w-5 h-5" />, 
      description: 'مساعد ذكي لمشاريع البناء',
      category: 'الأساسيات'
    },
    { 
      label: 'إدارة الرصيد', 
      href: '/user/balance', 
      icon: <Wallet className="w-5 h-5" />, 
      description: 'إدارة أموالك ومدفوعاتك',
      category: 'الأساسيات'
    },

    // New Advanced Features
    { 
      label: 'مجتمع البناء', 
      href: '/user/social-community', 
      icon: <Users className="w-5 h-5" />, 
      description: 'تواصل مع خبراء البناء',
      category: 'المجتمع والتفاعل'
    },
    { 
      label: 'مركز المكافآت', 
      href: '/user/gamification', 
      icon: <Trophy className="w-5 h-5" />, 
      description: 'نقاط الولاء والمكافآت',
      category: 'المجتمع والتفاعل'
    },
    { 
      label: 'الرؤى الذكية', 
      href: '/user/smart-insights', 
      icon: <Brain className="w-5 h-5" />, 
      description: 'تحليلات ذكية وتوصيات',
      category: 'الذكاء الاصطناعي'
    },

    // Subscription & Management
    { 
      label: 'خطط الاشتراك', 
      href: '/user/subscriptions', 
      icon: <Crown className="w-5 h-5" />, 
      description: 'إدارة اشتراكاتك ومميزاتك',
      category: 'الإدارة والخدمات'
    },
    { 
      label: 'إدارة الضمانات', 
      href: '/user/warranties', 
      icon: <Shield className="w-5 h-5" />, 
      description: 'ضمانات منتجاتك وخدماتك',
      category: 'الإدارة والخدمات'
    },

    // User Support Features
    { 
      label: 'إدارة الملفات', 
      href: '/user/documents', 
      icon: <FileText className="w-5 h-5" />, 
      description: 'ملفاتك ومستنداتك',
      category: 'الدعم والمساعدة'
    },
    { 
      label: 'المفضلة', 
      href: '/user/favorites', 
      icon: <Heart className="w-5 h-5" />, 
      description: 'منتجاتك وخدماتك المفضلة',
      category: 'الدعم والمساعدة'
    },
    { 
      label: 'تقييم الخدمة', 
      href: '/user/feedback', 
      icon: <MessageSquare className="w-5 h-5" />, 
      description: 'شاركنا رأيك وتقييمك',
      category: 'الدعم والمساعدة'
    },
    { 
      label: 'مركز المساعدة', 
      href: '/user/help-center', 
      icon: <HelpCircle className="w-5 h-5" />, 
      description: 'الأسئلة الشائعة والأدلة',
      category: 'الدعم والمساعدة'
    },
    { 
      label: 'الدعم الفني', 
      href: '/user/support', 
      icon: <Headphones className="w-5 h-5" />, 
      description: 'تواصل مع فريق الدعم',
      category: 'الدعم والمساعدة'
    },
    { 
      label: 'الإعدادات', 
      href: '/user/settings', 
      icon: <Settings className="w-5 h-5" />, 
      description: 'إعدادات حسابك وتفضيلاتك',
      category: 'الإدارة والخدمات'
    }
  ];

  const groupedItems = navItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6" dir="rtl">
      <div className="mb-6">
        <Typography variant="heading" size="xl" weight="bold" className="text-gray-800 mb-2">
          🗺️ خريطة ميزات المستخدم
        </Typography>
        <Typography variant="body" size="sm" className="text-gray-600">
          اكتشف جميع الميزات والخدمات المتاحة لك
        </Typography>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-4 pb-2 border-b border-gray-200">
              {category}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                      isActive 
                        ? 'bg-blue-50 border-blue-200 shadow-sm' 
                        : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg transition-colors duration-300 ${
                        isActive 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-white text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <Typography 
                          variant="body" 
                          weight="semibold" 
                          className={`mb-1 ${isActive ? 'text-blue-800' : 'text-gray-800 group-hover:text-blue-800'}`}
                        >
                          {item.label}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          size="xs" 
                          className={`${isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'}`}
                        >
                          {item.description}
                        </Typography>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <Typography variant="body" weight="semibold" className="text-blue-800 mb-2">
          💡 نصيحة: استكشف جميع الميزات
        </Typography>
        <Typography variant="caption" size="sm" className="text-blue-700">
          استخدم مركز المكافآت لكسب نقاط من خلال استخدام الميزات المختلفة، وتفاعل مع المجتمع للحصول على نصائح قيمة، واستفد من الرؤى الذكية لتحسين مشاريعك.
        </Typography>
      </div>
    </div>
  );
};

export default UserPagesNav;
