'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { 
  Settings,
  Store,
  CreditCard,
  Shield,
  Bell,
  Globe,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Check,
  X,
  AlertCircle,
  Info
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WathqVerification from '@/components/WathqVerification';

interface StoreSettings {
  // Basic Information
  store_name: string;
  description: string;
  category: string;
  phone: string;
  email: string;
  website: string;
  
  // Address Information
  address: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  
  // Business Information
  commercial_registration: string;
  vat_number: string;
  business_license: string;
  
  // Invoice Settings
  invoice_prefix: string;
  invoice_counter: number;
  default_vat_rate: number;
  currency: string;
  payment_terms: string;
  
  // ZATCA Settings
  zatca_enabled: boolean;
  zatca_environment: 'sandbox' | 'production';
  zatca_certificate_path?: string;
  zatca_private_key_path?: string;
  
  // Notification Settings
  email_notifications: boolean;
  sms_notifications: boolean;
  low_stock_alerts: boolean;
  order_notifications: boolean;
  
  // Display Settings
  logo_url?: string;
  cover_image_url?: string;
  theme_color: string;
  language: string;
  timezone: string;
  
  // Business Hours
  working_hours: {
    [key: string]: {
      open: string;
      close: string;
      is_closed: boolean;
    };
  };
  
  // Delivery Settings
  delivery_areas: string[];
  delivery_fee: number;
  free_delivery_threshold: number;
  
  // Store Features
  is_active: boolean;
  is_verified: boolean;
  accept_orders: boolean;
  show_in_directory: boolean;
}

export default function StoreSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [showPassword, setShowPassword] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  const tabs = [
    { id: 'basic', label: 'المعلومات الأساسية', icon: Store },
    { id: 'business', label: 'معلومات الأعمال', icon: CreditCard },
    { id: 'invoicing', label: 'إعدادات الفوترة', icon: Settings },
    { id: 'zatca', label: 'إعدادات زاتكا', icon: Shield },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'display', label: 'العرض والتصميم', icon: Eye },
    { id: 'hours', label: 'ساعات العمل', icon: Globe },
    { id: 'delivery', label: 'التوصيل', icon: MapPin }
  ];

  useEffect(() => {
    loadStoreSettings();
  }, []);

  const loadStoreSettings = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Load store settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('store_id', currentUser.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error loading settings:', settingsError);
        return;
      }

      // Load store profile
      const { data: storeData, error: storeError } = await supabase
        .from('store_profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (storeError && storeError.code !== 'PGRST116') {
        console.error('Error loading store profile:', storeError);
      }

      // Merge settings with defaults
      const defaultSettings: StoreSettings = {
        store_name: storeData?.store_name || '',
        description: storeData?.description || '',
        category: storeData?.category || 'construction',
        phone: storeData?.phone || '',
        email: storeData?.email || '',
        website: storeData?.website || '',
        
        address: storeData?.address || '',
        city: storeData?.city || '',
        region: storeData?.region || '',
        postal_code: storeData?.postal_code || '',
        country: 'SA',
        
        commercial_registration: storeData?.commercial_registration || '',
        vat_number: storeData?.vat_number || '',
        business_license: storeData?.business_license || '',
        
        invoice_prefix: settingsData?.invoice_prefix || 'INV',
        invoice_counter: settingsData?.invoice_counter || 1,
        default_vat_rate: settingsData?.default_vat_rate || 0.15,
        currency: settingsData?.currency || 'SAR',
        payment_terms: settingsData?.payment_terms || 'Net 30',
        
        zatca_enabled: settingsData?.zatca_enabled || false,
        zatca_environment: settingsData?.zatca_environment || 'sandbox',
        zatca_certificate_path: settingsData?.zatca_certificate_path || '',
        zatca_private_key_path: settingsData?.zatca_private_key_path || '',
        
        email_notifications: settingsData?.email_notifications ?? true,
        sms_notifications: settingsData?.sms_notifications ?? false,
        low_stock_alerts: settingsData?.low_stock_alerts ?? true,
        order_notifications: settingsData?.order_notifications ?? true,
        
        logo_url: storeData?.logo_url || '',
        cover_image_url: storeData?.cover_image_url || '',
        theme_color: settingsData?.theme_color || '#3B82F6',
        language: settingsData?.language || 'ar',
        timezone: settingsData?.timezone || 'Asia/Riyadh',
        
        working_hours: settingsData?.working_hours || {
          sunday: { open: '08:00', close: '17:00', is_closed: false },
          monday: { open: '08:00', close: '17:00', is_closed: false },
          tuesday: { open: '08:00', close: '17:00', is_closed: false },
          wednesday: { open: '08:00', close: '17:00', is_closed: false },
          thursday: { open: '08:00', close: '17:00', is_closed: false },
          friday: { open: '08:00', close: '17:00', is_closed: true },
          saturday: { open: '08:00', close: '17:00', is_closed: false }
        },
        
        delivery_areas: settingsData?.delivery_areas || [],
        delivery_fee: settingsData?.delivery_fee || 0,
        free_delivery_threshold: settingsData?.free_delivery_threshold || 500,
        
        is_active: storeData?.is_active ?? true,
        is_verified: storeData?.is_verified ?? false,
        accept_orders: settingsData?.accept_orders ?? true,
        show_in_directory: settingsData?.show_in_directory ?? true
      };

      setSettings(defaultSettings);

    } catch (error) {
      console.error('Error loading store settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const updateWorkingHours = (day: string, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      working_hours: {
        ...settings.working_hours,
        [day]: {
          ...settings.working_hours[day],
          [field]: value
        }
      }
    });
  };

  const saveSettings = async () => {
    if (!settings || !user) return;
    
    try {
      setSaving(true);

      // Update store profile
      const storeProfileData = {
        user_id: user.id,
        store_name: settings.store_name,
        description: settings.description,
        category: settings.category,
        phone: settings.phone,
        email: settings.email,
        website: settings.website,
        address: settings.address,
        city: settings.city,
        region: settings.region,
        postal_code: settings.postal_code,
        commercial_registration: settings.commercial_registration,
        vat_number: settings.vat_number,
        business_license: settings.business_license,
        logo_url: settings.logo_url,
        cover_image_url: settings.cover_image_url,
        is_active: settings.is_active,
        is_verified: settings.is_verified
      };

      const { error: profileError } = await supabase
        .from('store_profiles')
        .upsert(storeProfileData);

      if (profileError) throw profileError;

      // Update store settings
      const storeSettingsData = {
        store_id: user.id,
        invoice_prefix: settings.invoice_prefix,
        invoice_counter: settings.invoice_counter,
        default_vat_rate: settings.default_vat_rate,
        currency: settings.currency,
        payment_terms: settings.payment_terms,
        zatca_enabled: settings.zatca_enabled,
        zatca_environment: settings.zatca_environment,
        zatca_certificate_path: settings.zatca_certificate_path,
        zatca_private_key_path: settings.zatca_private_key_path,
        email_notifications: settings.email_notifications,
        sms_notifications: settings.sms_notifications,
        low_stock_alerts: settings.low_stock_alerts,
        order_notifications: settings.order_notifications,
        theme_color: settings.theme_color,
        language: settings.language,
        timezone: settings.timezone,
        working_hours: settings.working_hours,
        delivery_areas: settings.delivery_areas,
        delivery_fee: settings.delivery_fee,
        free_delivery_threshold: settings.free_delivery_threshold,
        accept_orders: settings.accept_orders,
        show_in_directory: settings.show_in_directory
      };

      const { error: settingsError } = await supabase
        .from('store_settings')
        .upsert(storeSettingsData);

      if (settingsError) throw settingsError;

      alert('تم حفظ الإعدادات بنجاح');

    } catch (error) {
      console.error('Error saving settings:', error);
      alert('حدث خطأ في حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'logo' | 'cover') => {
    // Placeholder for file upload functionality
    alert('سيتم تنفيذ رفع الملفات قريباً');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إعدادات</h3>
          <p className="text-gray-500">حدث خطأ في تحميل إعدادات المتجر</p>
        </div>
      </div>
    );
  }

  const renderBasicTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم المتجر *
          </label>
          <Input
            value={settings.store_name}
            onChange={(e) => updateSetting('store_name', e.target.value)}
            placeholder="أدخل اسم المتجر"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            فئة المتجر
          </label>
          <select
            value={settings.category}
            onChange={(e) => updateSetting('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="construction">مواد البناء</option>
            <option value="tools">أدوات ومعدات</option>
            <option value="electrical">كهربائي</option>
            <option value="plumbing">صحي</option>
            <option value="hardware">عدد يدوية</option>
            <option value="general">عام</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          وصف المتجر
        </label>
        <textarea
          rows={4}
          value={settings.description}
          onChange={(e) => updateSetting('description', e.target.value)}
          placeholder="أدخل وصف مختصر للمتجر..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم الهاتف
          </label>
          <Input
            value={settings.phone}
            onChange={(e) => updateSetting('phone', e.target.value)}
            placeholder="+966xxxxxxxxx"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            البريد الإلكتروني
          </label>
          <Input
            type="email"
            value={settings.email}
            onChange={(e) => updateSetting('email', e.target.value)}
            placeholder="store@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          موقع الويب
        </label>
        <Input
          value={settings.website}
          onChange={(e) => updateSetting('website', e.target.value)}
          placeholder="https://www.yourstore.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العنوان
          </label>
          <Input
            value={settings.address}
            onChange={(e) => updateSetting('address', e.target.value)}
            placeholder="أدخل العنوان الكامل"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المدينة
          </label>
          <Input
            value={settings.city}
            onChange={(e) => updateSetting('city', e.target.value)}
            placeholder="الرياض"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المنطقة
          </label>
          <select
            value={settings.region}
            onChange={(e) => updateSetting('region', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">اختر المنطقة</option>
            <option value="riyadh">منطقة الرياض</option>
            <option value="makkah">منطقة مكة المكرمة</option>
            <option value="eastern">المنطقة الشرقية</option>
            <option value="madinah">منطقة المدينة المنورة</option>
            <option value="qassim">منطقة القصيم</option>
            <option value="asir">منطقة عسير</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الرمز البريدي
          </label>
          <Input
            value={settings.postal_code}
            onChange={(e) => updateSetting('postal_code', e.target.value)}
            placeholder="12345"
          />
        </div>
      </div>
    </div>
  );

  const renderBusinessTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <Info className="w-5 h-5 text-yellow-600 ml-2 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            تأكد من صحة هذه المعلومات لضمان التوافق مع اللوائح السعودية ومتطلبات زاتكا
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          السجل التجاري *
        </label>
        <Input
          value={settings.commercial_registration}
          onChange={(e) => updateSetting('commercial_registration', e.target.value)}
          placeholder="1010123456"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الرقم الضريبي *
        </label>
        <Input
          value={settings.vat_number}
          onChange={(e) => updateSetting('vat_number', e.target.value)}
          placeholder="300000000000003"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          رخصة الأعمال
        </label>
        <Input
          value={settings.business_license}
          onChange={(e) => updateSetting('business_license', e.target.value)}
          placeholder="رقم رخصة الأعمال"
        />
      </div>

      {/* Wathq Verification Component */}
      <Card className="p-6">        <h4 className="text-lg font-semibold text-gray-900 mb-4">التحقق من السجل التجاري</h4>
        <WathqVerification 
          initialCRNumber={settings.commercial_registration}
          onVerificationComplete={(record) => {
            if (record) {
              console.log('Commercial Registration verified:', record);
            }
          }}
          onVerificationError={(error) => {
            console.error('Verification error:', error);
          }}
        />
      </Card>
    </div>
  );

  const renderInvoicingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            بادئة رقم الفاتورة
          </label>
          <Input
            value={settings.invoice_prefix}
            onChange={(e) => updateSetting('invoice_prefix', e.target.value)}
            placeholder="INV"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم الفاتورة التالي
          </label>
          <Input
            type="number"
            value={settings.invoice_counter}
            onChange={(e) => updateSetting('invoice_counter', parseInt(e.target.value) || 1)}
            min="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            معدل ضريبة القيمة المضافة الافتراضي
          </label>
          <select
            value={settings.default_vat_rate}
            onChange={(e) => updateSetting('default_vat_rate', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>0% - معفي</option>
            <option value={0.05}>5% - معدل مخفض</option>
            <option value={0.15}>15% - المعدل القياسي</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العملة
          </label>
          <select
            value={settings.currency}
            onChange={(e) => updateSetting('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="SAR">ريال سعودي (SAR)</option>
            <option value="USD">دولار أمريكي (USD)</option>
            <option value="EUR">يورو (EUR)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          شروط الدفع الافتراضية
        </label>
        <select
          value={settings.payment_terms}
          onChange={(e) => updateSetting('payment_terms', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="Due on Receipt">مستحق عند الاستلام</option>
          <option value="Net 7">7 أيام</option>
          <option value="Net 15">15 يوم</option>
          <option value="Net 30">30 يوم</option>
          <option value="Net 60">60 يوم</option>
        </select>
      </div>
    </div>
  );

  const renderZATCATab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <Shield className="w-5 h-5 text-blue-600 ml-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            إعدادات زاتكا مطلوبة للتوافق مع متطلبات الفوترة الإلكترونية في المملكة العربية السعودية
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">تفعيل زاتكا</h4>
          <p className="text-sm text-gray-600">تمكين الفوترة الإلكترونية المتوافقة مع زاتكا</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.zatca_enabled}
            onChange={(e) => updateSetting('zatca_enabled', e.target.checked)}
            className="sr-only"
          />
          <div className={`w-11 h-6 rounded-full ${settings.zatca_enabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${settings.zatca_enabled ? 'translate-x-6' : 'translate-x-1'} mt-1`} />
          </div>
        </label>
      </div>

      {settings.zatca_enabled && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البيئة
            </label>
            <select
              value={settings.zatca_environment}
              onChange={(e) => updateSetting('zatca_environment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="sandbox">تجريبية (Sandbox)</option>
              <option value="production">إنتاج (Production)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مسار شهادة زاتكا
            </label>
            <div className="flex gap-2">
              <Input
                value={settings.zatca_certificate_path || ''}
                onChange={(e) => updateSetting('zatca_certificate_path', e.target.value)}
                placeholder="/path/to/certificate.pem"
                className="flex-1"
              />
              <Button variant="outline">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مسار المفتاح الخاص
            </label>
            <div className="flex gap-2">
              <Input
                type={showPassword ? "text" : "password"}
                value={settings.zatca_private_key_path || ''}
                onChange={(e) => updateSetting('zatca_private_key_path', e.target.value)}
                placeholder="/path/to/private_key.pem"
                className="flex-1"
              />
              <Button 
                variant="outline"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-600 ml-2" />
              <div className="text-sm text-green-800">
                {settings.zatca_environment === 'sandbox' 
                  ? 'أنت في البيئة التجريبية. يمكنك اختبار الفواتير دون التأثير على النظام الحقيقي.'
                  : 'أنت في بيئة الإنتاج. سيتم إرسال الفواتير إلى زاتكا فعلياً.'
                }
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إعدادات المتجر</h1>
              <p className="mt-1 text-sm text-gray-600">
                إدارة إعدادات متجرك ومعلومات العمل
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={loadStoreSettings}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Button 
                onClick={saveSettings}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className={`w-4 h-4 ml-2 ${saving ? 'animate-spin' : ''}`} />
                حفظ الإعدادات
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5 ml-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card className="p-8">
              {activeTab === 'basic' && renderBasicTab()}
              {activeTab === 'business' && renderBusinessTab()}
              {activeTab === 'invoicing' && renderInvoicingTab()}
              {activeTab === 'zatca' && renderZATCATab()}
              {/* Add other tab renderers as needed */}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
