import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail, CheckCircle, Clock, User } from 'lucide-react';

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
  availability: 'available' | 'busy' | 'unavailable';
  completedProjects: number;
  verified: boolean;
}

// Sample data for public display
const publicSupervisors: Supervisor[] = [
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
    skills: ['إدارة المشاريع', 'مراقبة الجودة', 'قراءة المخططات', 'السلامة المهنية'],
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
    skills: ['التمديدات الكهربائية', 'الأنظمة الذكية', 'إدارة الطاقة'],
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
    skills: ['أنظمة السباكة', 'الصرف الصحي', 'معالجة المياه'],
    availability: 'busy',
    completedProjects: 42,
    verified: true
  }
];

const getAvailabilityBadge = (availability: Supervisor['availability']) => {
  const config = {
    available: { label: 'متاح', className: 'bg-green-100 text-green-800' },
    busy: { label: 'مشغول', className: 'bg-yellow-100 text-yellow-800' },
    unavailable: { label: 'غير متاح', className: 'bg-red-100 text-red-800' }
  };
  
  return <Badge className={config[availability].className}>{config[availability].label}</Badge>;
};

export default function PublicSupervisorsPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">مشرفين البناء</h1>
          <p className="text-xl text-gray-600 mb-8">
            اكتشف أفضل مشرفين البناء المعتمدين في المملكة العربية السعودية
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button size="lg">
                سجل دخولك للتواصل مع المشرفين
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">
                إنشاء حساب جديد
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
              <p className="text-gray-600">مشرف معتمد</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2,500+</div>
              <p className="text-gray-600">مشروع مكتمل</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
              <p className="text-gray-600">متوسط التقييم</p>
            </CardContent>
          </Card>
        </div>

        {/* Supervisors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {publicSupervisors.map((supervisor) => (
            <Card key={supervisor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{supervisor.name}</h3>
                      {supervisor.verified && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
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
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(supervisor.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {supervisor.rating} ({supervisor.reviewCount} تقييم)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{supervisor.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="h-4 w-4" />
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

                <div className="text-center">
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      سجل دخولك للتواصل
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="p-8 bg-blue-50 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              هل أنت مشرف بناء؟
            </h2>
            <p className="text-gray-600 mb-6">
              انضم إلى منصة بنّاء واحصل على مشاريع جديدة وزد دخلك
            </p>
            <Link href="/register">
              <Button size="lg">
                انضم كمشرف بناء
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}