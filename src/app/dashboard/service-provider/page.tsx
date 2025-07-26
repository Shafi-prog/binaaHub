// Service Provider Multi-Type Dashboard
// Universal dashboard for all service provider types

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Briefcase, 
  Users, 
  Star, 
  TrendingUp, 
  MessageSquare,
  Settings,
  Plus,
  FileText,
  DollarSign,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Camera,
  Award,
  MapPin,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { serviceProviderService } from '@/core/services/serviceProviderService';

interface ServiceProviderDashboardProps {
  providerType: 'design-office' | 'construction-company' | 'insurance' | 'concrete-supplier' | 'general';
}

export default function ServiceProviderDashboard({ 
  providerType = 'general' 
}: ServiceProviderDashboardProps) {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'portfolio' | 'reviews' | 'settings'>('overview');
  const [providerData, setProviderData] = useState<any>(null);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardData = await serviceProviderService.getProviderDashboard('current-provider-id');
      
      setProviderData(dashboardData.provider);
      setServiceRequests(dashboardData.recentRequests);
      setReviews(dashboardData.recentReviews);
      setAnalytics(dashboardData.stats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('فشل في تحميل بيانات اللوحة');
    } finally {
      setLoading(false);
    }
  };

  const submitProposal = async (requestId: string, proposalData: any) => {
    try {
      await serviceProviderService.submitProposal({
        requestId,
        providerId: 'current-provider-id',
        ...proposalData
      });
      toast.success('تم إرسال العرض بنجاح');
      loadDashboardData();
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast.error('فشل في إرسال العرض');
    }
  };

  const getProviderTypeIcon = () => {
    const icons = {
      'design-office': Building,
      'construction-company': Briefcase,
      'insurance': Award,
      'concrete-supplier': FileText,
      'general': Briefcase
    };
    const IconComponent = icons[providerType];
    return <IconComponent className="h-8 w-8 text-blue-600" />;
  };

  const getProviderTypeName = () => {
    const names = {
      'design-office': 'مكتب التصميم المعماري',
      'construction-company': 'شركة المقاولات',
      'insurance': 'شركة التأمين',
      'concrete-supplier': 'مورد الخرسانة',
      'general': 'مزود الخدمة'
    };
    return names[providerType];
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'open': 'bg-blue-500',
      'proposals-received': 'bg-yellow-500',
      'provider-selected': 'bg-orange-500',
      'in-progress': 'bg-purple-500',
      'completed': 'bg-green-500',
      'cancelled': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {getProviderTypeIcon()}
            لوحة تحكم {getProviderTypeName()}
          </h1>
          <p className="text-gray-600">
            {providerData?.businessNameAr || 'إدارة شاملة لخدماتك ومشاريعك'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            الإعدادات
          </Button>
          {providerType === 'design-office' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة تصميم
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>إضافة تصميم جديد للمعرض</DialogTitle>
                </DialogHeader>
                {/* Add Design Form would go here */}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="requests">طلبات الخدمة</TabsTrigger>
          <TabsTrigger value="portfolio">المعرض</TabsTrigger>
          <TabsTrigger value="reviews">التقييمات</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">طلبات جديدة</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalRequests || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.activeProposals || 0} عرض نشط
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">مشاريع مكتملة</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.completedProjects || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 5) + 1} هذا الشهر
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.monthlyEarnings?.toLocaleString() || '0'} ر.س
                </div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 15) + 5}% من الشهر الماضي
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">التقييم</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-1">
                  {analytics?.averageRating || 4.5}
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {reviews.length} تقييم
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Provider Profile Summary */}
          {providerData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  ملف الشركة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">اسم النشاط:</span>
                      <div className="font-medium">{providerData.businessNameAr}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">سنوات الخبرة:</span>
                      <div className="font-medium">{providerData.experienceYears} سنة</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">حجم الفريق:</span>
                      <div className="font-medium">{providerData.teamSize} موظف</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">المدينة:</span>
                      <div className="font-medium flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {providerData.city}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">رقم الهاتف:</span>
                      <div className="font-medium flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {providerData.phone}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">حالة التحقق:</span>
                      <Badge 
                        className={providerData.verificationStatus === 'verified' ? 'bg-green-500' : 'bg-yellow-500'}
                      >
                        {providerData.verificationStatus === 'verified' ? 'موثق' : 'قيد المراجعة'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">التخصصات:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(providerData.specializations || []).slice(0, 3).map((spec: string, index: number) => (
                          <Badge key={index} variant="outline">{spec}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">الشهادات:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(providerData.certifications || []).slice(0, 2).map((cert: string, index: number) => (
                          <Badge key={index} variant="outline">
                            <Award className="h-3 w-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Service Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                طلبات الخدمة الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceRequests.slice(0, 5).map((request, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{request.projectTitle}</h4>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status === 'open' && 'مفتوح'}
                          {request.status === 'proposals-received' && 'استُلمت عروض'}
                          {request.status === 'provider-selected' && 'تم الاختيار'}
                          {request.status === 'in-progress' && 'جاري التنفيذ'}
                          {request.status === 'completed' && 'مكتمل'}
                          {request.status === 'cancelled' && 'ملغي'}
                        </Badge>
                        {request.urgency === 'high' && (
                          <Badge variant="destructive">عاجل</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">الموقع:</span>
                          <div className="font-medium">{request.projectLocation}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">الميزانية:</span>
                          <div className="font-medium">
                            {request.estimatedBudget.min.toLocaleString()} - {request.estimatedBudget.max.toLocaleString()} ر.س
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">تاريخ البدء المفضل:</span>
                          <div className="font-medium">
                            {new Date(request.preferredStartDate).toLocaleDateString('ar-SA')}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">المدة المتوقعة:</span>
                          <div className="font-medium">{request.estimatedDuration} يوم</div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {request.projectDescription}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {request.status === 'open' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <FileText className="h-3 w-3 mr-1" />
                              تقديم عرض
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>تقديم عرض للمشروع</DialogTitle>
                              <DialogDescription>
                                قدم عرضاً تفصيلياً لمشروع: {request.projectTitle}
                              </DialogDescription>
                            </DialogHeader>
                            {/* Proposal Form would go here */}
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        عرض التفاصيل
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                إدارة طلبات الخدمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceRequests.map((request, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{request.projectTitle}</h3>
                        <p className="text-gray-600">{request.projectLocation}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status === 'open' && 'مفتوح'}
                          {request.status === 'proposals-received' && 'استُلمت عروض'}
                          {request.status === 'provider-selected' && 'تم الاختيار'}
                        </Badge>
                        {request.urgency === 'high' && (
                          <Badge variant="destructive">عاجل</Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">الميزانية المتوقعة:</span>
                        <div className="font-medium">
                          {request.estimatedBudget.min.toLocaleString()} - {request.estimatedBudget.max.toLocaleString()} ر.س
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">تاريخ البدء المفضل:</span>
                        <div className="font-medium">
                          {new Date(request.preferredStartDate).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">المدة المتوقعة:</span>
                        <div className="font-medium">{request.estimatedDuration} يوم</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-sm text-gray-500">وصف المشروع:</span>
                      <p className="mt-1">{request.projectDescription}</p>
                    </div>

                    {request.requiredSkills && request.requiredSkills.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">المهارات المطلوبة:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {request.requiredSkills.map((skill: string, skillIndex: number) => (
                            <Badge key={skillIndex} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      {request.status === 'open' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>
                              <FileText className="h-4 w-4 mr-2" />
                              تقديم عرض
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>تقديم عرض تفصيلي</DialogTitle>
                              <DialogDescription>
                                قدم عرضاً شاملاً لمشروع: {request.projectTitle}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>التكلفة المقترحة (ر.س)</Label>
                                  <Input type="number" placeholder="50000" />
                                </div>
                                <div className="space-y-2">
                                  <Label>المدة المقترحة (يوم)</Label>
                                  <Input type="number" placeholder="30" />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>منهجية التنفيذ</Label>
                                <Textarea 
                                  placeholder="اشرح كيف ستقوم بتنفيذ هذا المشروع بالتفصيل..."
                                  rows={4}
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>حجم الفريق المخصص</Label>
                                  <Input type="number" placeholder="5" />
                                </div>
                                <div className="space-y-2">
                                  <Label>شروط الدفع</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="اختر شروط الدفع" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="advance-50">50% مقدم، 50% عند الانتهاء</SelectItem>
                                      <SelectItem value="phases">على دفعات حسب المراحل</SelectItem>
                                      <SelectItem value="monthly">دفع شهري</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>مشاريع مماثلة تم إنجازها</Label>
                                <Input type="number" placeholder="10" />
                              </div>

                              <div className="space-y-2">
                                <Label>ملاحظات إضافية</Label>
                                <Textarea 
                                  placeholder="أي معلومات إضافية تود إضافتها..."
                                  rows={3}
                                />
                              </div>

                              <div className="flex justify-end gap-4">
                                <Button variant="outline">إلغاء</Button>
                                <Button onClick={() => {
                                  toast.success('تم إرسال العرض بنجاح');
                                }}>
                                  إرسال العرض
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        عرض التفاصيل
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                معرض الأعمال
                {providerType === 'design-office' && ' والتصاميم'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(providerData?.portfolioImages || []).map((image: string, index: number) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium">مشروع رقم {index + 1}</h4>
                      <p className="text-sm text-gray-600">وصف المشروع...</p>
                      <div className="flex justify-between items-center mt-3">
                        <Badge variant="outline">مكتمل</Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          عرض
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add New Portfolio Item */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
                  <Camera className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">إضافة عمل جديد</p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    رفع صور
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                تقييمات العملاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.rating}/5</span>
                        </div>
                        <p className="text-gray-600">{review.customerName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <Badge variant="outline">{review.projectType}</Badge>
                    </div>

                    <p className="text-gray-800 mb-4">{review.reviewText}</p>

                    {review.ratings && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">الجودة:</span>
                          <div className="font-medium">{review.ratings.quality}/5</div>
                        </div>
                        <div>
                          <span className="text-gray-500">الالتزام بالوقت:</span>
                          <div className="font-medium">{review.ratings.timeliness}/5</div>
                        </div>
                        <div>
                          <span className="text-gray-500">التواصل:</span>
                          <div className="font-medium">{review.ratings.communication}/5</div>
                        </div>
                        <div>
                          <span className="text-gray-500">الاحترافية:</span>
                          <div className="font-medium">{review.ratings.professionalism}/5</div>
                        </div>
                        <div>
                          <span className="text-gray-500">القيمة مقابل المال:</span>
                          <div className="font-medium">{review.ratings.valueForMoney}/5</div>
                        </div>
                      </div>
                    )}

                    {!review.providerResponse && (
                      <div className="mt-4 pt-4 border-t">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          الرد على التقييم
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات الحساب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>اسم النشاط</Label>
                    <Input value={providerData?.businessNameAr || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم المالك</Label>
                    <Input value={providerData?.ownerName || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>رقم الهاتف</Label>
                    <Input value={providerData?.phone || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input type="email" value={providerData?.email || ''} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>المدينة</Label>
                    <Select value={providerData?.city || ''}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="riyadh">الرياض</SelectItem>
                        <SelectItem value="jeddah">جدة</SelectItem>
                        <SelectItem value="dammam">الدمام</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>سنوات الخبرة</Label>
                    <Input type="number" value={providerData?.experienceYears || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>حجم الفريق</Label>
                    <Input type="number" value={providerData?.teamSize || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>نطاق الخدمة (كم)</Label>
                    <Input type="number" value={providerData?.maxServiceRadius || ''} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>وصف الخدمات</Label>
                  <Textarea 
                    value={providerData?.serviceDescriptionAr || ''}
                    rows={4}
                    placeholder="اكتب وصفاً شاملاً للخدمات التي تقدمها..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline">إلغاء</Button>
                <Button>حفظ التغييرات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
