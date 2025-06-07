import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            مرحباً بكم في منصة بناء
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            منصة شاملة لإدارة مشاريع البناء والتشييد - تابع مشاريعك، أدر طلباتك، وراقب الضمانات بكل سهولة
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">إدارة المشاريع</h3>
              <p className="text-gray-600">تابع جميع مشاريعك من التخطيط حتى التسليم</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-green-600 text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">إدارة الطلبات</h3>
              <p className="text-gray-600">نظم طلبات المواد والخدمات بكفاءة عالية</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-purple-600 text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">متابعة الضمانات</h3>
              <p className="text-gray-600">راقب ضمانات المواد والأعمال المختلفة</p>
            </div>
          </div>
          
          <div className="mt-12 space-x-4 space-x-reverse">
            <Link 
              href="/user/projects" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-block"
            >
              عرض المشاريع
            </Link>
            <Link 
              href="/login" 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-lg transition-colors inline-block"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">الميزات الرئيسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">📊</span>
              </div>
              <h4 className="font-semibold text-gray-900">تقارير شاملة</h4>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">💰</span>
              </div>
              <h4 className="font-semibold text-gray-900">إدارة التكاليف</h4>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">🔔</span>
              </div>
              <h4 className="font-semibold text-gray-900">إشعارات فورية</h4>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-2xl">📱</span>
              </div>
              <h4 className="font-semibold text-gray-900">واجهة متجاوبة</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
