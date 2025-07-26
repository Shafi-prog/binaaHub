// Waste Management Integration Component
// Comprehensive waste collection scheduling and tracking interface

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { 
  Trash2, 
  Calendar as CalendarIcon, 
  MapPin, 
  Truck, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Star,
  Recycle,
  Leaf,
  Calculator,
  QrCode,
  Camera,
  FileText,
  Navigation
} from 'lucide-react';
import { toast } from 'sonner';
import {
  wasteManagementService,
  WasteType,
  ContainerSize,
  WasteProvider,
  WasteCollectionSchedule,
  VolumeEstimation
} from '@/core/services/wasteManagementService';

interface WasteManagementProps {
  projectId?: string;
  onSchedulingComplete?: (schedule: WasteCollectionSchedule) => void;
}

export default function WasteManagementIntegration({ 
  projectId, 
  onSchedulingComplete 
}: WasteManagementProps) {
  // State management
  const [activeTab, setActiveTab] = useState<'schedule' | 'track' | 'history'>('schedule');
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
  const [containerSizes, setContainerSizes] = useState<ContainerSize[]>([]);
  const [providers, setProviders] = useState<WasteProvider[]>([]);
  const [userCollections, setUserCollections] = useState<WasteCollectionSchedule[]>([]);
  const [volumeEstimation, setVolumeEstimation] = useState<VolumeEstimation[]>([]);
  const [selectedWasteTypes, setSelectedWasteTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState<WasteCollectionSchedule | null>(null);

  // Form data for scheduling
  const [scheduleForm, setScheduleForm] = useState({
    projectArea: '',
    floors: '1',
    projectType: 'residential',
    constructionPhase: 'foundation',
    collectionAddress: '',
    city: 'riyadh',
    selectedProvider: '',
    selectedDate: new Date(),
    timeSlot: 'morning' as const,
    contactName: '',
    contactPhone: '',
    specialInstructions: '',
    accessRequirements: ''
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load user collections when tab changes
  useEffect(() => {
    if (activeTab === 'history') {
      loadUserCollections();
    }
  }, [activeTab]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [typesData, containersData] = await Promise.all([
        wasteManagementService.getWasteTypes(),
        wasteManagementService.getContainerSizes()
      ]);
      
      setWasteTypes(typesData);
      setContainerSizes(containersData);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimation = async () => {
    if (!scheduleForm.projectArea || selectedWasteTypes.length === 0) {
      toast.error('يرجى إدخال مساحة المشروع وأنواع النفايات');
      return;
    }

    try {
      setLoading(true);
      const estimation = await wasteManagementService.calculateVolumeEstimation({
        area: parseFloat(scheduleForm.projectArea),
        floors: parseInt(scheduleForm.floors),
        projectType: scheduleForm.projectType,
        constructionPhase: scheduleForm.constructionPhase,
        wasteTypes: selectedWasteTypes
      });

      setVolumeEstimation(estimation);
      
      // Load providers for the selected city and waste types
      const providersData = await wasteManagementService.getProvidersByLocation(
        scheduleForm.city,
        selectedWasteTypes
      );
      setProviders(providersData);
      
      toast.success('تم حساب التقدير بنجاح');
    } catch (error) {
      console.error('Error calculating estimation:', error);
      toast.error('فشل في حساب التقدير');
    } finally {
      setLoading(false);
    }
  };

  const scheduleWasteCollection = async () => {
    if (!scheduleForm.selectedProvider || !scheduleForm.contactName || !scheduleForm.contactPhone) {
      toast.error('يرجى إكمال جميع البيانات المطلوبة');
      return;
    }

    try {
      setLoading(true);
      
      const totalEstimation = volumeEstimation.reduce((acc, est) => ({
        volume: acc.volume + est.estimatedVolume,
        weight: acc.weight + est.estimatedWeight,
        cost: acc.cost + est.estimatedCost
      }), { volume: 0, weight: 0, cost: 0 });

      const primaryEstimation = volumeEstimation[0];
      
      const scheduleData = {
        projectId: projectId || `temp-${Date.now()}`,
        providerId: scheduleForm.selectedProvider,
        userId: 'current-user', // Will be replaced with actual user ID
        wasteTypes: selectedWasteTypes,
        estimatedVolume: totalEstimation.volume,
        estimatedWeight: totalEstimation.weight,
        containerSize: primaryEstimation?.recommendedContainer || '',
        containerQuantity: primaryEstimation?.containerQuantity || 1,
        collectionAddress: scheduleForm.collectionAddress,
        coordinates: { lat: 24.7136, lng: 46.6753 }, // Default Riyadh coordinates
        scheduledDate: scheduleForm.selectedDate,
        preferredTimeSlot: scheduleForm.timeSlot,
        totalCost: totalEstimation.cost,
        status: 'scheduled' as const,
        paymentStatus: 'pending' as const,
        specialInstructions: scheduleForm.specialInstructions,
        accessRequirements: scheduleForm.accessRequirements,
        contactPerson: {
          name: scheduleForm.contactName,
          phone: scheduleForm.contactPhone
        }
      };

      const result = await wasteManagementService.scheduleWasteCollection(scheduleData);
      
      toast.success('تم جدولة جمع النفايات بنجاح');
      onSchedulingComplete?.(result);
      
      // Reset form
      resetForm();
      setActiveTab('track');
    } catch (error) {
      console.error('Error scheduling collection:', error);
      toast.error('فشل في جدولة جمع النفايات');
    } finally {
      setLoading(false);
    }
  };

  const trackCollection = async () => {
    if (!trackingId) {
      toast.error('يرجى إدخال رقم التتبع');
      return;
    }

    try {
      setLoading(true);
      const trackingData = await wasteManagementService.trackWasteCollection(trackingId);
      
      if (trackingData) {
        setTrackingData(trackingData);
        toast.success('تم العثور على بيانات التتبع');
      } else {
        toast.error('لم يتم العثور على بيانات التتبع');
      }
    } catch (error) {
      console.error('Error tracking collection:', error);
      toast.error('فشل في تتبع المجموعة');
    } finally {
      setLoading(false);
    }
  };

  const loadUserCollections = async () => {
    try {
      setLoading(true);
      const collections = await wasteManagementService.getUserCollections('current-user');
      setUserCollections(collections);
    } catch (error) {
      console.error('Error loading user collections:', error);
      toast.error('فشل في تحميل تاريخ العمليات');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setScheduleForm({
      projectArea: '',
      floors: '1',
      projectType: 'residential',
      constructionPhase: 'foundation',
      collectionAddress: '',
      city: 'riyadh',
      selectedProvider: '',
      selectedDate: new Date(),
      timeSlot: 'morning',
      contactName: '',
      contactPhone: '',
      specialInstructions: '',
      accessRequirements: ''
    });
    setSelectedWasteTypes([]);
    setVolumeEstimation([]);
    setProviders([]);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'scheduled': 'bg-blue-500',
      'pin-delivered': 'bg-yellow-500',
      'collecting': 'bg-orange-500',
      'completed': 'bg-green-500',
      'cancelled': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'scheduled': <CalendarIcon className="h-4 w-4" />,
      'pin-delivered': <Package className="h-4 w-4" />,
      'collecting': <Truck className="h-4 w-4" />,
      'completed': <CheckCircle className="h-4 w-4" />,
      'cancelled': <AlertCircle className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Trash2 className="h-8 w-8 text-green-600" />
          إدارة النفايات الإنشائية
        </h1>
        <p className="text-gray-600">جدولة وتتبع جمع النفايات بطريقة صديقة للبيئة</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            جدولة جمع النفايات
          </TabsTrigger>
          <TabsTrigger value="track" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            تتبع المجموعة
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            تاريخ العمليات
          </TabsTrigger>
        </TabsList>

        {/* Schedule Collection Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                بيانات المشروع وحساب التقدير
              </CardTitle>
              <CardDescription>
                أدخل تفاصيل مشروعك لحساب تقدير كمية النفايات المتوقعة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>مساحة المشروع (م²)</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={scheduleForm.projectArea}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, projectArea: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>عدد الطوابق</Label>
                  <Select value={scheduleForm.floors} onValueChange={(value) => 
                    setScheduleForm(prev => ({ ...prev, floors: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(floor => (
                        <SelectItem key={floor} value={floor.toString()}>{floor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>نوع المشروع</Label>
                  <Select value={scheduleForm.projectType} onValueChange={(value) =>
                    setScheduleForm(prev => ({ ...prev, projectType: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">سكني</SelectItem>
                      <SelectItem value="commercial">تجاري</SelectItem>
                      <SelectItem value="industrial">صناعي</SelectItem>
                      <SelectItem value="infrastructure">بنية تحتية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>مرحلة البناء</Label>
                  <Select value={scheduleForm.constructionPhase} onValueChange={(value) =>
                    setScheduleForm(prev => ({ ...prev, constructionPhase: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="foundation">الأساسات</SelectItem>
                      <SelectItem value="structure">الهيكل</SelectItem>
                      <SelectItem value="finishing">التشطيبات</SelectItem>
                      <SelectItem value="demolition">الهدم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>أنواع النفايات المتوقعة</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {wasteTypes.map(wasteType => (
                    <div
                      key={wasteType.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedWasteTypes.includes(wasteType.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedWasteTypes(prev =>
                          prev.includes(wasteType.id)
                            ? prev.filter(id => id !== wasteType.id)
                            : [...prev, wasteType.id]
                        );
                      }}
                    >
                      <div className="text-sm font-medium">{wasteType.nameAr}</div>
                      <div className="text-xs text-gray-500">{wasteType.category}</div>
                      {wasteType.environmentalImpact === 'low' && (
                        <Badge variant="secondary" className="mt-1">
                          <Leaf className="h-3 w-3 mr-1" />
                          صديق للبيئة
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={calculateEstimation}
                disabled={loading || !scheduleForm.projectArea || selectedWasteTypes.length === 0}
                className="w-full"
              >
                <Calculator className="h-4 w-4 mr-2" />
                {loading ? 'جاري الحساب...' : 'حساب التقدير'}
              </Button>
            </CardContent>
          </Card>

          {/* Volume Estimation Results */}
          {volumeEstimation.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  تقدير كمية النفايات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {volumeEstimation.map((estimation, index) => {
                    const wasteType = wasteTypes.find(wt => wt.id === estimation.wasteType);
                    const container = containerSizes.find(cs => cs.id === estimation.recommendedContainer);
                    
                    return (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{wasteType?.nameAr}</h4>
                            <p className="text-sm text-gray-600">{wasteType?.descriptionAr}</p>
                          </div>
                          <Badge variant="outline">
                            {estimation.estimatedCost.toLocaleString()} ر.س
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">الحجم المتوقع:</span>
                            <div className="font-medium">{estimation.estimatedVolume.toFixed(1)} م³</div>
                          </div>
                          <div>
                            <span className="text-gray-500">الوزن المتوقع:</span>
                            <div className="font-medium">{estimation.estimatedWeight.toFixed(1)} طن</div>
                          </div>
                          <div>
                            <span className="text-gray-500">الحاوية المناسبة:</span>
                            <div className="font-medium">{container?.nameAr}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">عدد الحاويات:</span>
                            <div className="font-medium">{estimation.containerQuantity}</div>
                          </div>
                        </div>

                        {estimation.environmentalTips.length > 0 && (
                          <div className="mt-3 p-2 bg-green-50 rounded">
                            <div className="text-sm font-medium text-green-800 mb-1">نصائح بيئية:</div>
                            <ul className="text-sm text-green-700 space-y-1">
                              {estimation.environmentalTips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="flex items-center gap-1">
                                  <Leaf className="h-3 w-3" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Provider Selection */}
          {providers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  اختيار مزود الخدمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {providers.map(provider => (
                    <div
                      key={provider.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        scheduleForm.selectedProvider === provider.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setScheduleForm(prev => ({ ...prev, selectedProvider: provider.id }))}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{provider.nameAr}</h4>
                            {provider.isVerified && (
                              <Badge variant="secondary">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                موثق
                              </Badge>
                            )}
                            {provider.isEcoFriendly && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Recycle className="h-3 w-3 mr-1" />
                                صديق للبيئة
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">التقييم:</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{provider.rating}</span>
                                <span className="text-gray-500">({provider.reviewCount})</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">الهاتف:</span>
                              <div className="font-medium">{provider.contactInfo.phone}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">المدينة:</span>
                              <div className="font-medium">{provider.contactInfo.city}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">خدمة طوارئ:</span>
                              <div className="font-medium">
                                {provider.emergencyService ? 'متوفرة' : 'غير متوفرة'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Collection Details */}
          {scheduleForm.selectedProvider && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  تفاصيل الجمع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>عنوان الجمع</Label>
                    <Textarea
                      placeholder="أدخل العنوان الكامل مع تفاصيل الوصول"
                      value={scheduleForm.collectionAddress}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, collectionAddress: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>المدينة</Label>
                    <Select value={scheduleForm.city} onValueChange={(value) =>
                      setScheduleForm(prev => ({ ...prev, city: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="riyadh">الرياض</SelectItem>
                        <SelectItem value="jeddah">جدة</SelectItem>
                        <SelectItem value="dammam">الدمام</SelectItem>
                        <SelectItem value="mecca">مكة</SelectItem>
                        <SelectItem value="medina">المدينة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>تاريخ الجمع المفضل</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {scheduleForm.selectedDate.toLocaleDateString('ar-SA')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>اختر تاريخ الجمع</DialogTitle>
                        </DialogHeader>
                        <Calendar
                          mode="single"
                          selected={scheduleForm.selectedDate}
                          onSelect={(date) => {
                            if (date instanceof Date) {
                              setScheduleForm(prev => ({ ...prev, selectedDate: date }));
                            }
                          }}
                          disabled={(date) => date < new Date()}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-2">
                    <Label>الفترة المفضلة</Label>
                    <Select value={scheduleForm.timeSlot} onValueChange={(value: any) =>
                      setScheduleForm(prev => ({ ...prev, timeSlot: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">صباحاً (8:00 - 12:00)</SelectItem>
                        <SelectItem value="afternoon">بعد الظهر (12:00 - 17:00)</SelectItem>
                        <SelectItem value="evening">مساءً (17:00 - 20:00)</SelectItem>
                        <SelectItem value="flexible">مرن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الشخص المسؤول</Label>
                    <Input
                      placeholder="اسم الشخص المسؤول"
                      value={scheduleForm.contactName}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, contactName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>رقم الهاتف</Label>
                    <Input
                      placeholder="05xxxxxxxx"
                      value={scheduleForm.contactPhone}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>متطلبات الوصول (اختياري)</Label>
                    <Input
                      placeholder="مثل: بوابة خلفية، إذن دخول"
                      value={scheduleForm.accessRequirements}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, accessRequirements: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>تعليمات خاصة (اختياري)</Label>
                  <Textarea
                    placeholder="أي تعليمات خاصة للسائق أو طاقم الجمع"
                    value={scheduleForm.specialInstructions}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  />
                </div>

                <Button
                  onClick={scheduleWasteCollection}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {loading ? 'جاري الجدولة...' : 'تأكيد جدولة الجمع'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Track Collection Tab */}
        <TabsContent value="track" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                تتبع عملية الجمع
              </CardTitle>
              <CardDescription>
                أدخل رقم التتبع لمعرفة حالة عملية جمع النفايات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="رقم التتبع"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={trackCollection} disabled={loading || !trackingId}>
                  <Navigation className="h-4 w-4 mr-2" />
                  {loading ? 'جاري البحث...' : 'تتبع'}
                </Button>
              </div>

              {trackingData && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">عملية الجمع #{trackingData.id}</h3>
                        <p className="text-gray-600">{trackingData.collectionAddress}</p>
                      </div>
                      <Badge className={getStatusColor(trackingData.status)}>
                        {getStatusIcon(trackingData.status)}
                        <span className="mr-1">
                          {trackingData.status === 'scheduled' && 'مجدولة'}
                          {trackingData.status === 'pin-delivered' && 'تم توصيل الحاويات'}
                          {trackingData.status === 'collecting' && 'جاري الجمع'}
                          {trackingData.status === 'completed' && 'مكتملة'}
                          {trackingData.status === 'cancelled' && 'ملغية'}
                        </span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">تاريخ الجمع:</span>
                        <div className="font-medium">
                          {trackingData.scheduledDate.toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">الحجم المتوقع:</span>
                        <div className="font-medium">{trackingData.estimatedVolume} م³</div>
                      </div>
                      <div>
                        <span className="text-gray-500">عدد الحاويات:</span>
                        <div className="font-medium">{trackingData.containerQuantity}</div>
                      </div>
                    </div>

                    {/* Pin Delivery Info */}
                    {trackingData.pinDelivery && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded">
                        <h4 className="font-medium text-yellow-800 mb-2">معلومات توصيل الحاويات</h4>
                        <div className="text-sm text-yellow-700">
                          <p>تاريخ التوصيل المجدول: {new Date(trackingData.pinDelivery.scheduledDate).toLocaleDateString('ar-SA')}</p>
                          {trackingData.pinDelivery.actualDate && (
                            <p>تم التوصيل في: {new Date(trackingData.pinDelivery.actualDate).toLocaleDateString('ar-SA')}</p>
                          )}
                          <p>أرقام الحاويات: {trackingData.pinDelivery.pinNumbers.join(', ')}</p>
                        </div>
                      </div>
                    )}

                    {/* Real-time Tracking */}
                    {trackingData.trackingInfo && (
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <h4 className="font-medium text-blue-800 mb-2">التتبع المباشر</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          <p>السائق: {trackingData.trackingInfo.driverName}</p>
                          <p>هاتف السائق: {trackingData.trackingInfo.driverPhone}</p>
                          <p>الوقت المتوقع للوصول: {new Date(trackingData.trackingInfo.eta).toLocaleTimeString('ar-SA')}</p>
                          <p>آخر تحديث: {new Date(trackingData.trackingInfo.lastUpdate).toLocaleTimeString('ar-SA')}</p>
                        </div>
                      </div>
                    )}

                    {/* Collection Completion Info */}
                    {trackingData.collectionInfo && (
                      <div className="mt-4 p-3 bg-green-50 rounded">
                        <h4 className="font-medium text-green-800 mb-2">معلومات إتمام الجمع</h4>
                        <div className="text-sm text-green-700 space-y-1">
                          <p>الحجم الفعلي: {trackingData.collectionInfo.actualVolume} م³</p>
                          <p>الوزن الفعلي: {trackingData.collectionInfo.actualWeight} طن</p>
                          <p>حالة النفايات: {trackingData.collectionInfo.wasteCondition}</p>
                          {trackingData.collectionInfo.recyclingReport && (
                            <p>تم إعادة تدوير: {trackingData.collectionInfo.recyclingReport.recycledAmount} طن</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                تاريخ عمليات جمع النفايات
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userCollections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  لا توجد عمليات جمع سابقة
                </div>
              ) : (
                <div className="space-y-4">
                  {userCollections.map(collection => (
                    <div key={collection.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">#{collection.id}</h4>
                          <p className="text-sm text-gray-600">{collection.collectionAddress}</p>
                          <p className="text-xs text-gray-500">
                            {collection.createdAt.toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(collection.status)}>
                          {getStatusIcon(collection.status)}
                          <span className="mr-1">
                            {collection.status === 'scheduled' && 'مجدولة'}
                            {collection.status === 'pin-delivered' && 'تم توصيل الحاويات'}
                            {collection.status === 'collecting' && 'جاري الجمع'}
                            {collection.status === 'completed' && 'مكتملة'}
                            {collection.status === 'cancelled' && 'ملغية'}
                          </span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">التكلفة:</span>
                          <div className="font-medium">{collection.totalCost.toLocaleString()} ر.س</div>
                        </div>
                        <div>
                          <span className="text-gray-500">الحجم:</span>
                          <div className="font-medium">{collection.estimatedVolume} م³</div>
                        </div>
                        <div>
                          <span className="text-gray-500">عدد الحاويات:</span>
                          <div className="font-medium">{collection.containerQuantity}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">حالة الدفع:</span>
                          <div className="font-medium">
                            {collection.paymentStatus === 'paid' && 'مدفوع'}
                            {collection.paymentStatus === 'pending' && 'معلق'}
                            {collection.paymentStatus === 'refunded' && 'مسترد'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setTrackingId(collection.id);
                            setActiveTab('track');
                            trackCollection();
                          }}
                        >
                          <Navigation className="h-3 w-3 mr-1" />
                          تتبع
                        </Button>
                        {collection.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            <FileText className="h-3 w-3 mr-1" />
                            شهادة التخلص
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
