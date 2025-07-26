'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { EnhancedCard, Typography, Button } from '@/core/shared/components/ui/enhanced-components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Building, 
  Truck, 
  Package, 
  FileText,
  CheckCircle2,
  AlertCircle,
  Upload,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Shield,
  Clock,
  Award,
  Users
} from 'lucide-react';

type RegistrationType = 'individual' | 'company' | 'contractor' | 'supplier' | 'service_provider';

interface RegistrationForm {
  // Basic Information
  type: RegistrationType;
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  
  // Company Information (if applicable)
  companyName?: string;
  commercialRegister?: string;
  taxNumber?: string;
  companySize?: string;
  
  // Address Information
  city: string;
  district: string;
  street: string;
  buildingNumber: string;
  postalCode: string;
  
  // Business Information
  businessType: string;
  services: string[];
  experience: string;
  previousProjects: string;
  
  // Verification Documents
  documents: {
    nationalIdCopy?: File;
    commercialRegisterCopy?: File;
    taxCertificate?: File;
    insuranceCertificate?: File;
    qualityCertificates?: File[];
    previousWorkPortfolio?: File[];
  };
  
  // References
  references: {
    name: string;
    company: string;
    phone: string;
    email: string;
    relationship: string;
  }[];
  
  // Agreement
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToQuality: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function RegistrationPortal() {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationType, setRegistrationType] = useState<RegistrationType>('individual');
  const [form, setForm] = useState<RegistrationForm>({
    type: 'individual',
    fullName: '',
    email: '',
    phone: '',
    nationalId: '',
    city: '',
    district: '',
    street: '',
    buildingNumber: '',
    postalCode: '',
    businessType: '',
    services: [],
    experience: '',
    previousProjects: '',
    documents: {},
    references: [],
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToQuality: false
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  // Registration types configuration
  const registrationTypes = [
    {
      type: 'individual' as RegistrationType,
      title: 'فرد',
      description: 'للأفراد الراغبين في طلب الخدمات',
      icon: User,
      features: ['طلب الخدمات', 'تتبع الطلبات', 'الدفع الآمن']
    },
    {
      type: 'company' as RegistrationType,
      title: 'شركة',
      description: 'للشركات والمؤسسات التجارية',
      icon: Building,
      features: ['إدارة المشاريع', 'فواتير مفصلة', 'خصومات الشركات']
    },
    {
      type: 'contractor' as RegistrationType,
      title: 'مقاول',
      description: 'للمقاولين وشركات المقاولات',
      icon: FileText,
      features: ['عروض خاصة', 'إدارة المشاريع', 'تقارير مفصلة']
    },
    {
      type: 'supplier' as RegistrationType,
      title: 'مورد',
      description: 'لموردي المواد والخدمات',
      icon: Package,
      features: ['عرض المنتجات', 'إدارة المخزون', 'تتبع الطلبات']
    },
    {
      type: 'service_provider' as RegistrationType,
      title: 'مقدم خدمة',
      description: 'لمقدمي الخدمات والمعدات',
      icon: Truck,
      features: ['عرض الخدمات', 'جدولة المواعيد', 'إدارة الموارد']
    }
  ];

  // Cities in Saudi Arabia
  const saudiCities = [
    'الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة',
    'الطائف', 'تبوك', 'بريدة', 'خميس مشيط', 'الهفوف',
    'حفر الباطن', 'الجبيل', 'نجران', 'جازان', 'ينبع',
    'الخرج', 'عرعر', 'سكاكا', 'القطيف', 'أبها'
  ];

  // Business types based on registration type
  const getBusinessTypes = (type: RegistrationType) => {
    const businessTypes = {
      individual: ['مالك منزل', 'مستثمر عقاري', 'أخرى'],
      company: ['شركة إنشاءات', 'شركة عقارية', 'شركة تطوير', 'شركة استثمار', 'أخرى'],
      contractor: ['مقاولات عامة', 'مقاولات متخصصة', 'تشطيبات', 'صيانة', 'أخرى'],
      supplier: ['مواد بناء', 'خرسانة جاهزة', 'حديد وأسمنت', 'أدوات وعدد', 'أخرى'],
      service_provider: ['معدات ثقيلة', 'نقل ومواصلات', 'خدمات هندسية', 'خدمات فنية', 'أخرى']
    };
    return businessTypes[type] || [];
  };

  // Available services based on registration type
  const getAvailableServices = (type: RegistrationType) => {
    const services = {
      individual: ['استشارات', 'تصاميم', 'إشراف'],
      company: ['إدارة مشاريع', 'استشارات', 'تطوير', 'تمويل'],
      contractor: ['إنشاءات', 'تشطيبات', 'صيانة', 'تجديد', 'هدم'],
      supplier: ['خرسانة جاهزة', 'حديد تسليح', 'أسمنت', 'مواد عزل', 'أدوات'],
      service_provider: ['رافعات', 'حفارات', 'شاحنات', 'مضخات خرسانة', 'مولدات']
    };
    return services[type] || [];
  };

  // Form validation
  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    switch (step) {
      case 1: // Registration Type & Basic Info
        if (!form.type) newErrors.type = 'نوع التسجيل مطلوب';
        if (!form.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب';
        if (!form.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
          newErrors.email = 'البريد الإلكتروني غير صحيح';
        }
        if (!form.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
        else if (!/^(\+966|0)?[5][0-9]{8}$/.test(form.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'رقم الهاتف غير صحيح';
        }
        if (!form.nationalId.trim()) newErrors.nationalId = 'رقم الهوية مطلوب';
        else if (!/^[12]\d{9}$/.test(form.nationalId)) {
          newErrors.nationalId = 'رقم الهوية غير صحيح';
        }
        
        // Company specific validation
        if (['company', 'contractor', 'supplier', 'service_provider'].includes(form.type)) {
          if (!form.companyName?.trim()) newErrors.companyName = 'اسم الشركة مطلوب';
          if (!form.commercialRegister?.trim()) newErrors.commercialRegister = 'السجل التجاري مطلوب';
        }
        break;

      case 2: // Address Information
        if (!form.city) newErrors.city = 'المدينة مطلوبة';
        if (!form.district.trim()) newErrors.district = 'الحي مطلوب';
        if (!form.street.trim()) newErrors.street = 'الشارع مطلوب';
        if (!form.buildingNumber.trim()) newErrors.buildingNumber = 'رقم المبنى مطلوب';
        if (!form.postalCode.trim()) newErrors.postalCode = 'الرمز البريدي مطلوب';
        else if (!/^\d{5}$/.test(form.postalCode)) {
          newErrors.postalCode = 'الرمز البريدي يجب أن يكون 5 أرقام';
        }
        break;

      case 3: // Business Information
        if (!form.businessType) newErrors.businessType = 'نوع النشاط مطلوب';
        if (form.services.length === 0) newErrors.services = 'يجب اختيار خدمة واحدة على الأقل';
        if (!form.experience) newErrors.experience = 'سنوات الخبرة مطلوبة';
        break;

      case 4: // Documents
        if (['company', 'contractor', 'supplier', 'service_provider'].includes(form.type)) {
          if (!form.documents.commercialRegisterCopy) {
            newErrors.commercialRegisterCopy = 'صورة السجل التجاري مطلوبة';
          }
        }
        break;

      case 5: // Agreement
        if (!form.agreeToTerms) newErrors.agreeToTerms = 'يجب الموافقة على الشروط والأحكام';
        if (!form.agreeToPrivacy) newErrors.agreeToPrivacy = 'يجب الموافقة على سياسة الخصوصية';
        if (!form.agreeToQuality) newErrors.agreeToQuality = 'يجب الموافقة على معايير الجودة';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      console.log('Registration submitted:', form);
    } catch (error) {
      setErrors({ submit: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle file upload
  const handleFileUpload = (field: string, file: File) => {
    setForm(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }));
  };

  // Add reference
  const addReference = () => {
    setForm(prev => ({
      ...prev,
      references: [
        ...prev.references,
        { name: '', company: '', phone: '', email: '', relationship: '' }
      ]
    }));
  };

  // Remove reference
  const removeReference = (index: number) => {
    setForm(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  // Update reference
  const updateReference = (index: number, field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6" dir="rtl">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              تم التسجيل بنجاح!
            </h2>
            <p className="text-gray-600 mb-6">
              تم إرسال طلب التسجيل للمراجعة. سيتم التواصل معك خلال 24-48 ساعة.
            </p>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              العودة للرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            التسجيل في منصة بِنّا
          </h1>
          <p className="text-gray-600">
            انضم إلى أكبر منصة للخدمات الإنشائية في المملكة
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-900">
                الخطوة {currentStep} من {totalSteps}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(progress)}% مكتمل
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="flex justify-between mt-4 text-xs text-gray-600">
              <span className={currentStep >= 1 ? 'text-blue-600 font-semibold' : ''}>
                نوع التسجيل
              </span>
              <span className={currentStep >= 2 ? 'text-blue-600 font-semibold' : ''}>
                العنوان
              </span>
              <span className={currentStep >= 3 ? 'text-blue-600 font-semibold' : ''}>
                النشاط
              </span>
              <span className={currentStep >= 4 ? 'text-blue-600 font-semibold' : ''}>
                المستندات
              </span>
              <span className={currentStep >= 5 ? 'text-blue-600 font-semibold' : ''}>
                الاتفاقية
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card>
          <CardContent className="p-6">
            {/* Step 1: Registration Type & Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">اختر نوع التسجيل</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {registrationTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <div
                          key={type.type}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            form.type === type.type
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setForm(prev => ({ ...prev, type: type.type }));
                            setRegistrationType(type.type);
                          }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Icon className="w-6 h-6 text-blue-600" />
                            <h4 className="font-semibold">{type.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                          <ul className="text-xs text-gray-500 space-y-1">
                            {type.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                  {errors.type && (
                    <p className="text-red-600 text-sm mt-2">{errors.type}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">الاسم الكامل *</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className={errors.fullName ? 'border-red-500' : ''}
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+966 5XXXXXXXX"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="nationalId">رقم الهوية الوطنية *</Label>
                    <Input
                      id="nationalId"
                      value={form.nationalId}
                      onChange={(e) => setForm(prev => ({ ...prev, nationalId: e.target.value }))}
                      placeholder="1XXXXXXXXX"
                      className={errors.nationalId ? 'border-red-500' : ''}
                    />
                    {errors.nationalId && (
                      <p className="text-red-600 text-sm mt-1">{errors.nationalId}</p>
                    )}
                  </div>
                </div>

                {/* Company Information */}
                {['company', 'contractor', 'supplier', 'service_provider'].includes(form.type) && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold mb-4">معلومات الشركة</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="companyName">اسم الشركة *</Label>
                        <Input
                          id="companyName"
                          value={form.companyName || ''}
                          onChange={(e) => setForm(prev => ({ ...prev, companyName: e.target.value }))}
                          className={errors.companyName ? 'border-red-500' : ''}
                        />
                        {errors.companyName && (
                          <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="commercialRegister">رقم السجل التجاري *</Label>
                        <Input
                          id="commercialRegister"
                          value={form.commercialRegister || ''}
                          onChange={(e) => setForm(prev => ({ ...prev, commercialRegister: e.target.value }))}
                          className={errors.commercialRegister ? 'border-red-500' : ''}
                        />
                        {errors.commercialRegister && (
                          <p className="text-red-600 text-sm mt-1">{errors.commercialRegister}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                        <Input
                          id="taxNumber"
                          value={form.taxNumber || ''}
                          onChange={(e) => setForm(prev => ({ ...prev, taxNumber: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="companySize">حجم الشركة</Label>
                        <Select
                          value={form.companySize || ''}
                          onValueChange={(value) => setForm(prev => ({ ...prev, companySize: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر حجم الشركة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">صغيرة (1-10 موظفين)</SelectItem>
                            <SelectItem value="medium">متوسطة (11-50 موظف)</SelectItem>
                            <SelectItem value="large">كبيرة (51-200 موظف)</SelectItem>
                            <SelectItem value="enterprise">مؤسسة (200+ موظف)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">معلومات العنوان</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="city">المدينة *</Label>
                    <Select
                      value={form.city}
                      onValueChange={(value) => setForm(prev => ({ ...prev, city: value }))}
                    >
                      <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        {saudiCities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city && (
                      <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="district">الحي *</Label>
                    <Input
                      id="district"
                      value={form.district}
                      onChange={(e) => setForm(prev => ({ ...prev, district: e.target.value }))}
                      className={errors.district ? 'border-red-500' : ''}
                    />
                    {errors.district && (
                      <p className="text-red-600 text-sm mt-1">{errors.district}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="street">الشارع *</Label>
                    <Input
                      id="street"
                      value={form.street}
                      onChange={(e) => setForm(prev => ({ ...prev, street: e.target.value }))}
                      className={errors.street ? 'border-red-500' : ''}
                    />
                    {errors.street && (
                      <p className="text-red-600 text-sm mt-1">{errors.street}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="buildingNumber">رقم المبنى *</Label>
                    <Input
                      id="buildingNumber"
                      value={form.buildingNumber}
                      onChange={(e) => setForm(prev => ({ ...prev, buildingNumber: e.target.value }))}
                      className={errors.buildingNumber ? 'border-red-500' : ''}
                    />
                    {errors.buildingNumber && (
                      <p className="text-red-600 text-sm mt-1">{errors.buildingNumber}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="postalCode">الرمز البريدي *</Label>
                    <Input
                      id="postalCode"
                      value={form.postalCode}
                      onChange={(e) => setForm(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder="12345"
                      className={errors.postalCode ? 'border-red-500' : ''}
                    />
                    {errors.postalCode && (
                      <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Business Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">معلومات النشاط</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessType">نوع النشاط *</Label>
                    <Select
                      value={form.businessType}
                      onValueChange={(value) => setForm(prev => ({ ...prev, businessType: value }))}
                    >
                      <SelectTrigger className={errors.businessType ? 'border-red-500' : ''}>
                        <SelectValue placeholder="اختر نوع النشاط" />
                      </SelectTrigger>
                      <SelectContent>
                        {getBusinessTypes(form.type).map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.businessType && (
                      <p className="text-red-600 text-sm mt-1">{errors.businessType}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="experience">سنوات الخبرة *</Label>
                    <Select
                      value={form.experience}
                      onValueChange={(value) => setForm(prev => ({ ...prev, experience: value }))}
                    >
                      <SelectTrigger className={errors.experience ? 'border-red-500' : ''}>
                        <SelectValue placeholder="اختر سنوات الخبرة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">أقل من سنة</SelectItem>
                        <SelectItem value="1-3">1-3 سنوات</SelectItem>
                        <SelectItem value="3-5">3-5 سنوات</SelectItem>
                        <SelectItem value="5-10">5-10 سنوات</SelectItem>
                        <SelectItem value="10+">أكثر من 10 سنوات</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.experience && (
                      <p className="text-red-600 text-sm mt-1">{errors.experience}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>الخدمات المقدمة *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {getAvailableServices(form.type).map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={form.services.includes(service)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setForm(prev => ({
                                ...prev,
                                services: [...prev.services, service]
                              }));
                            } else {
                              setForm(prev => ({
                                ...prev,
                                services: prev.services.filter(s => s !== service)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={service} className="text-sm mr-2">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.services && (
                    <p className="text-red-600 text-sm mt-1">{errors.services}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="previousProjects">المشاريع السابقة</Label>
                  <Textarea
                    id="previousProjects"
                    value={form.previousProjects}
                    onChange={(e) => setForm(prev => ({ ...prev, previousProjects: e.target.value }))}
                    placeholder="اذكر بعض المشاريع التي عملت عليها سابقاً..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">المستندات المطلوبة</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium mb-1">صورة الهوية الوطنية *</p>
                    <p className="text-xs text-gray-500 mb-3">PNG, JPG, PDF (الحد الأقصى 5MB)</p>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('nationalIdCopy', file);
                      }}
                      className="hidden"
                      id="nationalIdCopy"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('nationalIdCopy')?.click()}
                    >
                      رفع الملف
                    </Button>
                    {form.documents.nationalIdCopy && (
                      <p className="text-green-600 text-xs mt-2">
                        ✓ تم رفع الملف: {form.documents.nationalIdCopy.name}
                      </p>
                    )}
                  </div>

                  {['company', 'contractor', 'supplier', 'service_provider'].includes(form.type) && (
                    <>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium mb-1">صورة السجل التجاري *</p>
                        <p className="text-xs text-gray-500 mb-3">PNG, JPG, PDF (الحد الأقصى 5MB)</p>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('commercialRegisterCopy', file);
                          }}
                          className="hidden"
                          id="commercialRegisterCopy"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('commercialRegisterCopy')?.click()}
                        >
                          رفع الملف
                        </Button>
                        {form.documents.commercialRegisterCopy && (
                          <p className="text-green-600 text-xs mt-2">
                            ✓ تم رفع الملف: {form.documents.commercialRegisterCopy.name}
                          </p>
                        )}
                        {errors.commercialRegisterCopy && (
                          <p className="text-red-600 text-xs mt-2">{errors.commercialRegisterCopy}</p>
                        )}
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium mb-1">الشهادة الضريبية</p>
                        <p className="text-xs text-gray-500 mb-3">PNG, JPG, PDF (الحد الأقصى 5MB)</p>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('taxCertificate', file);
                          }}
                          className="hidden"
                          id="taxCertificate"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('taxCertificate')?.click()}
                        >
                          رفع الملف
                        </Button>
                        {form.documents.taxCertificate && (
                          <p className="text-green-600 text-xs mt-2">
                            ✓ تم رفع الملف: {form.documents.taxCertificate.name}
                          </p>
                        )}
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium mb-1">شهادة التأمين</p>
                        <p className="text-xs text-gray-500 mb-3">PNG, JPG, PDF (الحد الأقصى 5MB)</p>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('insuranceCertificate', file);
                          }}
                          className="hidden"
                          id="insuranceCertificate"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('insuranceCertificate')?.click()}
                        >
                          رفع الملف
                        </Button>
                        {form.documents.insuranceCertificate && (
                          <p className="text-green-600 text-xs mt-2">
                            ✓ تم رفع الملف: {form.documents.insuranceCertificate.name}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* References */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">المراجع</h4>
                    <Button type="button" variant="outline" size="sm" onClick={addReference}>
                      <Users className="w-4 h-4 mr-2" />
                      إضافة مرجع
                    </Button>
                  </div>
                  
                  {form.references.map((reference, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium">مرجع {index + 1}</h5>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeReference(index)}
                          className="text-red-600"
                        >
                          حذف
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>الاسم</Label>
                          <Input
                            value={reference.name}
                            onChange={(e) => updateReference(index, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>الشركة</Label>
                          <Input
                            value={reference.company}
                            onChange={(e) => updateReference(index, 'company', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>رقم الهاتف</Label>
                          <Input
                            value={reference.phone}
                            onChange={(e) => updateReference(index, 'phone', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>البريد الإلكتروني</Label>
                          <Input
                            value={reference.email}
                            onChange={(e) => updateReference(index, 'email', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>العلاقة</Label>
                          <Input
                            value={reference.relationship}
                            onChange={(e) => updateReference(index, 'relationship', e.target.value)}
                            placeholder="مثال: عميل سابق، شريك عمل، مورد..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Agreement */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">الشروط والأحكام</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={form.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setForm(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                      }
                    />
                    <div className="mr-3">
                      <Label htmlFor="agreeToTerms" className="font-medium">
                        أوافق على الشروط والأحكام *
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        بالموافقة، أؤكد أنني قرأت وفهمت جميع الشروط والأحكام لاستخدام منصة بِنّا.
                      </p>
                    </div>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-red-600 text-sm">{errors.agreeToTerms}</p>
                  )}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToPrivacy"
                      checked={form.agreeToPrivacy}
                      onCheckedChange={(checked) => 
                        setForm(prev => ({ ...prev, agreeToPrivacy: checked as boolean }))
                      }
                    />
                    <div className="mr-3">
                      <Label htmlFor="agreeToPrivacy" className="font-medium">
                        أوافق على سياسة الخصوصية *
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        أوافق على جمع ومعالجة بياناتي الشخصية وفقاً لسياسة الخصوصية.
                      </p>
                    </div>
                  </div>
                  {errors.agreeToPrivacy && (
                    <p className="text-red-600 text-sm">{errors.agreeToPrivacy}</p>
                  )}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToQuality"
                      checked={form.agreeToQuality}
                      onCheckedChange={(checked) => 
                        setForm(prev => ({ ...prev, agreeToQuality: checked as boolean }))
                      }
                    />
                    <div className="mr-3">
                      <Label htmlFor="agreeToQuality" className="font-medium">
                        أوافق على معايير الجودة والسلامة *
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        أتعهد بالالتزام بمعايير الجودة والسلامة المطلوبة في جميع الخدمات المقدمة.
                      </p>
                    </div>
                  </div>
                  {errors.agreeToQuality && (
                    <p className="text-red-600 text-sm">{errors.agreeToQuality}</p>
                  )}
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>ملاحظة مهمة:</strong> سيتم مراجعة طلب التسجيل من قبل فريقنا المختص. 
                    ستتلقى رداً خلال 24-48 ساعة عمل على البريد الإلكتروني المسجل.
                  </AlertDescription>
                </Alert>

                {errors.submit && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-600">
                      {errors.submit}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                السابق
              </Button>
              
              <div className="flex gap-2">
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNext}>
                    التالي
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        جاري التسجيل...
                      </>
                    ) : (
                      'إتمام التسجيل'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
