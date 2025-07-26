'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Truck, 
  Recycle, 
  PaintBucket, 
  Shield, 
  Compass,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type ProviderType = 'design-office' | 'construction-company' | 'insurance' | 'equipment-rental' | 'waste-management' | 'concrete-supplier';

interface BusinessInfo {
  company_name: string;
  commercial_registration: string;
  tax_number: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  established_year: string;
  employee_count: string;
  website?: string;
}

interface Certification {
  type: string;
  number: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  file_url?: string;
}

interface ServiceProviderRegistration {
  provider_type: ProviderType;
  business_info: BusinessInfo;
  certifications: Certification[];
  service_areas: string[];
  specializations: string[];
  portfolio_items: any[];
  documents: { [key: string]: File };
}

const providerTypes = [
  {
    id: 'design-office' as ProviderType,
    name: 'مكتب هندسي',
    description: 'تصميم معماري وإنشائي',
    icon: Compass,
    color: 'bg-blue-500'
  },
  {
    id: 'construction-company' as ProviderType,
    name: 'شركة مقاولات',
    description: 'تنفيذ المشاريع الإنشائية',
    icon: Building2,
    color: 'bg-green-500'
  },
  {
    id: 'equipment-rental' as ProviderType,
    name: 'تأجير معدات',
    description: 'تأجير معدات البناء والحفر',
    icon: Truck,
    color: 'bg-orange-500'
  },
  {
    id: 'waste-management' as ProviderType,
    name: 'إدارة النفايات',
    description: 'جمع ونقل نفايات البناء',
    icon: Recycle,
    color: 'bg-emerald-500'
  },
  {
    id: 'concrete-supplier' as ProviderType,
    name: 'توريد خرسانة',
    description: 'إنتاج وتوريد الخرسانة الجاهزة',
    icon: PaintBucket,
    color: 'bg-gray-500'
  },
  {
    id: 'insurance' as ProviderType,
    name: 'شركة تأمين',
    description: 'تأمين المشاريع والعمالة',
    icon: Shield,
    color: 'bg-purple-500'
  }
];

const saudiCities = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران',
  'الطائف', 'بريدة', 'تبوك', 'خميس مشيط', 'الهفوف', 'المبرز', 'نجران', 'جازان',
  'ينبع', 'الخرج', 'أبها', 'عرعر', 'سكاكا', 'القريات', 'الباحة'
];

export default function ServiceProviderRegistration() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [registration, setRegistration] = useState<ServiceProviderRegistration>({
    provider_type: 'design-office',
    business_info: {
      company_name: '',
      commercial_registration: '',
      tax_number: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      district: '',
      established_year: '',
      employee_count: '',
      website: ''
    },
    certifications: [],
    service_areas: [],
    specializations: [],
    portfolio_items: [],
    documents: {}
  });
  const [loading, setLoading] = useState(false);

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleProviderTypeSelect = (type: ProviderType) => {
    setRegistration(prev => ({ ...prev, provider_type: type }));
    setCurrentStep(2);
  };

  const handleBusinessInfoChange = (field: keyof BusinessInfo, value: string) => {
    setRegistration(prev => ({
      ...prev,
      business_info: { ...prev.business_info, [field]: value }
    }));
  };

  const addCertification = () => {
    const newCert: Certification = {
      type: '',
      number: '',
      issuer: '',
      issue_date: '',
      expiry_date: ''
    };
    setRegistration(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    setRegistration(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (index: number) => {
    setRegistration(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (key: string, file: File) => {
    setRegistration(prev => ({
      ...prev,
      documents: { ...prev.documents, [key]: file }
    }));
  };

  const getSpecializationsByType = (type: ProviderType): string[] => {
    switch (type) {
      case 'design-office':
        return ['تصميم معماري', 'تصميم إنشائي', 'تصميم كهربائي', 'تصميم ميكانيكي', 'ديكور داخلي', 'تخطيط مدن'];
      case 'construction-company':
        return ['بناء فلل', 'مباني تجارية', 'مباني صناعية', 'ترميم', 'تشطيبات', 'أعمال الحفر'];
      case 'equipment-rental':
        return ['رافعات', 'حفارات', 'شاحنات', 'خلاطات خرسانة', 'مولدات', 'أدوات يدوية'];
      case 'waste-management':
        return ['نفايات بناء', 'نفايات خرسانة', 'نفايات معدنية', 'نفايات خشبية', 'نفايات مختلطة'];
      case 'concrete-supplier':
        return ['خرسانة جاهزة', 'خرسانة مسلحة', 'خرسانة عادية', 'إضافات خرسانة', 'ضخ خرسانة'];
      case 'insurance':
        return ['تأمين مقاولين', 'تأمين معدات', 'تأمين عمالة', 'تأمين مشاريع', 'تأمين مسؤولية مدنية'];
      default:
        return [];
    }
  };

  const submitRegistration = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('تم تسجيل مقدم الخدمة بنجاح! سيتم مراجعة الطلب خلال 24-48 ساعة.');
      
      // Redirect to dashboard
      router.push(`/dashboard/${registration.provider_type}`);
    } catch (error) {
      toast.error('حدث خطأ في التسجيل. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">تسجيل مقدم خدمة</h1>
        <div className="text-sm text-gray-600">
          خطوة {currentStep} من {totalSteps}
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>اختر نوع الخدمة</CardTitle>
        <CardDescription>
          حدد نوع الخدمة التي تقدمها شركتك
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providerTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card 
                key={type.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                onClick={() => handleProviderTypeSelect(type.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{type.name}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>معلومات الشركة</CardTitle>
        <CardDescription>
          أدخل المعلومات الأساسية عن شركتك
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">اسم الشركة *</Label>
            <Input
              id="company_name"
              value={registration.business_info.company_name}
              onChange={(e) => handleBusinessInfoChange('company_name', e.target.value)}
              placeholder="شركة البناء المتطورة"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commercial_registration">السجل التجاري *</Label>
            <Input
              id="commercial_registration"
              value={registration.business_info.commercial_registration}
              onChange={(e) => handleBusinessInfoChange('commercial_registration', e.target.value)}
              placeholder="1010123456"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tax_number">الرقم الضريبي *</Label>
            <Input
              id="tax_number"
              value={registration.business_info.tax_number}
              onChange={(e) => handleBusinessInfoChange('tax_number', e.target.value)}
              placeholder="300123456700003"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_person">الشخص المسؤول *</Label>
            <Input
              id="contact_person"
              value={registration.business_info.contact_person}
              onChange={(e) => handleBusinessInfoChange('contact_person', e.target.value)}
              placeholder="أحمد محمد العلي"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              value={registration.business_info.email}
              onChange={(e) => handleBusinessInfoChange('email', e.target.value)}
              placeholder="info@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف *</Label>
            <Input
              id="phone"
              value={registration.business_info.phone}
              onChange={(e) => handleBusinessInfoChange('phone', e.target.value)}
              placeholder="+966501234567"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">المدينة *</Label>
            <Select value={registration.business_info.city} onValueChange={(value) => handleBusinessInfoChange('city', value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent>
                {saudiCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">الحي</Label>
            <Input
              id="district"
              value={registration.business_info.district}
              onChange={(e) => handleBusinessInfoChange('district', e.target.value)}
              placeholder="الملز"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">العنوان الكامل *</Label>
          <Textarea
            id="address"
            value={registration.business_info.address}
            onChange={(e) => handleBusinessInfoChange('address', e.target.value)}
            placeholder="شارع الملك فهد، المملكة العربية السعودية"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="established_year">سنة التأسيس</Label>
            <Input
              id="established_year"
              value={registration.business_info.established_year}
              onChange={(e) => handleBusinessInfoChange('established_year', e.target.value)}
              placeholder="2015"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee_count">عدد الموظفين</Label>
            <Input
              id="employee_count"
              value={registration.business_info.employee_count}
              onChange={(e) => handleBusinessInfoChange('employee_count', e.target.value)}
              placeholder="25"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">الموقع الإلكتروني</Label>
            <Input
              id="website"
              value={registration.business_info.website}
              onChange={(e) => handleBusinessInfoChange('website', e.target.value)}
              placeholder="https://company.com"
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setCurrentStep(1)}>
            <ArrowRight className="mr-2 h-4 w-4" />
            السابق
          </Button>
          <Button onClick={() => setCurrentStep(3)}>
            التالي
            <ArrowLeft className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle>الشهادات والتراخيص</CardTitle>
        <CardDescription>
          أضف الشهادات والتراخيص المهنية للشركة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {registration.certifications.map((cert, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">شهادة {index + 1}</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => removeCertification(index)}
              >
                حذف
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نوع الشهادة</Label>
                <Input
                  value={cert.type}
                  onChange={(e) => updateCertification(index, 'type', e.target.value)}
                  placeholder="ISO 9001"
                />
              </div>
              <div className="space-y-2">
                <Label>رقم الشهادة</Label>
                <Input
                  value={cert.number}
                  onChange={(e) => updateCertification(index, 'number', e.target.value)}
                  placeholder="ISO-001-2023"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>جهة الإصدار</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  placeholder="المؤسسة السعودية للمقاييس"
                />
              </div>
              <div className="space-y-2">
                <Label>تاريخ الإصدار</Label>
                <Input
                  type="date"
                  value={cert.issue_date}
                  onChange={(e) => updateCertification(index, 'issue_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>تاريخ الانتهاء</Label>
                <Input
                  type="date"
                  value={cert.expiry_date}
                  onChange={(e) => updateCertification(index, 'expiry_date', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addCertification} className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          إضافة شهادة
        </Button>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setCurrentStep(2)}>
            <ArrowRight className="mr-2 h-4 w-4" />
            السابق
          </Button>
          <Button onClick={() => setCurrentStep(4)}>
            التالي
            <ArrowLeft className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle>مناطق الخدمة والتخصصات</CardTitle>
        <CardDescription>
          حدد المناطق التي تقدم فيها خدماتك والتخصصات
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">مناطق الخدمة</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {saudiCities.map(city => (
              <div key={city} className="flex items-center space-x-2">
                <Checkbox
                  id={`city-${city}`}
                  checked={registration.service_areas.includes(city)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setRegistration(prev => ({
                        ...prev,
                        service_areas: [...prev.service_areas, city]
                      }));
                    } else {
                      setRegistration(prev => ({
                        ...prev,
                        service_areas: prev.service_areas.filter(area => area !== city)
                      }));
                    }
                  }}
                />
                <Label htmlFor={`city-${city}`} className="text-sm">{city}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-base font-medium mb-4 block">التخصصات</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {getSpecializationsByType(registration.provider_type).map(spec => (
              <div key={spec} className="flex items-center space-x-2">
                <Checkbox
                  id={`spec-${spec}`}
                  checked={registration.specializations.includes(spec)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setRegistration(prev => ({
                        ...prev,
                        specializations: [...prev.specializations, spec]
                      }));
                    } else {
                      setRegistration(prev => ({
                        ...prev,
                        specializations: prev.specializations.filter(s => s !== spec)
                      }));
                    }
                  }}
                />
                <Label htmlFor={`spec-${spec}`} className="text-sm">{spec}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setCurrentStep(3)}>
            <ArrowRight className="mr-2 h-4 w-4" />
            السابق
          </Button>
          <Button onClick={() => setCurrentStep(5)}>
            التالي
            <ArrowLeft className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep5 = () => (
    <Card>
      <CardHeader>
        <CardTitle>مراجعة وتأكيد التسجيل</CardTitle>
        <CardDescription>
          راجع جميع المعلومات قبل إرسال الطلب
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">نوع الخدمة</h3>
            <Badge variant="secondary" className="px-4 py-2">
              {providerTypes.find(type => type.id === registration.provider_type)?.name}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold mb-2">معلومات الشركة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>الشركة: {registration.business_info.company_name}</div>
              <div>السجل التجاري: {registration.business_info.commercial_registration}</div>
              <div>المسؤول: {registration.business_info.contact_person}</div>
              <div>الهاتف: {registration.business_info.phone}</div>
              <div>البريد: {registration.business_info.email}</div>
              <div>المدينة: {registration.business_info.city}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">الشهادات ({registration.certifications.length})</h3>
            <div className="space-y-2">
              {registration.certifications.map((cert, index) => (
                <div key={index} className="text-sm border rounded p-2">
                  {cert.type} - {cert.number}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">مناطق الخدمة ({registration.service_areas.length})</h3>
            <div className="flex flex-wrap gap-1">
              {registration.service_areas.map(area => (
                <Badge key={area} variant="outline" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">التخصصات ({registration.specializations.length})</h3>
            <div className="flex flex-wrap gap-1">
              {registration.specializations.map(spec => (
                <Badge key={spec} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">شروط التسجيل</span>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• سيتم مراجعة طلبكم خلال 24-48 ساعة</li>
            <li>• قد نطلب مستندات إضافية للتحقق</li>
            <li>• ستتلقون إشعار بالموافقة أو الرفض عبر البريد الإلكتروني</li>
            <li>• بعد الموافقة، ستتمكنون من الوصول إلى لوحة التحكم</li>
          </ul>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setCurrentStep(4)}>
            <ArrowRight className="mr-2 h-4 w-4" />
            السابق
          </Button>
          <Button 
            onClick={submitRegistration} 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'جاري التسجيل...' : 'تأكيد التسجيل'}
            <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      {renderStepIndicator()}
      
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
      {currentStep === 5 && renderStep5()}
    </div>
  );
}
