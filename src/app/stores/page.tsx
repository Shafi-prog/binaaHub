<<<<<<< HEAD
"use client";
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

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
      
      // Try to fetch from stores table, if it doesn't exist, create dummy data
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error && error.code === '42P01') {
        // Table doesn't exist, create dummy data
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
    },
    {
      id: '2',
      name: 'مؤسسة الأدوات الحديثة',
      description: 'أدوات ومعدات البناء المتقدمة',
      category: 'tools',
      rating: 4.3,
      location: 'جدة، المملكة العربية السعودية',
      phone: '+966 12 123 4567',
      email: 'sales@modern-tools.sa',
      is_active: true,
      created_at: '2024-01-02T00:00:00Z'
    },
    {
      id: '3',
      name: 'شركة الكهرباء المتطورة',
      description: 'حلول كهربائية متكاملة للمباني',
      category: 'electrical',
      rating: 4.7,
      location: 'الدمام، المملكة العربية السعودية',
      phone: '+966 13 123 4567',
      email: 'contact@advanced-electric.sa',
      is_active: true,
      created_at: '2024-01-03T00:00:00Z'
    },
    {
      id: '4',
      name: 'معرض السباكة الحديثة',
      description: 'أنظمة سباكة وتكييف متقدمة',
      category: 'plumbing',
      rating: 4.2,
      location: 'مكة المكرمة، المملكة العربية السعودية',
      phone: '+966 12 234 5678',
      email: 'info@modern-plumbing.sa',
      is_active: true,
      created_at: '2024-01-04T00:00:00Z'
    },
    {
      id: '5',
      name: 'مركز مواد التشطيب الفاخرة',
      description: 'أفضل مواد التشطيب والديكور',
      category: 'finishing',
      rating: 4.8,
      location: 'الرياض، المملكة العربية السعودية',
      phone: '+966 11 345 6789',
      email: 'luxury@finishing-center.sa',
      is_active: true,
      created_at: '2024-01-05T00:00:00Z'
    }
  ];

  const filteredStores = stores.filter(store => {
    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (store.description && store.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || category;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
        <span className="text-sm text-gray-600 mr-1">({rating})</span>
      </div>
    );
  };

  if (loading) {
=======
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Card, LoadingSpinner, EmptyState } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { Search, MapPin, Star, Filter, Grid, List } from 'lucide-react';

interface Store {
  id: string;
  user_id: string;
  store_name: string;
  description: string | null;
  category: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  website: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_active: boolean;
  delivery_areas: string[] | null;
  working_hours: any | null;
  payment_methods: string[] | null;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
}

type ViewMode = 'grid' | 'list';

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 [Stores] Fetching active stores...');
        console.log('🔗 [Stores] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('🔑 [Stores] Has Anon Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

        // Test basic connection first
        let connectionTestResult;
        try {
          connectionTestResult = await supabase.from('stores').select('count').limit(1);
        } catch (connErr) {
          console.error('❌ [Stores] Connection test exception:', connErr);
          throw new Error('Database connection failed');
        }

        if (connectionTestResult.error) {
          console.error('❌ [Stores] Connection test failed:');
          console.error('Error message:', connectionTestResult.error.message || 'Unknown error');
          console.error('Error code:', connectionTestResult.error.code || 'No code');
          console.error('Error hint:', connectionTestResult.error.hint || 'No hint');
        } else {
          console.log('✅ [Stores] Connection test successful');
        }

        // Fetch active stores
        let storesResult;
        try {
          storesResult = await supabase
            .from('stores')
            .select('*')
            .eq('is_active', true)
            .order('rating', { ascending: false });
        } catch (queryErr) {
          console.error('❌ [Stores] Query exception:', queryErr);
          throw new Error('Store query failed');
        }

        const { data: storesData, error: storesError } = storesResult;
        if (storesError) {
          console.error('❌ [Stores] Supabase error details:');
          console.error('Error message:', storesError.message || 'Unknown error');
          console.error('Error code:', storesError.code || 'No code');
          console.error('Error hint:', storesError.hint || 'No hint');
          console.error('Error details:', storesError.details || 'No details');

          // Show user-friendly error message
          setError(
            `Database setup required. Error: ${storesError.message}. Using demo data for now.`
          );

          // If there's a database error, use mock data for development
          console.log('🔄 [Stores] Using mock data due to database error');
          const mockStores: Store[] = [
            {
              id: '1',
              user_id: 'user1',
              store_name: 'متجر البناء المحترف',
              description: 'متجر متخصص في مواد البناء والتشييد عالية الجودة',
              category: 'مواد البناء',
              phone: '+966501234567',
              email: 'info@building-pro.com',
              address: 'حي الملك فهد، الرياض',
              city: 'الرياض',
              region: 'الرياض',
              website: 'https://building-pro.com',
              logo_url: null,
              cover_image_url: null,
              rating: 4.8,
              total_reviews: 127,
              is_verified: true,
              is_active: true,
              delivery_areas: ['الرياض', 'جدة', 'الدمام'],
              working_hours: {
                saturday: '8:00-22:00',
                sunday: '8:00-22:00',
                monday: '8:00-22:00',
                tuesday: '8:00-22:00',
                wednesday: '8:00-22:00',
                thursday: '8:00-22:00',
                friday: '14:00-22:00',
              },
              payment_methods: ['cash', 'card', 'transfer'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: '2',
              user_id: 'user2',
              store_name: 'سوق الأدوات الكهربائية',
              description: 'تشكيلة واسعة من الأدوات الكهربائية والمعدات',
              category: 'أدوات كهربائية',
              phone: '+966507654321',
              email: 'contact@electrical-tools.com',
              address: 'حي العليا، جدة',
              city: 'جدة',
              region: 'مكة المكرمة',
              website: null,
              logo_url: null,
              cover_image_url: null,
              rating: 4.5,
              total_reviews: 89,
              is_verified: true,
              is_active: true,
              delivery_areas: ['جدة', 'مكة', 'الطائف'],
              working_hours: {
                saturday: '9:00-21:00',
                sunday: '9:00-21:00',
                monday: '9:00-21:00',
                tuesday: '9:00-21:00',
                wednesday: '9:00-21:00',
                thursday: '9:00-21:00',
                friday: '15:00-21:00',
              },
              payment_methods: ['cash', 'card'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: '3',
              user_id: 'user3',
              store_name: 'معرض الإضاءة الحديثة',
              description: 'حلول إضاءة عصرية للمنازل والمكاتب',
              category: 'إضاءة',
              phone: '+966555111222',
              email: 'sales@modern-lighting.sa',
              address: 'شارع التحلية، الخبر',
              city: 'الخبر',
              region: 'الشرقية',
              website: 'https://modern-lighting.sa',
              logo_url: null,
              cover_image_url: null,
              rating: 4.2,
              total_reviews: 45,
              is_verified: false,
              is_active: true,
              delivery_areas: ['الخبر', 'الدمام', 'القطيف'],
              working_hours: {
                saturday: '10:00-20:00',
                sunday: '10:00-20:00',
                monday: '10:00-20:00',
                tuesday: '10:00-20:00',
                wednesday: '10:00-20:00',
                thursday: '10:00-20:00',
                friday: '16:00-20:00',
              },
              payment_methods: ['cash', 'card', 'transfer'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ];

          setStores(mockStores);
          console.log('✅ [Stores] Loaded mock stores:', mockStores.length);
          return;
        }

        setStores((storesData as unknown as Store[]) || []);
        console.log('✅ [Stores] Loaded stores:', storesData?.length || 0);
      } catch (error) {
        console.error('❌ [Stores] Error loading stores:');
        console.error('Error type:', typeof error);
        console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.error('Full error:', error);
        setError('حدث خطأ في تحميل المتاجر');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [isHydrated, supabase]);

  // Filter stores based on search and filters
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
    const matchesCity = selectedCity === 'all' || store.city === selectedCity;

    return matchesSearch && matchesCategory && matchesCity;
  });

  // Get unique categories and cities for filters
  const categories = Array.from(new Set(stores.map((s) => s.category).filter(Boolean)));
  const cities = Array.from(new Set(stores.map((s) => s.city).filter(Boolean)));

  if (!isHydrated || loading) {
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">المتاجر</h1>
          <p className="text-gray-600">اكتشف أفضل متاجر مواد البناء والخدمات</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                البحث
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن متجر..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
=======
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">تصفح المتاجر</h1>
          <p className="text-gray-600">اكتشف المتاجر المتخصصة في مواد البناء والإنشاءات</p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في المتاجر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
              />
            </div>

            {/* Category Filter */}
            <div>
<<<<<<< HEAD
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                الفئة
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
=======
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {' '}
                <option value="all">جميع الفئات</option>
                {categories.map((category) => (
                  <option key={category} value={category || ''}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {' '}
                <option value="all">جميع المدن</option>
                {cities.map((city) => (
                  <option key={city} value={city || ''}>
                    {city}
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
                  </option>
                ))}
              </select>
            </div>
          </div>
<<<<<<< HEAD
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            تم العثور على {filteredStores.length} متجر
            {selectedCategory !== 'all' && ` في فئة "${getCategoryLabel(selectedCategory)}"`}
          </p>
        </div>

        {/* Stores Grid */}
        {filteredStores.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد متاجر</h3>
            <p className="text-gray-500">لم يتم العثور على متاجر تطابق معايير البحث</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <Card key={store.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{store.name}</h3>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {getCategoryLabel(store.category)}
                    </span>
                  </div>
                </div>

                {store.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{store.description}</p>
                )}

                {/* Rating */}
                <div className="mb-4">
                  {renderStars(store.rating)}
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  {store.location && (
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{store.location}</span>
                    </div>
                  )}
                  {store.phone && (
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <span>{store.phone}</span>
                    </div>
                  )}
                  {store.email && (
                    <div className="flex items-center gap-2">
                      <span>✉️</span>
                      <span>{store.email}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/stores/${store.id}`}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    عرض التفاصيل
                  </Link>
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                    طلب عرض أسعار
                  </button>
                </div>
              </Card>
=======

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              عرض {filteredStores.length} من {stores.length} متجر
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>

        {/* Stores Grid/List */}
        {filteredStores.length === 0 ? (
          <EmptyState
            title="لا توجد متاجر"
            description="لم يتم العثور على متاجر تطابق معايير البحث الخاصة بك"
          />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} viewMode={viewMode} />
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

// Store Card Component
function StoreCard({ store, viewMode }: { store: Store; viewMode: ViewMode }) {
  const isGridView = viewMode === 'grid';

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isGridView ? 'p-6' : 'p-4'}`}>
      <Link href={`/stores/${store.id}`}>
        <div className={isGridView ? 'space-y-4' : 'flex gap-4'}>
          {/* Store Logo/Cover */}
          <div className={isGridView ? 'w-full h-48' : 'w-24 h-24 flex-shrink-0'}>
            {store.cover_image_url || store.logo_url ? (
              <img
                src={store.cover_image_url || store.logo_url || ''}
                alt={store.store_name}
                className={`w-full h-full object-cover rounded-lg ${
                  !isGridView ? 'rounded-lg' : ''
                }`}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center`}
              >
                <span className="text-white font-bold text-2xl">{store.store_name.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Store Info */}
          <div className={isGridView ? 'space-y-3' : 'flex-1 space-y-2'}>
            <div className="flex items-start justify-between">
              <div>
                <h3
                  className={`font-bold text-gray-800 hover:text-blue-600 transition-colors ${
                    isGridView ? 'text-xl' : 'text-lg'
                  }`}
                >
                  {store.store_name}
                  {store.is_verified && (
                    <span className="inline-block mr-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      موثق
                    </span>
                  )}
                </h3>
                {store.category && <p className="text-sm text-gray-500 mt-1">{store.category}</p>}
              </div>
            </div>

            {store.description && (
              <p className={`text-gray-600 ${isGridView ? 'line-clamp-3' : 'line-clamp-2'}`}>
                {store.description}
              </p>
            )}

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700 mr-1">
                  {store.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-gray-500">({store.total_reviews} تقييم)</span>
            </div>

            {/* Location */}
            {store.city && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{store.city}</span>
                {store.region && <span className="text-sm text-gray-500">، {store.region}</span>}
              </div>
            )}

            {/* Payment Methods */}
            {store.payment_methods && store.payment_methods.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {store.payment_methods.slice(0, 3).map((method, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {method}
                  </span>
                ))}
                {store.payment_methods.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{store.payment_methods.length - 3} المزيد
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
