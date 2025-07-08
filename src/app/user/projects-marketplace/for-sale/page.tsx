// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MapPin, Calendar, DollarSign, Home, Phone, Star } from 'lucide-react';
import Link from 'next/link';

interface ProjectForSale {
  id: string;
  name: string;
  description?: string;
  project_type: string;
  address?: string;
  city?: string;
  region?: string;
  advertisement_number: string;
  sale_price?: number;
  sale_description?: string;
  expected_completion_date?: string;
  progress_percentage?: number;
  budget?: number;
  created_at: string;
  updated_at: string;
}

export default function ProjectsForSalePage() {
  const [projects, setProjects] = useState<ProjectForSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [projectType, setProjectType] = useState<string>('all');

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadProjectsForSale();
  }, []);

  const loadProjectsForSale = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          id, name, description, project_type, address, city, region,
          advertisement_number, sale_price, sale_description,
          expected_completion_date, progress_percentage, budget,
          created_at, updated_at
        `)
        .eq('status', 'completed')
        .eq('for_sale', true)
        .not('advertisement_number', 'is', null)
        .order('updated_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setProjects(data || []);
    } catch (err: any) {
      console.error('Error loading projects for sale:', err);
      setError('حدث خطأ في تحميل المشاريع المعروضة للبيع');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriceRange = priceRange === 'all' || (() => {
      if (!project.sale_price) return false;
      switch (priceRange) {
        case 'under-500k': return project.sale_price < 500000;
        case '500k-1m': return project.sale_price >= 500000 && project.sale_price < 1000000;
        case '1m-2m': return project.sale_price >= 1000000 && project.sale_price < 2000000;
        case 'over-2m': return project.sale_price >= 2000000;
        default: return true;
      }
    })();

    const matchesType = projectType === 'all' || project.project_type === projectType;

    return matchesSearch && matchesPriceRange && matchesType;
  });

  const formatPrice = (price?: number) => {
    if (!price) return 'السعر غير محدد';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getProjectTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      residential: 'سكني',
      commercial: 'تجاري',
      industrial: 'صناعي',
      infrastructure: 'بنية تحتية',
      renovation: 'ترميم',
      other: 'أخرى',
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">المشاريع المعروضة للبيع</h1>
          <p className="text-xl text-gray-600">اكتشف مشاريع البناء المكتملة والمتاحة للشراء</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن مشروع..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع المشروع</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الأنواع</option>
                <option value="residential">سكني</option>
                <option value="commercial">تجاري</option>
                <option value="industrial">صناعي</option>
                <option value="infrastructure">بنية تحتية</option>
                <option value="renovation">ترميم</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نطاق السعر</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الأسعار</option>
                <option value="under-500k">أقل من 500,000 ر.س</option>
                <option value="500k-1m">500,000 - 1,000,000 ر.س</option>
                <option value="1m-2m">1,000,000 - 2,000,000 ر.س</option>
                <option value="over-2m">أكثر من 2,000,000 ر.س</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadProjectsForSale}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                تحديث
              </button>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProjects.length} مشروع متاح للبيع
          </p>
        </div>

        {/* Projects Grid */}
        {error ? (
          <Card className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadProjectsForSale}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </Card>
        ) : filteredProjects.length === 0 ? (
          <Card className="p-8 text-center">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد مشاريع متاحة</h3>
            <p className="text-gray-500">لا توجد مشاريع معروضة للبيع حالياً تطابق معايير البحث</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Advertisement Number Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      إعلان رقم: {project.advertisement_number}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {getProjectTypeLabel(project.project_type)}
                    </span>
                  </div>

                  {/* Project Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>

                  {/* Location */}
                  {(project.city || project.address) && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {[project.address, project.city, project.region].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {project.sale_description && (
                    <p className="text-gray-700 mb-4 line-clamp-3">{project.sale_description}</p>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-green-600">
                      <DollarSign className="w-5 h-5 mr-2" />
                      <span className="text-lg font-bold">{formatPrice(project.sale_price)}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  {project.progress_percentage && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>نسبة الإنجاز</span>
                        <span>{project.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${project.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Completion Date */}
                  {project.expected_completion_date && (
                    <div className="flex items-center text-gray-600 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        تاريخ الإنجاز: {new Date(project.expected_completion_date).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4 border-t">
                    <Link
                      href={`/projects/for-sale/${project.id}`}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



