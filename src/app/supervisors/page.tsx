'use client';

import { useState, useEffect } from 'react';
import { StarIcon, MapPinIcon, PhoneIcon, UserIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

// Simple UI Components defined inline to avoid import issues
const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }: any) => {
  const baseClasses = 'font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses: Record<string, string> = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  };
  const sizeClasses: Record<string, string> = {
    default: 'px-4 py-2 rounded-lg',
    sm: 'px-3 py-1.5 text-sm rounded'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

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

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input 
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
      {...props} 
    />
  );
};

const Select = ({ children, className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

const Badge = ({ variant = 'default', className = '', children, ...props }: { 
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'; 
  children: React.ReactNode; 
  className?: string; 
} & React.HTMLAttributes<HTMLSpanElement>) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';  const variantClasses: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

interface Supervisor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  experience: number;
  hourlyRate: number;
  location: string;
  phone: string;
  email: string;
  description: string;
  skills: string[];
  image: string;
  availability: 'available' | 'busy' | 'unavailable';
  completedProjects: number;
  verified: boolean;
}

const dummySupervisors: Supervisor[] = [
  {
    id: '1',
    name: 'أحمد محمد العتيبي',
    specialization: 'مشرف عام للبناء',
    rating: 4.9,
    reviewCount: 45,
    experience: 12,
    hourlyRate: 150,
    location: 'الرياض - حي النزهة',
    phone: '+966-50-123-4567',
    email: 'ahmed.alotaibi@email.com',
    description: 'مشرف بناء محترف مع خبرة واسعة في إدارة مشاريع البناء السكنية والتجارية. متخصص في ضمان جودة العمل والالتزام بالمواعيد.',
    skills: ['إدارة المشاريع', 'مراقبة الجودة', 'قراءة المخططات', 'السلامة المهنية', 'إدارة الفرق'],
    image: '/api/placeholder/150/150',
    availability: 'available',
    completedProjects: 78,
    verified: true
  },
  {
    id: '2',
    name: 'سعد عبدالله النجار',
    specialization: 'مشرف الأعمال الكهربائية',
    rating: 4.7,
    reviewCount: 32,
    experience: 8,
    hourlyRate: 120,
    location: 'الرياض - حي الملز',
    phone: '+966-50-234-5678',
    email: 'saad.najjar@email.com',
    description: 'مهندس كهربائي ومشرف متخصص في التمديدات الكهربائية والأنظمة الذكية للمنازل والمباني التجارية.',
    skills: ['التمديدات الكهربائية', 'الأنظمة الذكية', 'إدارة الطاقة', 'الصيانة الوقائية'],
    image: '/api/placeholder/150/150',
    availability: 'available',
    completedProjects: 56,
    verified: true
  },
  {
    id: '3',
    name: 'خالد فهد المطيري',
    specialization: 'مشرف السباكة والصرف',
    rating: 4.8,
    reviewCount: 28,
    experience: 10,
    hourlyRate: 110,
    location: 'الرياض - حي العليا',
    phone: '+966-50-345-6789',
    email: 'khaled.mutairi@email.com',
    description: 'خبير في أنظمة السباكة والصرف الصحي مع تخصص في الحلول الحديثة وأنظمة توفير المياه.',
    skills: ['أنظمة السباكة', 'الصرف الصحي', 'معالجة المياه', 'كشف التسريبات'],
    image: '/api/placeholder/150/150',
    availability: 'busy',
    completedProjects: 42,
    verified: true
  },
  {
    id: '4',
    name: 'محمد سالم الحربي',
    specialization: 'مشرف التشطيبات',
    rating: 4.6,
    reviewCount: 21,
    experience: 6,
    hourlyRate: 100,
    location: 'الرياض - حي السليمانية',
    phone: '+966-50-456-7890',
    email: 'mohammed.harbi@email.com',
    description: 'متخصص في أعمال التشطيبات الداخلية والخارجية مع خبرة في الديكور والتصميم الداخلي.',
    skills: ['الدهانات', 'السيراميك', 'الجبس', 'الديكور', 'النجارة'],
    image: '/api/placeholder/150/150',
    availability: 'available',
    completedProjects: 35,
    verified: false
  }
];

export default function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [filteredSupervisors, setFilteredSupervisors] = useState<Supervisor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSupervisors(dummySupervisors);
      setFilteredSupervisors(dummySupervisors);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = supervisors;
    
    if (searchTerm) {
      filtered = filtered.filter(supervisor => 
        supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supervisor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supervisor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (specializationFilter !== 'all') {
      filtered = filtered.filter(supervisor => 
        supervisor.specialization.includes(specializationFilter)
      );
    }
    
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(supervisor => supervisor.availability === availabilityFilter);
    }
    
    if (ratingFilter !== 'all') {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(supervisor => supervisor.rating >= minRating);
    }
    
    setFilteredSupervisors(filtered);
  }, [supervisors, searchTerm, specializationFilter, availabilityFilter, ratingFilter]);

  const getAvailabilityBadge = (availability: Supervisor['availability']) => {
    const config = {
      available: { label: 'متاح', className: 'bg-green-100 text-green-800' },
      busy: { label: 'مشغول', className: 'bg-yellow-100 text-yellow-800' },
      unavailable: { label: 'غير متاح', className: 'bg-red-100 text-red-800' }
    };
    
    return <Badge className={config[availability].className}>{config[availability].label}</Badge>;
  };

  const sendMessage = (supervisorId: string) => {
    // This will be implemented with the chat system
    alert('سيتم فتح المحادثة مع المشرف');
  };

  const requestAgreement = (supervisorId: string) => {
    alert('تم إرسال طلب اتفاق للمشرف. ستتلقى رداً قريباً.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المشرفين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">البحث عن مشرفين</h1>
          <p className="text-gray-600 mb-6">اختر المشرف المناسب لمشروعك من قائمة المشرفين المعتمدين</p>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Input
              placeholder="البحث بالاسم أو التخصص..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
              <select 
              value={specializationFilter} 
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع التخصصات</option>
              <option value="عام">مشرف عام</option>
              <option value="كهربائية">كهربائي</option>
              <option value="سباكة">سباك</option>
              <option value="تشطيبات">تشطيبات</option>
            </select>
              <select 
              value={availabilityFilter} 
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="available">متاح</option>
              <option value="busy">مشغول</option>
              <option value="unavailable">غير متاح</option>
            </select>
            
            <select 
              value={ratingFilter} 
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع التقييمات</option>
              <option value="4.5">4.5 نجوم فأكثر</option>
              <option value="4.0">4.0 نجوم فأكثر</option>
              <option value="3.5">3.5 نجوم فأكثر</option>
            </select>
            
            <Button variant="outline">
              فلترة متقدمة
            </Button>
          </div>
        </div>

        {/* Supervisors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSupervisors.map((supervisor) => (
            <Card key={supervisor.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={supervisor.image}
                  alt={supervisor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{supervisor.name}</h3>
                    {supervisor.verified && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{supervisor.specialization}</p>
                  {getAvailabilityBadge(supervisor.availability)}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      i < Math.floor(supervisor.rating) ? (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                      ) : (
                        <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
                      )
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {supervisor.rating} ({supervisor.reviewCount} تقييم)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{supervisor.location}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <UserIcon className="h-4 w-4" />
                  <span>{supervisor.experience} سنوات خبرة • {supervisor.completedProjects} مشروع</span>
                </div>

                <div className="text-blue-600 font-semibold">
                  {supervisor.hourlyRate} ريال/ساعة
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {supervisor.description}
              </p>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">المهارات:</p>
                <div className="flex flex-wrap gap-1">
                  {supervisor.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {supervisor.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{supervisor.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => sendMessage(supervisor.id)}
                >
                  <ChatBubbleLeftIcon className="h-4 w-4 ml-1" />
                  محادثة
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => requestAgreement(supervisor.id)}
                  disabled={supervisor.availability === 'unavailable'}
                >
                  طلب اتفاق
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredSupervisors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">لا توجد مشرفين يطابقون البحث</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSpecializationFilter('all');
              setAvailabilityFilter('all');
              setRatingFilter('all');
            }}>
              إعادة تعيين الفلاتر
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
