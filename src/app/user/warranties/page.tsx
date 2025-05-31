'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, LoadingSpinner, StatCard, StatusBadge } from '@/components/ui';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import {
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  FileText,
  Plus,
} from 'lucide-react';
import WarrantyDetailModal from '@/components/warranty/WarrantyDetailModal';
import WarrantyClaimForm from '@/components/warranty/WarrantyClaimForm';
import WarrantyTransferForm from '@/components/warranty/WarrantyTransferForm';
import WarrantyDocs from '@/components/warranty/WarrantyDocs';

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
  created_at: string;
  updated_at: string;
}

export default function WarrantiesPage() {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const initPage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verify auth with retry
        const authResult = await verifyAuthWithRetry(3);
        if (!mounted) return;

        if (authResult.error || !authResult.user) {
          console.error('❌ [Warranties] Authentication failed');
          router.push('/login');
          return;
        }

        console.log('✅ [Warranties] User authenticated:', authResult.user.email);

        // Load warranties with error retry
        let retryCount = 0;
        let warrantiesData = null;
        let warrantiesError = null;

        while (retryCount < 3 && !warrantiesData && mounted) {
          const { data, error } = await supabase
            .from('warranties')
            .select('*')
            .eq('user_id', authResult.user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error(`❌ [Warranties] Error loading data (attempt ${retryCount + 1}):`, error);
            warrantiesError = error;
            retryCount++;
            if (retryCount < 3)
              await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
          } else {
            warrantiesData = data;
            break;
          }
        }

        if (!mounted) return;

        if (warrantiesError) {
          throw warrantiesError;
        }

        console.log('✅ [Warranties] Data loaded:', warrantiesData?.length || 0, 'warranties');
        setWarranties(warrantiesData || []);
      } catch (error) {
        console.error('Error loading warranties:', error);
        if (mounted) {
          setError('حدث خطأ في تحميل البيانات. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login');
      }
    });

    initPage();

    return () => {
      mounted = false;
      authListener.data.subscription.unsubscribe();
    };
  }, [router, supabase]);

  // Add new warranty handler
  const handleAddWarranty = () => {
    router.push('/user/warranties/new');
  };

  // Add handlers for warranty actions
  const handleWarrantyAction = async (actionType: string, warranty: Warranty) => {
    setLoadingAction(true);
    setActionError(null);

    try {
      switch (actionType) {
        case 'claim':
          setSelectedWarranty(warranty);
          break;
        case 'transfer':
          if (!warranty.is_transferable) {
            throw new Error('This warranty is not transferable');
          }
          setSelectedWarranty(warranty);
          break;
        case 'docs':
          setSelectedWarranty(warranty);
          break;
        default:
          throw new Error('Invalid action type');
      }
    } catch (error) {
      console.error('Error performing warranty action:', error);
      setActionError(error instanceof Error ? error.message : 'Error performing action');
    } finally {
      setLoadingAction(false);
    }
  };

  const filteredWarranties = warranties.filter((warranty) => {
    const matchesSearch =
      warranty.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.warranty_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || warranty.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const warrantyStats = {
    total: warranties.length,
    active: warranties.filter((w) => w.status === 'active').length,
    expired: warranties.filter((w) => w.status === 'expired').length,
    expiringSoon: warranties.filter((w) => {
      if (w.status !== 'active') return false;
      const daysUntilExpiry = Math.ceil(
        (new Date(w.warranty_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 30;
    }).length,
  };

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

  return (
    <main className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify بين">
        <h1 className="text-3xl font-bold text-gray-900">إدارة الضمانات</h1>
        <button
          onClick={handleAddWarranty}
          disabled={loadingAction}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400"
        >
          <Plus className="w-5 h-5" />
          إضافة ضمان
        </button>
      </div>
      {/* Show action error if exists */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{actionError}</p>
        </div>
      )}
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الضمانات"
          value={warrantyStats.total.toString()}
          icon={<Shield className="w-8 h-8 text-blue-600" />}
          subtitle="جميع الضمانات المسجلة"
        />
        <StatCard
          title="الضمانات الفعالة"
          value={warrantyStats.active.toString()}
          icon={<CheckCircle className="w-8 h-8 text-green-600" />}
          subtitle="ضمانات سارية المفعول"
        />
        <StatCard
          title="منتهية الصلاحية"
          value={warrantyStats.expired.toString()}
          icon={<Clock className="w-8 h-8 text-red-600" />}
          subtitle="ضمانات انتهت صلاحيتها"
        />
        <StatCard
          title="تنتهي قريباً"
          value={warrantyStats.expiringSoon.toString()}
          icon={<AlertTriangle className="w-8 h-8 text-orange-600" />}
          subtitle="تنتهي خلال 30 يوم"
        />
      </div>
      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الضمانات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">فعال</option>
              <option value="expired">منتهي الصلاحية</option>
              <option value="claimed">تم المطالبة</option>
            </select>
          </div>
        </div>
      </Card>
      {/* Warranties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWarranties.map((warranty) => (
          <Card
            key={warranty.id}
            className={`p-6 hover:shadow-lg transition-shadow ${loadingAction ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="flex items-start justify بين mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {warranty.product_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {warranty.brand} • {warranty.model}
                </p>
                <p className="text-xs text-gray-500 mt-1">رقم الضمان: {warranty.warranty_number}</p>
              </div>
              <StatusBadge
                status={warranty.status}
                label={getWarrantyStatusText(warranty.status)}
                color={getWarrantyStatusColor(warranty.status)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify بين">
                <span className="text-sm text-gray-600">تاريخ الشراء:</span>
                <span className="text-sm font-medium">
                  {new Date(warranty.purchase_date).toLocaleDateString('ar-SA')}
                </span>
              </div>

              <div className="flex items-center justify بين">
                <span className="text-sm text-gray-600">انتهاء الضمان:</span>
                <span className="text-sm font-medium">
                  {new Date(warranty.warranty_end_date).toLocaleDateString('ar-SA')}
                </span>
              </div>

              {warranty.status === 'active' && (
                <div className="flex items-center justify بين">
                  <span className="text-sm text-gray-600">أيام متبقية:</span>
                  <span
                    className={`text-sm font-medium ${getDaysUntilExpiry(warranty.warranty_end_date) <= 30 ? 'text-orange-600' : 'text-green-600'}`}
                  >
                    {getDaysUntilExpiry(warranty.warranty_end_date)} يوم
                  </span>
                </div>
              )}

              <div className="flex items-center justify بين">
                <span className="text-sm text-gray-600">نوع الضمان:</span>
                <span className="text-sm font-medium">
                  {warranty.warranty_type === 'manufacturer'
                    ? 'ضمان الشركة المصنعة'
                    : warranty.warranty_type === 'extended'
                      ? 'ضمان ممتد'
                      : warranty.warranty_type === 'store'
                        ? 'ضمان المتجر'
                        : 'ضمان مخصص'}
                </span>
              </div>

              {warranty.vendor_name && (
                <div className="flex items-center justify بين">
                  <span className="text-sm text-gray-600">المورد:</span>
                  <span className="text-sm font-medium">{warranty.vendor_name}</span>
                </div>
              )}

              {warranty.claim_count > 0 && (
                <div className="flex items-center justify بين">
                  <span className="text-sm text-gray-600">المطالبات:</span>
                  <span className="text-sm font-medium text-blue-600">
                    {warranty.claim_count} مطالبة
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={() => handleWarrantyAction('view', warranty)}
                disabled={loadingAction}
                className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400"
              >
                عرض التفاصيل
              </button>
              {warranty.status === 'active' && (
                <button
                  onClick={() => handleWarrantyAction('claim', warranty)}
                  disabled={loadingAction}
                  className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400"
                >
                  تقديم مطالبة
                </button>
              )}
              <button
                onClick={() => handleWarrantyAction('docs', warranty)}
                disabled={loadingAction}
                className="bg-gray-50 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 disabled:bg-gray-200"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
      {filteredWarranties.length === 0 && !loading && !error && (
        <Card className="p-8 text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد ضمانات</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all'
              ? 'لم يتم العثور على ضمانات تطابق البحث المحدد'
              : 'لم تقم بإضافة أي ضمانات بعد. انقر على زر "إضافة ضمان" لإضافة ضمان جديد.'}
          </p>
        </Card>
      )}
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <LoadingSpinner />
        </div>
      )}
      {/* Error state */}
      {error && (
        <Card className="p-6 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            إعادة تحميل الصفحة
          </button>
        </Card>
      )}{' '}
      {/* Warranty Detail Modal */}
      {selectedWarranty && (
        <WarrantyDetailModal
          warranty={selectedWarranty}
          isOpen={!!selectedWarranty}
          onClose={() => setSelectedWarranty(null)}
        />
      )}
    </main>
  );
}
