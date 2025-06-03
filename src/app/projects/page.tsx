import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Building2, MapPin, Calendar, Clock, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function PublicProjectsPage() {
  // Sample public project showcase data
  const featuredProjects = [
    {
      id: 1,
      name: 'مشروع توسعة مجمع تجاري',
      location: 'الرياض - حي العليا',
      status: 'مكتمل',
      duration: '18 شهر',
      description: 'مشروع توسعة وتطوير مجمع تجاري بمساحة 15,000 متر مربع',
      image: '/projects/commercial-1.jpg',
      category: 'تجاري',
    },
    {
      id: 2,
      name: 'مشروع فلل سكنية فاخرة',
      location: 'جدة - حي الزهراء',
      status: 'قيد التنفيذ',
      duration: '24 شهر',
      description: 'تطوير مجمع فلل سكنية فاخرة يضم 50 فيلا بتصاميم عصرية',
      image: '/projects/residential-1.jpg',
      category: 'سكني',
    },
    {
      id: 3,
      name: 'مشروع مجمع طبي متكامل',
      location: 'الدمام - الكورنيش',
      status: 'مكتمل',
      duration: '30 شهر',
      description: 'إنشاء مجمع طبي متكامل يضم عيادات متخصصة ومركز تشخيص',
      image: '/projects/medical-1.jpg',
      category: 'طبي',
    },
    {
      id: 4,
      name: 'مشروع مجمع تعليمي',
      location: 'المدينة المنورة',
      status: 'قيد التنفيذ',
      duration: '36 شهر',
      description: 'بناء مجمع تعليمي يضم مدارس ومعاهد تقنية متطورة',
      image: '/projects/educational-1.jpg',
      category: 'تعليمي',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'قيد التنفيذ':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'التخطيط':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'تجاري':
        return 'bg-purple-100 text-purple-800';
      case 'سكني':
        return 'bg-blue-100 text-blue-800';
      case 'طبي':
        return 'bg-red-100 text-red-800';
      case 'تعليمي':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-tajawal">
            معرض المشاريع
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            اكتشف مجموعة متنوعة من المشاريع الإنشائية المتميزة التي تم تنفيذها بأعلى معايير الجودة
          </p>
          
          {/* Call to Action */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mb-12 border border-blue-100">
            <div className="flex items-center justify-center gap-3 mb-4">
              <UserCheck className="h-8 w-8 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">
                هل لديك مشروع إنشائي؟
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              انضم إلى منصتنا لإدارة مشاريعك الإنشائية وتتبع تقدمها بكل سهولة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/user/projects">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  <Building2 className="h-5 w-5 mr-2" />
                  مشاريعي
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="px-6 py-3 rounded-lg font-medium border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors">
                  إنشاء حساب جديد
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
              <div className="aspect-video bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                <Building2 className="h-16 w-16 text-blue-600 opacity-50" />
              </div>
              
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-bold text-gray-800 leading-tight">
                    {project.name}
                  </CardTitle>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(project.category)}`}>
                    {project.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{project.duration}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  
                  <Link 
                    href="/user/projects"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    بدء مشروع مماثل
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              ابدأ مشروعك الإنشائي اليوم
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              انضم إلى آلاف العملاء الذين يثقون بنا في إدارة وتنفيذ مشاريعهم الإنشائية
            </p>
            <Link href="/user/projects">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors">
                <Building2 className="h-5 w-5 mr-2" />
                ابدأ الآن
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
