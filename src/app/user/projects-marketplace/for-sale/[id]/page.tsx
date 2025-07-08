// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Home, 
  Ruler, 
  DollarSign,
  Tag,
  Eye,
  Share2,
  Phone,
  Mail,
  Clock,
  Building,
  Users,
  Zap,
  Car
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  project_type: string;
  location: string;
  address: string;
  city: string;
  region: string;
  plot_area: number;
  building_area: number;
  floors_count: number;
  rooms_count: number;
  bathrooms_count: number;
  status: string;  progress_percentage: number;
  advertisement_number: string;
  sale_price: number;
  sale_description: string;
  currency: string;
  budget: number;
  total_cost: number;
  profit_percentage: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  // User profile information
  users?: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function ProjectForSaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    if (params.id) {
      loadProject();
    }
  }, [params.id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          users:user_id (
            name,
            email,
            phone
          )
        `)
        .eq('id', params.id)
        .eq('status', 'completed')
        .eq('for_sale', true)
        .not('advertisement_number', 'is', null)
        .single();

      if (error) {
        console.error('Error loading project:', error);
        setError('Project not found or not available for sale');
        return;
      }

      if (!data) {
        setError('Project not found');
        return;
      }

      setProject(data);
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while loading the project');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: project?.name,
        text: `Check out this property for sale: ${project?.name}`,
        url: window.location.href,
      });
    } catch (err) {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatPrice = (price: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatArea = (area: number) => {
    return new Intl.NumberFormat('ar-SA').format(area);
  };

  const getProjectTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'villa': 'فيلا',
      'apartment': 'شقة',
      'commercial': 'تجاري',
      'office': 'مكتب',
      'warehouse': 'مستودع',
      'land': 'أرض',
      'other': 'أخرى'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جارٍ تحميل تفاصيل المشروع...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">المشروع غير متاح</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/projects/for-sale"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة إلى القائمة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                href="/projects/for-sale"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 ml-2" />
                العودة إلى القائمة
              </Link>
              <div className="text-sm text-gray-500">
                رقم الإعلان: {project.advertisement_number}
              </div>
            </div>
            <button
              onClick={handleShare}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4 ml-2" />
              مشاركة
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                  <div className="flex items-center text-gray-600 space-x-4 space-x-reverse">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 ml-1" />
                      <span>{project.city}, {project.region}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 ml-1" />
                      <span>{getProjectTypeLabel(project.project_type)}</span>
                    </div>
                  </div>
                </div>                <div className="text-left">
                  <div className="text-3xl font-bold text-green-600">
                    {formatPrice(project.sale_price, project.currency)}
                  </div>
                  {project.profit_percentage && (
                    <div className="text-sm text-green-600 mt-1">
                      ربح {project.profit_percentage}% على التكلفة الفعلية
                    </div>
                  )}
                </div>
              </div>

              {/* Comprehensive Investment Details */}
              {(project.budget || project.total_cost || project.profit_percentage) && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6 border border-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-6 h-6 ml-2 text-green-600" />
                    تفاصيل الاستثمار والربحية
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {project.budget && (
                      <div className="bg-white rounded-lg p-4 text-center border">
                        <div className="text-sm text-gray-600 mb-1">الميزانية الأصلية</div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(project.budget, project.currency)}
                        </div>
                      </div>
                    )}
                    
                    {project.total_cost && (
                      <div className="bg-white rounded-lg p-4 text-center border">
                        <div className="text-sm text-gray-600 mb-1">التكلفة الفعلية</div>
                        <div className="text-lg font-bold text-orange-600">
                          {formatPrice(project.total_cost, project.currency)}
                        </div>
                      </div>
                    )}
                    
                    {project.profit_percentage && (
                      <div className="bg-white rounded-lg p-4 text-center border">
                        <div className="text-sm text-gray-600 mb-1">نسبة الربح</div>
                        <div className="text-lg font-bold text-green-600">
                          {project.profit_percentage}%
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-white rounded-lg p-4 text-center border">
                      <div className="text-sm text-gray-600 mb-1">سعر البيع</div>
                      <div className="text-lg font-bold text-green-700">
                        {formatPrice(project.sale_price, project.currency)}
                      </div>
                    </div>
                  </div>

                  {/* Profit Calculation Breakdown */}
                  {project.total_cost && project.profit_percentage && (
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-semibold text-gray-900 mb-3">تفصيل حساب الربح</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">التكلفة الفعلية:</span>
                          <span className="font-medium">{formatPrice(project.total_cost, project.currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">نسبة الربح المضافة:</span>
                          <span className="font-medium text-green-600">{project.profit_percentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">قيمة الربح:</span>
                          <span className="font-medium text-green-600">
                            {formatPrice(project.sale_price - project.total_cost, project.currency)}
                          </span>
                        </div>
                        <div className="border-t pt-2 flex justify-between">
                          <span className="font-semibold text-gray-900">السعر النهائي:</span>
                          <span className="font-bold text-green-700">
                            {formatPrice(project.sale_price, project.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Budget vs Actual Cost Analysis */}
                  {project.budget && project.total_cost && (
                    <div className="bg-white rounded-lg p-4 border mt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">تحليل التكلفة</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">الميزانية المخططة:</span>
                          <span className="font-medium">{formatPrice(project.budget, project.currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">التكلفة الفعلية:</span>
                          <span className="font-medium">{formatPrice(project.total_cost, project.currency)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between">
                          <span className="font-semibold text-gray-900">
                            {project.total_cost <= project.budget ? 'وفورات:' : 'زيادة في التكلفة:'}
                          </span>
                          <span className={`font-bold ${project.total_cost <= project.budget ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPrice(Math.abs(project.budget - project.total_cost), project.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Location */}
              {project.address && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">العنوان</h3>
                  <p className="text-gray-700">{project.address}</p>
                </div>
              )}

              {/* Description */}
              {project.sale_description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">وصف المشروع</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{project.sale_description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">تفاصيل المشروع</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {project.plot_area && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Ruler className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{formatArea(project.plot_area)}</div>
                    <div className="text-sm text-gray-600">مساحة الأرض (م²)</div>
                  </div>
                )}

                {project.building_area && (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Building className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{formatArea(project.building_area)}</div>
                    <div className="text-sm text-gray-600">مساحة البناء (م²)</div>
                  </div>
                )}

                {project.floors_count && (
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Home className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{project.floors_count}</div>
                    <div className="text-sm text-gray-600">عدد الطوابق</div>
                  </div>
                )}

                {project.rooms_count && (
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{project.rooms_count}</div>
                    <div className="text-sm text-gray-600">عدد الغرف</div>
                  </div>
                )}

                {project.bathrooms_count && (
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <Zap className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{project.bathrooms_count}</div>
                    <div className="text-sm text-gray-600">عدد دورات المياه</div>
                  </div>
                )}                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-green-600">مكتمل</div>
                  <div className="text-sm text-gray-600">حالة المشروع</div>
                </div>
              </div>
            </div>

            {/* Construction Timeline */}
            {(project.start_date || project.end_date) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-6 h-6 ml-2 text-blue-600" />
                  الجدول الزمني للمشروع
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.start_date && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <Calendar className="w-5 h-5 text-blue-600 ml-2" />
                        <h3 className="font-semibold text-blue-900">تاريخ البدء</h3>
                      </div>
                      <div className="text-lg font-bold text-blue-700">
                        {new Date(project.start_date).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                  
                  {project.end_date && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <Calendar className="w-5 h-5 text-green-600 ml-2" />
                        <h3 className="font-semibold text-green-900">تاريخ الاكتمال</h3>
                      </div>
                      <div className="text-lg font-bold text-green-700">
                        {new Date(project.end_date).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Duration */}
                {project.start_date && project.end_date && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">مدة التنفيذ</h3>
                    <div className="text-lg font-bold text-gray-700">
                      {Math.ceil(
                        (new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) 
                        / (1000 * 60 * 60 * 24 * 30)
                      )} شهر تقريباً
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Original Description */}
            {project.description && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">معلومات إضافية</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">معلومات الاتصال</h3>
              <div className="space-y-3">
                {project.users?.name && (
                  <div className="flex items-center text-gray-700">
                    <Users className="w-4 h-4 ml-3 text-gray-400" />
                    <span>{project.users.name}</span>
                  </div>
                )}
                {project.users?.phone && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-4 h-4 ml-3 text-gray-400" />
                    <a href={`tel:${project.users.phone}`} className="hover:text-blue-600">
                      {project.users.phone}
                    </a>
                  </div>
                )}
                {project.users?.email && (
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-4 h-4 ml-3 text-gray-400" />
                    <a href={`mailto:${project.users.email}`} className="hover:text-blue-600">
                      {project.users.email}
                    </a>
                  </div>
                )}
              </div>
              
              <button className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                تواصل مع المالك
              </button>
            </div>            {/* Project Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">ملخص المشروع</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">رقم الإعلان:</span>
                  <span className="font-medium">{project.advertisement_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">نوع المشروع:</span>
                  <span className="font-medium">{getProjectTypeLabel(project.project_type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ الإنشاء:</span>
                  <span className="font-medium">
                    {new Date(project.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">آخر تحديث:</span>
                  <span className="font-medium">
                    {new Date(project.updated_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            </div>

            {/* Investment Summary for Buyers */}
            {(project.total_cost || project.profit_percentage) && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-green-800 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 ml-2" />
                  ملخص الاستثمار
                </h3>
                <div className="space-y-3 text-sm">
                  {project.total_cost && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">التكلفة الفعلية:</span>
                      <span className="font-medium text-orange-600">
                        {formatPrice(project.total_cost, project.currency)}
                      </span>
                    </div>
                  )}
                  {project.profit_percentage && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">هامش الربح:</span>
                      <span className="font-medium text-green-600">{project.profit_percentage}%</span>
                    </div>
                  )}
                  {project.total_cost && project.profit_percentage && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">قيمة الربح:</span>
                      <span className="font-medium text-green-600">
                        {formatPrice(project.sale_price - project.total_cost, project.currency)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-green-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">السعر الإجمالي:</span>
                    <span className="font-bold text-green-700">
                      {formatPrice(project.sale_price, project.currency)}
                    </span>
                  </div>
                </div>
                
                {/* ROI Information */}
                {project.total_cost && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">عائد الاستثمار (ROI)</div>
                      <div className="text-lg font-bold text-green-700">
                        {(((project.sale_price - project.total_cost) / project.total_cost) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Safety Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-bold text-yellow-800 mb-2">تنبيه مهم</h3>
              <p className="text-sm text-yellow-700">
                يرجى التحقق من صحة المعلومات والوثائق قبل إتمام أي صفقة. ننصح بزيارة الموقع والتأكد من جميع التفاصيل.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
