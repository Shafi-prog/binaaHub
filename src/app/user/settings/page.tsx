"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { User, Settings, Bell, Shield, Key, CreditCard, Globe, Moon, Sun, Smartphone, Monitor } from 'lucide-react';

export const dynamic = 'force-dynamic'

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar?: string;
  memberSince: string;
  accountType: 'free' | 'pro' | 'premium';
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
  orderUpdates: boolean;
  priceAlerts: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'أحمد محمد السعيد',
    email: 'ahmed.mohamed@example.com',
    phone: '+966501234567',
    city: 'الرياض',
    memberSince: '2024-01-15',
    accountType: 'free'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    marketing: false,
    orderUpdates: true,
    priceAlerts: true
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: 60
  });

  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [language, setLanguage] = useState('ar');
  const [activeTab, setActiveTab] = useState('profile');

  const handleProfileUpdate = () => {
    // Handle profile update logic
    console.log('Profile updated:', profile);
  };

  const handleNotificationUpdate = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSecurityUpdate = (key: keyof SecuritySettings, value: any) => {
    setSecurity(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getAccountTypeText = (type: string) => {
    switch(type) {
      case 'free': return 'مجاني';
      case 'pro': return 'احترافي';
      case 'premium': return 'مميز';
      default: return 'غير محدد';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch(type) {
      case 'free': return 'bg-gray-100 text-gray-700';
      case 'pro': return 'bg-blue-100 text-blue-700';
      case 'premium': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs = [
    { id: 'profile', label: 'الملف الشخصي', icon: <User className="w-5 h-5" /> },
    { id: 'notifications', label: 'الإشعارات', icon: <Bell className="w-5 h-5" /> },
    { id: 'security', label: 'الأمان', icon: <Shield className="w-5 h-5" /> },
    { id: 'preferences', label: 'التفضيلات', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          إعدادات الحساب
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          إدارة معلوماتك الشخصية وتفضيلات الحساب
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <EnhancedCard className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </EnhancedCard>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <EnhancedCard className="p-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="mb-6">الملف الشخصي</Typography>
              
              {/* Account Status */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="subheading" size="lg" weight="semibold" className="mb-1">نوع الحساب</Typography>
                    <Typography variant="caption" size="sm" className="text-gray-600">
                      عضو منذ {new Date(profile.memberSince).toLocaleDateString('en-US')}
                    </Typography>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAccountTypeColor(profile.accountType)}`}>
                    {getAccountTypeText(profile.accountType)}
                  </span>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                    <select
                      value={profile.city}
                      onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="الرياض">الرياض</option>
                      <option value="جدة">جدة</option>
                      <option value="الدمام">الدمام</option>
                      <option value="مكة المكرمة">مكة المكرمة</option>
                      <option value="المدينة المنورة">المدينة المنورة</option>
                      <option value="الطائف">الطائف</option>
                      <option value="تبوك">تبوك</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                </div>
                
                <Button
                  onClick={handleProfileUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  حفظ التغييرات
                </Button>
              </div>
            </EnhancedCard>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <EnhancedCard className="p-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="mb-6">إعدادات الإشعارات</Typography>
              
              <div className="space-y-6">
                <div>
                  <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">طرق الإشعار</Typography>
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'إشعارات البريد الإلكتروني', description: 'تلقي إشعارات عبر البريد الإلكتروني' },
                      { key: 'sms', label: 'إشعارات الرسائل النصية', description: 'تلقي إشعارات عبر الرسائل النصية' },
                      { key: 'push', label: 'الإشعارات الفورية', description: 'تلقي إشعارات فورية عبر التطبيق' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <Typography variant="subheading" size="lg" weight="semibold">{item.label}</Typography>
                          <Typography variant="caption" size="sm" className="text-gray-600">{item.description}</Typography>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof NotificationSettings] as boolean}
                            onChange={() => handleNotificationUpdate(item.key as keyof NotificationSettings)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">أنواع الإشعارات</Typography>
                  <div className="space-y-4">
                    {[
                      { key: 'orderUpdates', label: 'تحديثات الطلبات', description: 'إشعارات حول حالة طلباتك' },
                      { key: 'priceAlerts', label: 'تنبيهات الأسعار', description: 'إشعارات عند تغير أسعار المنتجات المفضلة' },
                      { key: 'marketing', label: 'العروض التسويقية', description: 'إشعارات حول العروض والخصومات' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <Typography variant="subheading" size="lg" weight="semibold">{item.label}</Typography>
                          <Typography variant="caption" size="sm" className="text-gray-600">{item.description}</Typography>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof NotificationSettings] as boolean}
                            onChange={() => handleNotificationUpdate(item.key as keyof NotificationSettings)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </EnhancedCard>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <EnhancedCard className="p-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="mb-6">إعدادات الأمان</Typography>
              
              <div className="space-y-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <Typography variant="subheading" size="lg" weight="semibold">المصادقة الثنائية</Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">حماية إضافية لحسابك</Typography>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.twoFactor}
                        onChange={(e) => handleSecurityUpdate('twoFactor', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {security.twoFactor && (
                    <Button variant="outline" className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => alert('Button clicked')}>
                      إعداد المصادقة الثنائية
                    </Button>
                  )}
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="subheading" size="lg" weight="semibold">تنبيهات تسجيل الدخول</Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">إشعار عند تسجيل دخول جديد</Typography>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.loginAlerts}
                        onChange={(e) => handleSecurityUpdate('loginAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <Typography variant="subheading" size="lg" weight="semibold" className="mb-2">مهلة انتهاء الجلسة</Typography>
                  <Typography variant="caption" size="sm" className="text-gray-600 mb-4">
                    مدة بقاء الجلسة نشطة (بالدقائق)
                  </Typography>
                  <select
                    value={security.sessionTimeout}
                    onChange={(e) => handleSecurityUpdate('sessionTimeout', parseInt(e.target.value))}
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={30}>30 دقيقة</option>
                    <option value={60}>60 دقيقة</option>
                    <option value={120}>120 دقيقة</option>
                    <option value={0}>بدون انتهاء</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                   onClick={() => alert('Button clicked')}>
                    <Key className="w-4 h-4" />
                    تغيير كلمة المرور
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                   onClick={() => alert('Button clicked')}>
                    تسجيل الخروج من جميع الأجهزة
                  </Button>
                </div>
              </div>
            </EnhancedCard>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <EnhancedCard className="p-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="mb-6">التفضيلات</Typography>
              
              <div className="space-y-6">
                <div>
                  <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">المظهر</Typography>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'light', label: 'فاتح', icon: <Sun className="w-5 h-5" /> },
                      { value: 'dark', label: 'داكن', icon: <Moon className="w-5 h-5" /> },
                      { value: 'auto', label: 'تلقائي', icon: <Monitor className="w-5 h-5" /> }
                    ].map((option) => (
                      <div
                        key={option.value}
                        onClick={() => setTheme(option.value as 'light' | 'dark' | 'auto')}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          theme === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {option.icon}
                          <Typography variant="subheading" size="lg" weight="semibold">{option.label}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">اللغة</Typography>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">إدارة البيانات</Typography>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                     onClick={() => alert('Button clicked')}>
                      تنزيل بياناتي
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full border-red-300 text-red-700 hover:bg-red-50"
                     onClick={() => alert('Button clicked')}>
                      حذف الحساب
                    </Button>
                  </div>
                </div>
              </div>
            </EnhancedCard>
          )}
        </div>
      </div>

      {/* Floating Help */}
      <Link href="/user/help-center" className="fixed bottom-8 left-8 bg-blue-600 text-white rounded-full shadow-lg px-5 py-3 hover:bg-blue-700 z-50">
        مساعدة؟
      </Link>
    </div>
  );
}
