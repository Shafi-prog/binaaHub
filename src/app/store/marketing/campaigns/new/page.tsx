'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Label } from '@/core/shared/components/ui/label';
import { Textarea } from '@/core/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/shared/components/ui/select';
import { Badge } from '@/core/shared/components/ui/badge';
import { 
  Megaphone, 
  Mail,
  MessageSquare,
  Globe,
  Users,
  Target,
  Calendar,
  DollarSign,
  BarChart3,
  Eye,
  Clock,
  Send,
  Save,
  Plus,
  Upload,
  Smartphone,
  Monitor,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

export default function NewCampaignPage() {
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: '',
    objective: '',
    targetAudience: '',
    budget: '',
    duration: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: '',
    channels: [] as string[],
    keywords: '',
    demographics: {
      ageMin: '',
      ageMax: '',
      gender: '',
      location: '',
      interests: ''
    },
    creative: {
      headline: '',
      subtext: '',
      callToAction: '',
      imageUrl: ''
    }
  });

  const campaignTypes = [
    { id: 'awareness', name: 'زيادة الوعي بالعلامة التجارية', icon: Eye, color: 'blue' },
    { id: 'traffic', name: 'زيادة زيارات الموقع', icon: Globe, color: 'green' },
    { id: 'leads', name: 'جذب عملاء محتملين', icon: Users, color: 'purple' },
    { id: 'sales', name: 'زيادة المبيعات', icon: DollarSign, color: 'orange' },
    { id: 'engagement', name: 'زيادة التفاعل', icon: MessageSquare, color: 'pink' },
    { id: 'retention', name: 'الاحتفاظ بالعملاء', icon: Target, color: 'indigo' }
  ];

  const marketingChannels = [
    { id: 'social_media', name: 'وسائل التواصل الاجتماعي', icon: Smartphone },
    { id: 'email', name: 'التسويق عبر البريد الإلكتروني', icon: Mail },
    { id: 'sms', name: 'الرسائل النصية', icon: MessageSquare },
    { id: 'google_ads', name: 'إعلانات جوجل', icon: Globe },
    { id: 'display', name: 'الإعلانات المرئية', icon: Monitor },
    { id: 'influencer', name: 'التسويق عبر المؤثرين', icon: Users }
  ];

  const audienceSegments = [
    'العملاء الحاليون',
    'العملاء السابقون', 
    'زوار الموقع',
    'المهتمون بالبناء',
    'المقاولون',
    'المهندسون',
    'أصحاب المشاريع',
    'الشركات الصغيرة'
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCampaignData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value
        }
      }));
    } else {
      setCampaignData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleChannelToggle = (channelId: string) => {
    setCampaignData(prev => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter(c => c !== channelId)
        : [...prev.channels, channelId]
    }));
  };

  const handleSubmit = () => {
    if (!campaignData.name || !campaignData.type || !campaignData.budget) {
      toast.error('يرجى تعبئة الحقول الإجبارية');
      return;
    }

    // Here you would typically save to database
    toast.success('تم إنشاء الحملة الإعلانية بنجاح');
    
    // Reset form or redirect
    console.log('Campaign data:', campaignData);
  };

  const handleSaveDraft = () => {
    toast.success('تم حفظ المسودة');
  };

  const selectedCampaignType = campaignTypes.find(type => type.id === campaignData.type);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Megaphone className="h-8 w-8 text-blue-600" />
            حملة إعلانية جديدة
          </h1>
          <p className="text-gray-600">
            إنشاء حملة تسويقية متقدمة لمتجرك
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            حفظ كمسودة
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="h-4 w-4 mr-2" />
            إطلاق الحملة
          </Button>
        </div>
      </div>

      {/* Campaign Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الأساسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">اسم الحملة *</Label>
              <Input
                id="name"
                placeholder="مثال: حملة العروض الصيفية 2025"
                value={campaignData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">الميزانية *</Label>
              <div className="relative">
                <Input
                  id="budget"
                  type="number"
                  placeholder="0"
                  value={campaignData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="pl-12"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ر.س
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>هدف الحملة *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {campaignTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={campaignData.type === type.id ? 'default' : 'outline'}
                    onClick={() => handleInputChange('type', type.id)}
                    className="h-20 flex-col p-3"
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-xs text-center leading-tight">{type.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الحملة</Label>
            <Textarea
              id="description"
              placeholder="وصف مفصل لأهداف ومحتوى الحملة..."
              value={campaignData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Marketing Channels */}
      <Card>
        <CardHeader>
          <CardTitle>قنوات التسويق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {marketingChannels.map((channel) => {
              const Icon = channel.icon;
              const isSelected = campaignData.channels.includes(channel.id);
              return (
                <Button
                  key={channel.id}
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => handleChannelToggle(channel.id)}
                  className="h-16 flex-col"
                >
                  <Icon className="h-5 w-5 mb-2" />
                  <span className="text-sm">{channel.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Target Audience */}
      <Card>
        <CardHeader>
          <CardTitle>الجمهور المستهدف</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>شريحة العملاء</Label>
            <Select value={campaignData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر شريحة العملاء المستهدفة" />
              </SelectTrigger>
              <SelectContent>
                {audienceSegments.map((segment) => (
                  <SelectItem key={segment} value={segment}>
                    {segment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ageMin">العمر من</Label>
              <Input
                id="ageMin"
                type="number"
                placeholder="18"
                value={campaignData.demographics.ageMin}
                onChange={(e) => handleInputChange('demographics.ageMin', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageMax">إلى</Label>
              <Input
                id="ageMax"
                type="number"
                placeholder="65"
                value={campaignData.demographics.ageMax}
                onChange={(e) => handleInputChange('demographics.ageMax', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>الجنس</Label>
              <Select value={campaignData.demographics.gender} onValueChange={(value) => handleInputChange('demographics.gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">الموقع</Label>
              <Input
                id="location"
                placeholder="المدينة أو المنطقة"
                value={campaignData.demographics.location}
                onChange={(e) => handleInputChange('demographics.location', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">الاهتمامات</Label>
            <Input
              id="interests"
              placeholder="البناء، التشييد، الديكور، إلخ..."
              value={campaignData.demographics.interests}
              onChange={(e) => handleInputChange('demographics.interests', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Campaign Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>الجدولة الزمنية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">تاريخ البداية</Label>
              <Input
                id="startDate"
                type="date"
                value={campaignData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">تاريخ النهاية</Label>
              <Input
                id="endDate"
                type="date"
                value={campaignData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>مدة الحملة</Label>
              <Select value={campaignData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المدة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_week">أسبوع واحد</SelectItem>
                  <SelectItem value="2_weeks">أسبوعين</SelectItem>
                  <SelectItem value="1_month">شهر واحد</SelectItem>
                  <SelectItem value="3_months">3 أشهر</SelectItem>
                  <SelectItem value="6_months">6 أشهر</SelectItem>
                  <SelectItem value="ongoing">مستمرة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Creative Content */}
      <Card>
        <CardHeader>
          <CardTitle>المحتوى الإبداعي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="headline">العنوان الرئيسي</Label>
              <Input
                id="headline"
                placeholder="عنوان جذاب للحملة"
                value={campaignData.creative.headline}
                onChange={(e) => handleInputChange('creative.headline', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="callToAction">دعوة للعمل</Label>
              <Input
                id="callToAction"
                placeholder="اشتري الآن، اطلب عرض أسعار، إلخ..."
                value={campaignData.creative.callToAction}
                onChange={(e) => handleInputChange('creative.callToAction', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtext">النص الفرعي</Label>
            <Textarea
              id="subtext"
              placeholder="وصف تفصيلي للعرض أو المنتج..."
              value={campaignData.creative.subtext}
              onChange={(e) => handleInputChange('creative.subtext', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>صورة الحملة</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">اسحب وأفلت الصورة هنا أو انقر لاختيار</p>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                اختيار صورة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Preview */}
      {selectedCampaignType && campaignData.creative.headline && (
        <Card>
          <CardHeader>
            <CardTitle>معاينة الحملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3 mb-4">
                <selectedCampaignType.icon className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-xl font-bold">{campaignData.creative.headline}</h3>
                  <p className="text-gray-600">{campaignData.creative.subtext}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <DollarSign className="h-6 w-6 mx-auto text-green-600 mb-2" />
                  <div className="font-bold">{campaignData.budget} ر.س</div>
                  <div className="text-sm text-gray-600">الميزانية</div>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg">
                  <Users className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                  <div className="font-bold">{campaignData.targetAudience || 'غير محدد'}</div>
                  <div className="text-sm text-gray-600">الجمهور المستهدف</div>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                  <div className="font-bold">{campaignData.duration || 'غير محدد'}</div>
                  <div className="text-sm text-gray-600">مدة الحملة</div>
                </div>
              </div>

              {campaignData.creative.callToAction && (
                <div className="text-center">
                  <Button>
                    <Zap className="h-4 w-4 mr-2" />
                    {campaignData.creative.callToAction}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              حملة من قالب جاهز
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Users className="h-6 w-6 mb-2" />
              استهداف العملاء السابقين
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              جدولة إطلاق متأخر
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
