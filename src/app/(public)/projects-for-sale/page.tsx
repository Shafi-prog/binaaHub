"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Simple UI Components
const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/30 ${className}`} 
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

interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  status: string;
  images: string[];
  features: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  created_at: string;
}

export default function ProjectsForSalePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const projectTypes = [
    { value: 'all', label: 'جميع المشاريع' },
    { value: 'villa', label: 'فيلا' },
    { value: 'apartment', label: 'شقة' },
    { value: 'land', label: 'أرض' },
    { value: 'commercial', label: 'تجاري' },
    { value: 'duplex', label: 'دوبلكس' },
  ];

  const cities = [
    { value: 'all', label: 'جميع المدن' },
    { value: 'riyadh', label: 'الرياض' },
    { value: 'jeddah', label: 'جدة' },
    { value: 'dammam', label: 'الدمام' },
    { value: 'khobar', label: 'الخبر' },
    { value: 'mecca', label: 'مكة المكرمة' },
    { value: 'medina', label: 'المدينة المنورة' },
    { value: 'taif', label: 'الطائف' },
  ];

  const priceRanges = [
    { value: 'all', label: 'جميع الأسعار' },
    { value: '0-500000', label: 'أقل من 500,000 ر.س' },
    { value: '500000-1000000', label: '500,000 - 1,000,000 ر.س' },
    { value: '1000000-2000000', label: '1,000,000 - 2,000,000 ر.س' },
    { value: '2000000+', label: 'أكثر من 2,000,000 ر.س' },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Use dummy data for now
      setProjects(getDummyProjects());
      
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects(getDummyProjects());
    } finally {
      setLoading(false);
    }
  };

  const getDummyProjects = (): Project[] => [
    {
      id: '1',
      title: 'فيلا عصرية في الرياض',
      description: 'فيلا حديثة في موقع متميز بحي الملقا، تصميم عصري مع حديقة واسعة ومرافق متكاملة',
      price: 1850000,
      location: 'الرياض - حي الملقا',
      area: 450,
      bedrooms: 5,
      bathrooms: 4,
      type: 'villa',
      status: 'available',
      images: ['/projects/villa1.jpg', '/projects/villa1-2.jpg'],
      features: ['حديقة خاصة', 'مكتب منزلي', 'غرفة خادمة', 'مطبخ مجهز', 'موقف سيارتين'],
      contact: {
        name: 'أحمد المطيري',
        phone: '+966 50 123 4567',
        email: 'ahmad@example.com'
      },
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'شقة فاخرة في جدة',
      description: 'شقة راقية في برج سكني حديث مع إطلالة على البحر الأحمر وجميع الخدمات',
      price: 750000,
      location: 'جدة - كورنيش البحر الأحمر',
      area: 180,
      bedrooms: 3,
      bathrooms: 2,
      type: 'apartment',
      status: 'available',
      images: ['/projects/apartment1.jpg'],
      features: ['إطلالة بحرية', 'نادي صحي', 'موقف مظلل', 'أمن 24 ساعة', 'مسبح مشترك'],
      contact: {
        name: 'فاطمة السالم',
        phone: '+966 55 987 6543',
        email: 'fatima@example.com'
      },
      created_at: '2024-01-20T00:00:00Z'
    },
    {
      id: '3',
      title: 'أرض تجارية في الدمام',
      description: 'أرض في موقع استراتيجي على طريق رئيسي، مناسبة للاستثمار التجاري',
      price: 2200000,
      location: 'الدمام - طريق الملك فهد',
      area: 800,
      bedrooms: 0,
      bathrooms: 0,
      type: 'land',
      status: 'available',
      images: ['/projects/land1.jpg'],
      features: ['موقع تجاري', 'على طريق رئيسي', 'قريب من المراكز التجارية', 'صك إلكتروني'],
      contact: {
        name: 'عبدالله الخالد',
        phone: '+966 53 456 7890',
        email: 'abdullah@example.com'
      },
      created_at: '2024-01-25T00:00:00Z'
    },
    {
      id: '4',
      title: 'دوبلكس مميز في الخبر',
      description: 'دوبلكس واسع في مجمع سكني راقي مع جميع الخدمات والمرافق الترفيهية',
      price: 1350000,
      location: 'الخبر - الحزم',
      area: 320,
      bedrooms: 4,
      bathrooms: 3,
      type: 'duplex',
      status: 'available',
      images: ['/projects/duplex1.jpg'],
      features: ['تراس واسع', 'مطبخ مفتوح', 'غرفة معيشة مزدوجة', 'موقف مظلل', 'حديقة صغيرة'],
      contact: {
        name: 'سارة القحطاني',
        phone: '+966 56 321 0987',
        email: 'sara@example.com'
      },
      created_at: '2024-02-01T00:00:00Z'
    },
    {
      id: '5',
      title: 'محل تجاري في مكة',
      description: 'محل في موقع حيوي قريب من الحرم المكي، مناسب للأنشطة التجارية المختلفة',
      price: 950000,
      location: 'مكة المكرمة - العزيزية',
      area: 120,
      bedrooms: 0,
      bathrooms: 1,
      type: 'commercial',
      status: 'available',
      images: ['/projects/shop1.jpg'],
      features: ['موقع حيوي', 'قريب من الحرم', 'واجهة زجاجية', 'مكيف مركزي', 'موقف عام'],
      contact: {
        name: 'محمد الحربي',
        phone: '+966 54 555 1234',
        email: 'mohammed@example.com'
      },
      created_at: '2024-02-05T00:00:00Z'
    },
    {
      id: '6',
      title: 'فيلا قيد الإنشاء في الطائف',
      description: 'فيلا تحت الإنشاء في منطقة هادئة وراقية، تسليم خلال 6 أشهر',
      price: 1650000,
      location: 'الطائف - الشهداء الشمالي',
      area: 380,
      bedrooms: 4,
      bathrooms: 3,
      type: 'villa',
      status: 'under-construction',
      images: ['/projects/villa2.jpg'],
      features: ['قيد الإنشاء', 'تصميم حديث', 'منطقة هادئة', 'حديقة واسعة', 'إمكانية التعديل'],
      contact: {
        name: 'خالد العتيبي',
        phone: '+966 52 777 9999',
        email: 'khalid@example.com'
      },
      created_at: '2024-02-10T00:00:00Z'
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesType = selectedType === 'all' || project.type === selectedType;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // City filter
    const matchesCity = selectedCity === 'all' || 
                       project.location.toLowerCase().includes(getCityName(selectedCity).toLowerCase());
    
    // Price filter
    let matchesPrice = true;
    if (priceRange !== 'all') {
      if (priceRange.includes('+')) {
        const minPrice = parseInt(priceRange.replace('+', ''));
        matchesPrice = project.price >= minPrice;
      } else {
        const [min, max] = priceRange.split('-').map(p => parseInt(p));
        matchesPrice = project.price >= min && project.price <= max;
      }
    }
    
    return matchesType && matchesSearch && matchesCity && matchesPrice;
  });

  // Helper function to get city name in Arabic
  const getCityName = (cityValue: string): string => {
    const city = cities.find(c => c.value === cityValue);
    return city ? city.label : '';
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('ar-SA') + ' ر.س';
  };

  const getTypeLabel = (type: string): string => {
    const typeObj = projectTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-50/30 to-indigo-100/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 25%), 
                            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 25%)`
        }}></div>
        
        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-200/30">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-50/30 to-indigo-100/20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 25%), 
                          radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 25%)`
      }}></div>
      
      <div className="relative container mx-auto px-4 max-w-6xl py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">مشاريع للبيع</h1>
          <p className="text-gray-600 text-lg">اكتشف أفضل المشاريع العقارية المتاحة للبيع</p>
          
          {/* Navigation Links */}
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-white shadow-lg hover:shadow-xl transition-all border border-purple-200/30">الرئيسية</Link>
            <Link href="/stores-browse" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-white shadow-lg hover:shadow-xl transition-all border border-purple-200/30">تصفح المتاجر</Link>
            <Link href="/storefront" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-white shadow-lg hover:shadow-xl transition-all border border-purple-200/30">جميع المنتجات</Link>
            <Link href="/calculator" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-white shadow-lg hover:shadow-xl transition-all border border-purple-200/30">حاسبة البناء</Link>
            <Link href="/login" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all">تسجيل الدخول</Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 hover:shadow-2xl transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع المشروع
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {projectTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدينة
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {cities.map(city => (
                  <option key={city.value} value={city.value}>{city.label}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السعر
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البحث
              </label>
              <input
                type="text"
                placeholder="ابحث عن مشروع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            تم العثور على {filteredProjects.length} مشروع
            {selectedType !== 'all' && ` من نوع "${getTypeLabel(selectedType)}"`}
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">🏘️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مشاريع</h3>
            <p className="text-gray-500">لم يتم العثور على مشاريع تطابق معايير البحث</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Project Image */}
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">🏠</span>
                </div>
                
                <div className="p-4">
                  {/* Title and Type */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{project.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {getTypeLabel(project.type)}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <span>📍</span>
                    <span>{project.location}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>

                  {/* Details */}
                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-600">
                    <div className="text-center">
                      <span className="block">المساحة</span>
                      <strong>{project.area} م²</strong>
                    </div>
                    {project.bedrooms > 0 && (
                      <div className="text-center">
                        <span className="block">غرف النوم</span>
                        <strong>{project.bedrooms}</strong>
                      </div>
                    )}
                    {project.bathrooms > 0 && (
                      <div className="text-center">
                        <span className="block">دورات المياه</span>
                        <strong>{project.bathrooms}</strong>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {project.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                      {project.features.length > 3 && (
                        <span className="text-xs text-gray-500">+{project.features.length - 3} المزيد</span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-lg font-bold text-green-600 mb-3">
                    {formatPrice(project.price)}
                  </div>

                  {/* Contact */}
                  <div className="border-t pt-3">
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>{project.contact.name}</strong>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${project.contact.phone}`}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-2 px-3 rounded-lg transition-colors text-sm"
                      >
                        اتصال
                      </a>
                      <a
                        href={`https://wa.me/${project.contact.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-3 rounded-lg transition-colors text-sm"
                      >
                        واتساب
                      </a>
                    </div>
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
