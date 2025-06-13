import { EnhancedLoading } from '@/components/ui/enhanced-loading';

export default function MobileTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-sm mx-auto space-y-8">
        {/* Mobile Viewport Header */}
        <div className="bg-blue-600 text-white p-4 rounded-lg text-center">
          <h1 className="text-lg font-bold">اختبار التصميم المتجاوب</h1>
          <p className="text-sm opacity-90">Mobile Responsiveness Test</p>
        </div>

        {/* Login Form Test */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">تسجيل الدخول</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="أدخل كلمة المرور"
              />
            </div>
            
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-base">
              دخول
            </button>
          </div>
        </div>

        {/* Button Test */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-center">اختبار الأزرار</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-base">
              زر أساسي
            </button>
            <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors text-base">
              زر ثانوي
            </button>
            <button className="w-full bg-transparent text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 border border-blue-600 transition-colors text-base">
              زر محدد
            </button>
          </div>
        </div>

        {/* Loading Test */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-center">اختبار التحميل</h3>
          <div className="flex justify-center">
            <EnhancedLoading 
              title="جارٍ التحميل..."
              subtitle="يرجى الانتظار"
              showLogo={true}
              size="md"
              fullScreen={false}
            />
          </div>
        </div>

        {/* Touch Target Test */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-center">اختبار أهداف اللمس</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-green-600 text-white py-4 px-4 rounded-lg font-medium text-base min-h-[48px]">
              كبير
            </button>
            <button className="bg-yellow-600 text-white py-4 px-4 rounded-lg font-medium text-base min-h-[48px]">
              مناسب
            </button>
          </div>
        </div>

        {/* Text Size Test */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-center">اختبار حجم النص</h3>
          <div className="space-y-2">
            <p className="text-xs">نص صغير جداً - 12px</p>
            <p className="text-sm">نص صغير - 14px</p>
            <p className="text-base">نص عادي - 16px</p>
            <p className="text-lg">نص كبير - 18px</p>
            <p className="text-xl">نص كبير جداً - 20px</p>
          </div>
        </div>

        {/* Spacing Test */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-center">اختبار المسافات</h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-100 rounded-lg">مسافة صغيرة</div>
            <div className="p-4 bg-green-100 rounded-lg">مسافة متوسطة</div>
            <div className="p-6 bg-yellow-100 rounded-lg">مسافة كبيرة</div>
          </div>
        </div>

        {/* Viewport Info */}
        <div className="bg-gray-800 text-white p-4 rounded-lg text-center">
          <p className="text-sm">
            العرض الحالي: <span className="font-mono" id="viewport-width">loading...</span>px
          </p>
          <p className="text-sm">
            الارتفاع الحالي: <span className="font-mono" id="viewport-height">loading...</span>px
          </p>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            function updateViewport() {
              document.getElementById('viewport-width').textContent = window.innerWidth;
              document.getElementById('viewport-height').textContent = window.innerHeight;
            }
            updateViewport();
            window.addEventListener('resize', updateViewport);
          `
        }}
      />
    </div>
  );
}
