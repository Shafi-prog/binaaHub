// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/core/shared/components/ui/card';
import { LoadingSpinner } from '@/core/shared/components/ui/loading-spinner';
import { verifyAuthWithRetry } from '@/core/shared/services/auth-recovery';
import {
  Shield,
  Calendar,
  FileText,
  User,
  Phone,
  Mail,
  Building2,
  Package,
  ArrowLeft,
  Download,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface Warranty {
  id: string;
  user_id: string;
  warranty_number: string;
  product_name: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  purchase_date: string;
  warranty_start_date: string;
  warranty_end_date: string;
  warranty_period_months: number;
  warranty_type: 'manufacturer' | 'extended' | 'store' | 'custom';
  coverage_description?: string;
  status: 'active' | 'expired' | 'claimed' | 'void';
  is_transferable: boolean;
  claim_count: number;
  vendor_name?: string;
  vendor_contact?: string;
  purchase_price?: number;
  purchase_location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface WarrantyClaim {
  id: string;
  warranty_id: string;
  claim_number: string;
  claim_date: string;
  issue_description: string;
  status: 'submitted' | 'in_progress' | 'resolved' | 'rejected';
  resolution_notes?: string;
  created_at: string;
}

export default function WarrantyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const warrantyId = params.id as string;

  const [warranty, setWarranty] = useState<Warranty | null>(null);
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verify authentication
        const authResult = await verifyAuthWithRetry();
        if (authResult.error || !authResult.user) {
          console.error('❌ [Warranty Detail] Authentication failed');
          router.push('/login');
          return;
        }

        // Load warranty data
        const { data: warrantyData, error: warrantyError } = await supabase
          .from('warranties')
          .select('*')
          .eq('id', warrantyId)
          .eq('user_id', authResult.user.id)
          .single();

        if (warrantyError) {
          throw new Error(warrantyError.message);
        }

        if (!warrantyData) {
          throw new Error('الضمان غير موجود أو ليس لديك صلاحية للوصول إليه');
        }

        setWarranty(warrantyData);

        // Load warranty claims
        const { data: claimsData, error: claimsError } = await supabase
          .from('warranty_claims')
          .select('*')
          .eq('warranty_id', warrantyId)
          .order('created_at', { ascending: false });

        if (!claimsError && claimsData) {
          setClaims(claimsData);
        }
      } catch (error) {
        console.error('Error loading warranty:', error);
        setError(error instanceof Error ? error.message : 'حدث خطأ في تحميل بيانات الضمان');
      } finally {
        setLoading(false);
      }
    };

    if (warrantyId) {
      initPage();
    }
  }, [warrantyId, router, supabase]);

  const getDaysUntilExpiry = (endDate: string) => {
    return Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const getWarrantyStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'expired':
        return 'red';
      case 'claimed':
        return 'yellow';
      case 'void':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const getWarrantyStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'فعال';
      case 'expired':
        return 'منتهي الصلاحية';
      case 'claimed':
        return 'تم المطالبة';
      case 'void':
        return 'ملغي';
      default:
        return status;
    }
  };

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'blue';
      case 'in_progress':
        return 'yellow';
      case 'resolved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getClaimStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'مقدمة';
      case 'in_progress':
        return 'قيد المعالجة';
      case 'resolved':
        return 'تم الحل';
      case 'rejected':
        return 'مرفوضة';
      default:
        return status;
    }
  };

  const handleNewClaim = () => {
    router.push(`/user/warranties/${warrantyId}/claim`);
  };

  const handleEdit = () => {
    router.push(`/user/warranties/${warrantyId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا الضمان؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase.from('warranties').delete().eq('id', warrantyId);

      if (error) throw error;

      router.push('/user/warranties');
    } catch (error) {
      console.error('Error deleting warranty:', error);
      alert('حدث خطأ في حذف الضمان');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">خطأ</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            العودة
          </button>
        </Card>
      </div>
    );
  }

  if (!warranty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">الضمان غير موجود</h2>
          <p className="text-gray-600 mb-4">لم يتم العثور على هذا الضمان</p>
          <button
            onClick={() => router.push('/user/warranties')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            العودة للضمانات
          </button>
        </Card>
      </div>
    );
  }

  return (
    <main className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تفاصيل الضمان</h1>
            <p className="text-gray-600 mt-1">رقم الضمان: {warranty.warranty_number}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {warranty.status === 'active' && (
            <button
              onClick={handleNewClaim}
              disabled={actionLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              تقديم مطالبة
            </button>
          )}
          <button
            onClick={handleEdit}
            disabled={actionLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل
          </button>
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            حذف
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warranty Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">معلومات المنتج</h2>
              <StatusBadge
                status={warranty.status}
                label={getWarrantyStatusText(warranty.status)}
                color={getWarrantyStatusColor(warranty.status)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">اسم المنتج</p>
                    <p className="font-medium">{warranty.product_name}</p>
                  </div>
                </div>

                {warranty.brand && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">العلامة التجارية</p>
                      <p className="font-medium">{warranty.brand}</p>
                    </div>
                  </div>
                )}

                {warranty.model && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">الموديل</p>
                      <p className="font-medium">{warranty.model}</p>
                    </div>
                  </div>
                )}

                {warranty.serial_number && (
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">الرقم التسلسلي</p>
                      <p className="font-medium">{warranty.serial_number}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الشراء</p>
                    <p className="font-medium">
                      {new Date(warranty.purchase_date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">انتهاء الضمان</p>
                    <p className="font-medium">
                      {new Date(warranty.warranty_end_date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>

                {warranty.status === 'active' && (
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600">أيام متبقية</p>
                      <p
                        className={`font-medium ${getDaysUntilExpiry(warranty.warranty_end_date) <= 30 ? 'text-orange-600' : 'text-green-600'}`}
                      >
                        {getDaysUntilExpiry(warranty.warranty_end_date)} يوم
                      </p>
                    </div>
                  </div>
                )}

                {warranty.purchase_price && (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-gray-500">💰</div>
                    <div>
                      <p className="text-sm text-gray-600">سعر الشراء</p>
                      <p className="font-medium">{warranty.purchase_price.toLocaleString()} ريال</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {warranty.coverage_description && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">وصف التغطية</h3>
                <p className="text-gray-700">{warranty.coverage_description}</p>
              </div>
            )}

            {warranty.notes && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">ملاحظات</h3>
                <p className="text-gray-700">{warranty.notes}</p>
              </div>
            )}
          </Card>

          {/* Vendor Info */}
          {warranty.vendor_name && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">معلومات المورد</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">اسم المورد</p>
                    <p className="font-medium">{warranty.vendor_name}</p>
                  </div>
                </div>

                {warranty.vendor_contact && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">معلومات الاتصال</p>
                      <p className="font-medium">{warranty.vendor_contact}</p>
                    </div>
                  </div>
                )}

                {warranty.purchase_location && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">مكان الشراء</p>
                      <p className="font-medium">{warranty.purchase_location}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Warranty Stats & Claims */}
        <div className="space-y-6">
          {/* Stats */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">إحصائيات الضمان</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">مدة الضمان</span>
                <span className="font-medium">{warranty.warranty_period_months} شهر</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">نوع الضمان</span>
                <span className="font-medium">
                  {warranty.warranty_type === 'manufacturer'
                    ? 'ضمان الشركة'
                    : warranty.warranty_type === 'extended'
                      ? 'ضمان ممتد'
                      : warranty.warranty_type === 'store'
                        ? 'ضمان المتجر'
                        : 'ضمان مخصص'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">قابل للتحويل</span>
                <span
                  className={`font-medium ${warranty.is_transferable ? 'text-green-600' : 'text-red-600'}`}
                >
                  {warranty.is_transferable ? 'نعم' : 'لا'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">عدد المطالبات</span>
                <span className="font-medium">{warranty.claim_count}</span>
              </div>
            </div>
          </Card>

          {/* Claims History */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">تاريخ المطالبات</h2>
              {warranty.status === 'active' && (
                <button
                  onClick={handleNewClaim}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + مطالبة جديدة
                </button>
              )}
            </div>

            {claims.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">لا توجد مطالبات</p>
              </div>
            ) : (
              <div className="space-y-3">
                {claims.map((claim) => (
                  <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        مطالبة #{claim.claim_number}
                      </span>
                      <StatusBadge
                        status={claim.status}
                        label={getClaimStatusText(claim.status)}
                        color={getClaimStatusColor(claim.status)}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{claim.issue_description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(claim.claim_date).toLocaleDateString('ar-SA')}
                    </div>
                    {claim.resolution_notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <p className="text-gray-700">{claim.resolution_notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}


