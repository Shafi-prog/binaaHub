"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { Shield, Calendar, Package, AlertCircle, CheckCircle, Clock, Eye, MessageSquare, User, Phone, Mail } from 'lucide-react';
import { formatDateSafe, generateSafeId } from '../../../core/shared/utils/hydration-safe';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';

export const dynamic = 'force-dynamic'

interface StoreWarrantyClaim {
  id: string;
  warrantyId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  claimDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  issueType: string;
  issueDescription: string;
  quantityAffected: number;
  totalQuantity: number;
  quantityUsedPreviously: number;
  quantityRemaining: number;
  preferredResolution: string;
  storeResponse?: string;
  estimatedCompletion?: string;
  trackingNumber?: string;
  damagePhotos: string[];
  priority: 'low' | 'medium' | 'high';
}

export default function StoreWarrantyManagementPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<StoreWarrantyClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<StoreWarrantyClaim | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Mock data - in real app, this would come from API
    setClaims([
      {
        id: 'CLAIM-001',
        warrantyId: 'W001',
        productName: 'مصابيح LED عالية الكفاءة - عبوة 4 قطع',
        customerName: 'أحمد محمد الأحمد',
        customerEmail: 'ahmed@example.com',
        customerPhone: '+966501234567',
        claimDate: '2024-07-20',
        status: 'pending',
        issueType: 'manufacturing_defect',
        issueDescription: 'أحد المصابيح لا يضيء بشكل صحيح منذ الأسبوع الأول من الاستخدام',
        quantityAffected: 1,
        totalQuantity: 4,
        quantityUsedPreviously: 1,
        quantityRemaining: 2,
        preferredResolution: 'replacement',
        damagePhotos: ['/api/placeholder/200/200', '/api/placeholder/200/200'],
        priority: 'medium'
      },
      {
        id: 'CLAIM-002',
        warrantyId: 'W002',
        productName: 'مضخة المياه عالية الكفاءة',
        customerName: 'فاطمة علي السالم',
        customerEmail: 'fatima@example.com',
        customerPhone: '+966507654321',
        claimDate: '2024-07-18',
        status: 'in_progress',
        issueType: 'performance_issue',
        issueDescription: 'المضخة تعمل بصوت عالي وضغط أقل من المتوقع',
        quantityAffected: 1,
        totalQuantity: 1,
        quantityUsedPreviously: 1,
        quantityRemaining: 0,
        preferredResolution: 'repair',
        storeResponse: 'تم استلام المضخة للفحص، سيتم التواصل معك خلال 48 ساعة',
        estimatedCompletion: '2024-07-25',
        trackingNumber: 'TRK-2024-456',
        damagePhotos: [],
        priority: 'high'
      },
      {
        id: 'CLAIM-003',
        warrantyId: 'W003',
        productName: 'أدوات كهربائية متنوعة - طقم 6 قطع',
        customerName: 'سعد بن عبدالله',
        customerEmail: 'saad@example.com',
        customerPhone: '+966509876543',
        claimDate: '2024-07-15',
        status: 'completed',
        issueType: 'not_working',
        issueDescription: 'المثقاب والمنشار لا يعملان بعد شهر من الاستخدام',
        quantityAffected: 2,
        totalQuantity: 6,
        quantityUsedPreviously: 2,
        quantityRemaining: 4,
        preferredResolution: 'replacement',
        storeResponse: 'تم استبدال القطع التالفة بأخرى جديدة',
        trackingNumber: 'TRK-2024-123',
        damagePhotos: ['/api/placeholder/200/200'],
        priority: 'low'
      }
    ]);
  }, []);

  const filteredClaims = claims.filter(claim => {
    if (statusFilter === 'all') return true;
    return claim.status === statusFilter;
  });

  const handleStatusUpdate = (claimId: string, newStatus: string, response?: string) => {
    setClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? { 
            ...claim, 
            status: newStatus as any, 
            storeResponse: response || claim.storeResponse,
            trackingNumber: newStatus === 'in_progress' ? generateSafeId('TRK') : claim.trackingNumber
          }
        : claim
    ));
    
    alert(`تم تحديث حالة المطالبة ${claimId} إلى: ${getStatusText(newStatus)}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'in_progress': return <Package className="w-5 h-5 text-blue-600" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'approved': return 'مقبولة';
      case 'rejected': return 'مرفوضة';
      case 'in_progress': return 'قيد المعالجة';
      case 'completed': return 'مكتملة';
      default: return 'غير محدد';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return 'غير محدد';
    }
  };

  if (!isClient) {
    return (
      <div className="p-6 space-y-6" dir="rtl">
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          إدارة مطالبات الضمان
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          إدارة ومتابعة جميع مطالبات الضمان من العملاء
        </Typography>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600">
                {claims.length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">إجمالي المطالبات</Typography>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-yellow-600">
                {claims.filter(c => c.status === 'pending').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">في الانتظار</Typography>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600">
                {claims.filter(c => c.status === 'in_progress').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">قيد المعالجة</Typography>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600">
                {claims.filter(c => c.status === 'completed').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">مكتملة</Typography>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-red-600">
                {claims.filter(c => c.priority === 'high').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">أولوية عالية</Typography>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </EnhancedCard>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">جميع المطالبات</option>
          <option value="pending">في الانتظار</option>
          <option value="approved">مقبولة</option>
          <option value="in_progress">قيد المعالجة</option>
          <option value="completed">مكتملة</option>
          <option value="rejected">مرفوضة</option>
        </select>
      </div>

      {/* Claims List */}
      <div className="grid gap-6">
        {filteredClaims.map((claim) => (
          <EnhancedCard key={claim.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(claim.status)}
                  <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900">
                    {claim.productName}
                  </Typography>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                    {getStatusText(claim.status)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(claim.priority)}`}>
                    {getPriorityText(claim.priority)}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <Typography variant="subheading" size="lg" weight="semibold" className="text-blue-900 mb-2">
                    معلومات العميل
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <Typography variant="body" size="lg" weight="medium">{claim.customerName}</Typography>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <Typography variant="body" size="lg">{claim.customerEmail}</Typography>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <Typography variant="body" size="lg">{claim.customerPhone}</Typography>
                    </div>
                  </div>
                </div>

                {/* Quantity Tracking */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900 mb-3">
                    تتبع الكميات والاستخدام
                  </Typography>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600">
                        {claim.totalQuantity}
                      </Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">إجمالي المشتراة</Typography>
                    </div>
                    <div className="text-center">
                      <Typography variant="subheading" size="2xl" weight="bold" className="text-orange-600">
                        {claim.quantityAffected}
                      </Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">المطالبة الحالية</Typography>
                    </div>
                    <div className="text-center">
                      <Typography variant="subheading" size="2xl" weight="bold" className="text-red-600">
                        {claim.quantityUsedPreviously}
                      </Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">مستخدمة سابقاً</Typography>
                    </div>
                    <div className="text-center">
                      <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600">
                        {claim.quantityRemaining}
                      </Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">متبقية للضمان</Typography>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">رقم المطالبة</Typography>
                    <Typography variant="body" size="lg" weight="medium">{claim.id}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ المطالبة</Typography>
                    <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateSafe(claim.claimDate, { format: 'medium' })}
                    </Typography>
                  </div>
                </div>

                <div className="mb-4">
                  <Typography variant="caption" size="sm" className="text-gray-600 mb-1">وصف المشكلة</Typography>
                  <Typography variant="body" size="lg" className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                    {claim.issueDescription}
                  </Typography>
                </div>

                {claim.damagePhotos.length > 0 && (
                  <div className="mb-4">
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-2">صور المشكلة</Typography>
                    <div className="flex gap-2">
                      {claim.damagePhotos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`صورة ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 lg:w-64">
                {claim.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => {
                        const response = prompt('اكتب رد المتجر:');
                        if (response) {
                          handleStatusUpdate(claim.id, 'approved', response);
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      قبول المطالبة
                    </Button>
                    <Button
                      onClick={() => {
                        const response = prompt('اكتب سبب الرفض:');
                        if (response) {
                          handleStatusUpdate(claim.id, 'rejected', response);
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      رفض المطالبة
                    </Button>
                  </>
                )}
                
                {claim.status === 'approved' && (
                  <Button
                    onClick={() => {
                      const response = prompt('تحديث حالة المعالجة:');
                      if (response) {
                        handleStatusUpdate(claim.id, 'in_progress', response);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    بدء المعالجة
                  </Button>
                )}
                
                {claim.status === 'in_progress' && (
                  <Button
                    onClick={() => {
                      const response = prompt('تفاصيل إكمال المطالبة:');
                      if (response) {
                        handleStatusUpdate(claim.id, 'completed', response);
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    إكمال المطالبة
                  </Button>
                )}
                
                <Button
                  onClick={() => setSelectedClaim(claim)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  عرض التفاصيل
                </Button>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {/* Claim Details Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <EnhancedCard className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="heading" size="2xl" weight="bold" className="text-gray-900">
                  تفاصيل المطالبة - {selectedClaim.id}
                </Typography>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600">المنتج</Typography>
                    <Typography variant="body" size="lg" weight="medium">{selectedClaim.productName}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600">العميل</Typography>
                    <Typography variant="body" size="lg" weight="medium">{selectedClaim.customerName}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600">الهاتف</Typography>
                    <Typography variant="body" size="lg" weight="medium">{selectedClaim.customerPhone}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600">البريد الإلكتروني</Typography>
                    <Typography variant="body" size="lg" weight="medium">{selectedClaim.customerEmail}</Typography>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600">الحالة</Typography>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClaim.status)}`}>
                      {getStatusText(selectedClaim.status)}
                    </span>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600">الأولوية</Typography>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedClaim.priority)}`}>
                      {getPriorityText(selectedClaim.priority)}
                    </span>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600">الحل المفضل</Typography>
                    <Typography variant="body" size="lg" weight="medium">{selectedClaim.preferredResolution}</Typography>
                  </div>
                  
                  {selectedClaim.trackingNumber && (
                    <div>
                      <Typography variant="caption" size="sm" className="text-gray-600">رقم التتبع</Typography>
                      <Typography variant="body" size="lg" weight="medium">{selectedClaim.trackingNumber}</Typography>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <Typography variant="caption" size="sm" className="text-gray-600 mb-2">وصف المشكلة</Typography>
                <Typography variant="body" size="lg" className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                  {selectedClaim.issueDescription}
                </Typography>
              </div>

              {selectedClaim.storeResponse && (
                <div className="mt-6">
                  <Typography variant="caption" size="sm" className="text-gray-600 mb-2">رد المتجر</Typography>
                  <Typography variant="body" size="lg" className="text-blue-800 bg-blue-50 p-4 rounded-lg">
                    {selectedClaim.storeResponse}
                  </Typography>
                </div>
              )}
            </div>
          </EnhancedCard>
        </div>
      )}
    </div>
  );
}
