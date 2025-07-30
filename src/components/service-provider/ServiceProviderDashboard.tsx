// Service Provider Multi-Type Dashboard
// Universal dashboard for all service provider types
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { Label } from '@/core/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/shared/components/ui/select';
import { Textarea } from '@/core/shared/components/ui/textarea';
import { Badge } from '@/core/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/core/shared/components/ui/dialog';
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

interface ServiceProviderDashboardProps {
  providerType: 'design-office' | 'construction-company' | 'insurance' | 'concrete-supplier' | 'general';
}

export default function ServiceProviderDashboard({
  providerType = 'general'
}: ServiceProviderDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'portfolio' | 'reviews' | 'settings'>('overview');
  const [providerData, setProviderData] = useState<any>(null);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with real data fetching from Supabase or API
      // Example: const realData = await fetchProviderDashboardData();
      // setProviderData(realData.provider);
      // setServiceRequests(realData.recentRequests);
      // setReviews(realData.recentReviews);
      // setAnalytics(realData.stats);
      setProviderData(null);
      setServiceRequests([]);
      setReviews([]);
      setAnalytics(null);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('فشل في تحميل بيانات اللوحة');
    } finally {
      setLoading(false);
    }
  };

  const submitProposal = async (requestId: string, proposalData: any) => {
    try {
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

        <TabsContent value="overview" className="space-y-6">
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
                        <Button size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          تقديم عرض
                        </Button>
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

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>إدارة طلبات الخدمة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">قريباً - إدارة شاملة لطلبات الخدمة</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>معرض الأعمال</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">قريباً - معرض الأعمال والمشاريع</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>تقييمات العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="border rounded-lg p-4">
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
                    <p className="font-medium">{review.customerName}</p>
                    <p className="text-gray-600 mt-2">{review.reviewText}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الحساب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>اسم النشاط</Label>
                    <Input value={providerData?.businessNameAr || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>رقم الهاتف</Label>
                    <Input value={providerData?.phone || ''} />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline">إلغاء</Button>
                  <Button>حفظ التغييرات</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
