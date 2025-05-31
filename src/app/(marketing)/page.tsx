import { Card } from '@/components/ui/card';
import { ClientIcon } from '@/components/icons';
import type { IconKey } from '@/components/icons/ClientIcon';
import Link from 'next/link';

interface MarketingService {
  id: string;
  title: string;
  description: string;
  icon: IconKey;
  features: string[];
  benefits: string[];
  pricing: string;
  color: string;
  href: string;
}

export default function MarketingPage() {
  const marketingServices: MarketingService[] = [
    {
      id: '1',
      title: 'تسويق رقمي للمتاجر',
      description: 'خدمات تسويق شاملة لزيادة مبيعات متجرك الإلكتروني',
      icon: 'marketing',
      features: [
        'إدارة وسائل التواصل الاجتماعي',
        'إعلانات مدفوعة',
        'تحسين محركات البحث',
        'تحليل البيانات',
      ],
      benefits: ['زيادة الوصول للعملاء', 'تحسين معدل التحويل', 'بناء الهوية التجارية'],
      pricing: 'من 500 ر.س شهرياً',
      color: 'bg-blue-500',
      href: '/store/marketing/digital',
    },
    {
      id: '2',
      title: 'إدارة المحتوى',
      description: 'إنشاء وإدارة محتوى جذاب لمنصاتك الرقمية',
      icon: 'design',
      features: ['كتابة المحتوى', 'تصميم الجرافيك', 'إنتاج الفيديو', 'جدولة المنشورات'],
      benefits: ['محتوى احترافي', 'تفاعل أكبر مع الجمهور', 'توفير الوقت والجهد'],
      pricing: 'من 300 ر.س شهرياً',
      color: 'bg-purple-500',
      href: '/store/marketing/content',
    },
    {
      id: '3',
      title: 'حملات إعلانية',
      description: 'تصميم وإدارة حملات إعلانية فعالة عبر منصات متعددة',
      icon: 'dashboard',
      features: [
        'إعلانات Google',
        'إعلانات Facebook و Instagram',
        'تتبع الأداء',
        'تحليل النتائج',
      ],
      benefits: ['استهداف دقيق', 'عائد استثمار مرتفع', 'تقارير مفصلة'],
      pricing: 'من 800 ر.س شهرياً',
      color: 'bg-green-500',
      href: '/store/marketing/campaigns',
    },
    {
      id: '4',
      title: 'استشارات تسويقية',
      description: 'استشارات مخصصة لتطوير استراتيجية التسويق الخاصة بك',
      icon: 'calculator',
      features: ['تحليل السوق', 'وضع الاستراتيجية', 'متابعة التنفيذ', 'تقييم الأداء'],
      benefits: ['استراتيجية مخصصة', 'خبرة متخصصة', 'نتائج قابلة للقياس'],
      pricing: 'من 1200 ر.س للجلسة',
      color: 'bg-red-500',
      href: '/store/marketing/consulting',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">خدمات التسويق الرقمي</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نساعدك في الوصول لعملائك المحتملين وزيادة مبيعاتك من خلال استراتيجيات تسويقية مدروسة
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'استراتيجية مخصصة', desc: 'خطة تسويق مصممة خصيصاً لنشاطك', icon: 'design' },
            { title: 'فريق متخصص', desc: 'خبراء في التسويق الرقمي والإعلانات', icon: 'settings' },
            { title: 'نتائج قابلة للقياس', desc: 'تقارير مفصلة وتحليلات دقيقة', icon: 'dashboard' },
            { title: 'دعم مستمر', desc: 'متابعة ودعم على مدار الساعة', icon: 'shield' },
          ].map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ClientIcon type={feature.icon as IconKey} size={32} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </Card>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {marketingServices.map((service) => (
            <Card key={service.id} className="p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`${service.color} p-3 rounded-lg`}>
                    <ClientIcon type={service.icon} size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">ما يشمله:</h4>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">الفوائد:</h4>
                <ul className="space-y-2">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & CTA */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div>
                  <span className="text-2xl font-bold text-gray-800">{service.pricing}</span>
                  <p className="text-sm text-gray-500">*قابل للتخصيص حسب احتياجاتك</p>
                </div>
                <Link
                  href={service.href}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  اطلب الخدمة
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="text-center p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 className="text-3xl font-bold mb-4">جاهز لبدء رحلتك التسويقية؟</h2>
          <p className="text-xl mb-8 opacity-90">
            احصل على استشارة مجانية لمناقشة احتياجاتك التسويقية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              احجز استشارة مجانية
            </Link>
            <Link
              href="/store"
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
            >
              تصفح المتاجر
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
