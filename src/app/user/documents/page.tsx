"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { FileText, Upload, Search, Filter, FolderOpen, Download, Eye, Edit, Trash2, Tag, Calendar, Shield, Receipt, ArrowRight } from 'lucide-react';
import { formatDateSafe, useIsClient } from '../../../core/shared/utils/hydration-safe';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export const dynamic = 'force-dynamic'

interface Document {
  id: string;
  name: string;
  type: 'warranty' | 'contract' | 'receipt' | 'certificate' | 'manual' | 'other';
  category: string;
  project?: string;
  uploadDate: string;
  size: string;
  tags: string[];
  description?: string;
  linkedToWarranty?: boolean;
  linkedToInvoice?: boolean;
}

export default function UserDocumentsPage() {
  const { user, session, isLoading, error } = useAuth();
  const isClient = useIsClient();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    // Mock data - in real app, this would come from an API
    setDocuments([
      {
        id: 'DOC001',
        name: 'ضمان مضخة المياه',
        type: 'warranty',
        category: 'ضمانات',
        project: 'مشروع الفيلا الجديدة',
        uploadDate: '2024-01-15',
        size: '2.3 MB',
        tags: ['ضمان', 'مضخة', 'مياه'],
        description: 'شهادة ضمان مضخة المياه عالية الكفاءة',
        linkedToWarranty: true
      },
      {
        id: 'DOC002',
        name: 'عقد المقاول الرئيسي',
        type: 'contract',
        category: 'عقود',
        project: 'مشروع الفيلا الجديدة',
        uploadDate: '2024-01-10',
        size: '5.1 MB',
        tags: ['عقد', 'مقاول', 'بناء'],
        description: 'عقد المقاول الرئيسي لمشروع الفيلا'
      },
      {
        id: 'DOC003',
        name: 'دليل صيانة المكيف',
        type: 'manual',
        category: 'أدلة التشغيل',
        uploadDate: '2024-03-10',
        size: '8.7 MB',
        tags: ['دليل', 'صيانة', 'مكيف'],
        description: 'دليل التشغيل والصيانة لمكيف الهواء',
        linkedToWarranty: true
      },
      {
        id: 'DOC004',
        name: 'شهادة جودة الأسمنت',
        type: 'certificate',
        category: 'شهادات',
        project: 'مشروع الفيلا الجديدة',
        uploadDate: '2024-02-05',
        size: '1.2 MB',
        tags: ['شهادة', 'جودة', 'أسمنت'],
        description: 'شهادة جودة ومطابقة الأسمنت للمواصفات'
      }
    ]);
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'warranty': return <Shield className="w-5 h-5 text-green-600" />;
      case 'contract': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'receipt': return <Receipt className="w-5 h-5 text-orange-600" />;
      case 'certificate': return <FolderOpen className="w-5 h-5 text-purple-600" />;
      case 'manual': return <FileText className="w-5 h-5 text-indigo-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeText = (type: string) => {
    switch(type) {
      case 'warranty': return 'ضمان';
      case 'contract': return 'عقد';
      case 'receipt': return 'إيصال';
      case 'certificate': return 'شهادة';
      case 'manual': return 'دليل';
      default: return 'مستند';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'warranty': return 'bg-green-100 text-green-800';
      case 'contract': return 'bg-blue-100 text-blue-800';
      case 'receipt': return 'bg-orange-100 text-orange-800';
      case 'certificate': return 'bg-purple-100 text-purple-800';
      case 'manual': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isClient) {
    
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

return (
      <div className="container mx-auto px-4 py-8 max-w-6xl" dir="rtl">
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
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          إدارة المستندات
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          رفع وتنظيم جميع مستندات مشاريعك من عقود وضمانات وشهادات
        </Typography>
      </div>

      {/* Info Card - Document Purpose */}
      <EnhancedCard className="p-6 mb-8 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <FolderOpen className="w-8 h-8 text-blue-600 mt-1" />
          <div>
            <Typography variant="subheading" size="lg" weight="semibold" className="text-blue-900 mb-2">
              الفرق بين المستندات والفواتير
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="body" size="md" weight="medium" className="text-blue-800 mb-1">
                  📁 المستندات - هنا
                </Typography>
                <Typography variant="caption" size="sm" className="text-blue-700">
                  العقود، الضمانات، أدلة التشغيل، الشهادات، التراخيص، والوثائق الرسمية
                </Typography>
              </div>
              <div>
                <Typography variant="body" size="md" weight="medium" className="text-blue-800 mb-1">
                  🧾 الفواتير - في قسم منفصل
                </Typography>
                <Typography variant="caption" size="sm" className="text-blue-700">
                  فواتير الشراء، إيصالات الدفع، والمستندات المالية في <Link href="/user/invoices" className="underline">قسم الفواتير</Link>
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </EnhancedCard>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600">
                {documents.length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">إجمالي المستندات</Typography>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600">
                {documents.filter(d => d.linkedToWarranty).length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">مرتبطة بضمانات</Typography>
            </div>
            <Shield className="w-8 h-8 text-green-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-purple-600">
                {documents.filter(d => d.type === 'contract').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">عقود</Typography>
            </div>
            <FolderOpen className="w-8 h-8 text-purple-600" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="subheading" size="2xl" weight="bold" className="text-orange-600">
                {documents.filter(d => d.type === 'certificate').length}
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-600">شهادات</Typography>
            </div>
            <Receipt className="w-8 h-8 text-orange-600" />
          </div>
        </EnhancedCard>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث في المستندات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">جميع الأنواع</option>
          <option value="warranty">ضمانات</option>
          <option value="contract">عقود</option>
          <option value="certificate">شهادات</option>
          <option value="manual">أدلة التشغيل</option>
          <option value="receipt">إيصالات</option>
          <option value="other">أخرى</option>
        </select>

        <Link href="/user/ai-hub">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2" onClick={() => alert('Button clicked')}>
            <Upload className="w-5 h-5" />
            استخراج بيانات بالذكاء الاصطناعي
          </Button>
        </Link>

        <Button
          onClick={() => setShowUpload(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          رفع مستند
        </Button>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-6">
        {filteredDocuments.map((document) => (
          <EnhancedCard key={document.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getTypeIcon(document.type)}
                  <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900">
                    {document.name}
                  </Typography>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(document.type)}`}>
                    {getTypeText(document.type)}
                  </span>
                  {document.linkedToWarranty && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      مرتبط بضمان
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">الفئة</Typography>
                    <Typography variant="body" size="lg" weight="medium">{document.category}</Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ الرفع</Typography>
                    <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateSafe(document.uploadDate, { format: 'medium' })}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">حجم الملف</Typography>
                    <Typography variant="body" size="lg" weight="medium">{document.size}</Typography>
                  </div>
                </div>

                {document.description && (
                  <div className="mb-4">
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">الوصف</Typography>
                    <Typography variant="body" size="md" className="text-gray-700">{document.description}</Typography>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2"
                 onClick={() => alert('Button clicked')}>
                  <Eye className="w-4 h-4" />
                  عرض
                </Button>
                
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2"
                 onClick={() => alert('Button clicked')}>
                  <Download className="w-4 h-4" />
                  تحميل
                </Button>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
            لا توجد مستندات
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-500">
            {searchTerm || typeFilter !== 'all' ? 'لم يتم العثور على مستندات تطابق البحث' : 'لم تقم برفع أي مستندات بعد'}
          </Typography>
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/user/help-center/articles/documents">
          <EnhancedCard className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <ArrowRight className="w-6 h-6 text-blue-600" />
              <Typography variant="body" size="md" weight="medium">دليل إدارة المستندات</Typography>
            </div>
          </EnhancedCard>
        </Link>
        
        <Link href="/user/warranties">
          <EnhancedCard className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-600" />
              <Typography variant="body" size="md" weight="medium">إدارة الضمانات</Typography>
            </div>
          </EnhancedCard>
        </Link>
        
        <Link href="/user/invoices">
          <EnhancedCard className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Receipt className="w-6 h-6 text-orange-600" />
              <Typography variant="body" size="md" weight="medium">إدارة الفواتير</Typography>
            </div>
          </EnhancedCard>
        </Link>
      </div>
    </div>
  );
}
