// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


// Simple UI Components defined inline to avoid import issues
const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const spinnerSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
  return (
    <svg className={`animate-spin text-blue-500 ${spinnerSize}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
};

interface Store {
  id: string;
  name: string;
  description?: string;
  category: string;
  rating: number;
  image_url?: string;
  location?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const supabase = createClientComponentClient();

  const categories = [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'materials', label: 'مواد البناء' },
    { value: 'tools', label: 'أدوات ومعدات' },
    { value: 'electrical', label: 'كهربائيات' },
    { value: 'plumbing', label: 'سباكة' },
    { value: 'finishing', label: 'مواد التشطيب' },
    { value: 'decoration', label: 'ديكور' },
    { value: 'services', label: 'خدمات' },
  ];

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error && error.code === '42P01') {
        console.log('Stores table not found, using dummy data');
        setStores(getDummyStores());
      } else if (error) {
        console.error('Error fetching stores:', error);
        setStores(getDummyStores());
      } else {
        setStores(data || getDummyStores());
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      setStores(getDummyStores());
    } finally {
      setLoading(false);
    }
  };

  const getDummyStores = (): Store[] => [
    {
      id: '1',
      name: 'متجر البناء المتميز',
      description: 'متجر شامل لجميع مواد البناء والتشييد',
      category: 'materials',
      rating: 4.5,
      location: 'الرياض، المملكة العربية السعودية',
      phone: '+966 11 123 4567',
      email: 'info@building-store.sa',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    }
  ];

  const filteredStores = stores.filter(store => {
    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (store.description && store.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4 max-w-md sm:max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">المتاجر</h1>
          <p className="text-sm sm:text-base text-gray-600">اكتشف أفضل متاجر مواد البناء والخدمات</p>
        </div>

        {/* Filters */}
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                البحث
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن متجر..."
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                الفئة
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-xs sm:text-base text-gray-600">
            تم العثور على {filteredStores.length} متجر
            {selectedCategory !== 'all' && ` في فئة "${selectedCategory}"`}
          </p>
        </div>

        {/* Stores Grid */}
        {filteredStores.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">🏪</div>
            <h3 className="text-base sm:text-xl font-semibold text-gray-600 mb-1 sm:mb-2">لا توجد متاجر</h3>
            <p className="text-xs sm:text-base text-gray-500">لم يتم العثور على متاجر تطابق معايير البحث</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredStores.map((store) => (
              <Card key={store.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{store.name}</h3>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {store.category}
                    </span>
                  </div>
                </div>

                {store.description && (
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{store.description}</p>
                )}

                {/* Rating */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xs sm:text-sm ${star <= store.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-xs sm:text-sm text-gray-600 mr-1">({store.rating})</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
                  {store.location && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span>📍</span>
                      <span>{store.location}</span>
                    </div>
                  )}
                  {store.phone && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span>📞</span>
                      <span>{store.phone}</span>
                    </div>
                  )}
                  {store.email && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span>✉️</span>
                      <span>{store.email}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href={`/stores/${store.id}`}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm"
                  >
                    عرض التفاصيل
                  </Link>
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm">
                    طلب عرض أسعار
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


