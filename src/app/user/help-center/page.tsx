// User Help Center page with articles, guides, and video links
export default function HelpCenterPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">    
      <h1 className="text-3xl font-bold text-blue-700 mb-4">مركز المساعدة</h1>
      <p className="text-lg text-gray-700 mb-6">كل ما تحتاج معرفته عن البناء واستخدام المنصة في مكان واحد.</p>      
      
      {/* Warning about AI Features */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-yellow-800 mb-2">⚠️ تحديث مهم: اختبار الميزات الذكية</h3>
        <p className="text-yellow-700 mb-2">
          نقوم حالياً بمراجعة وتحسين جميع ميزات الذكاء الاصطناعي والحاسبات الذكية لضمان أفضل تجربة للمستخدمين.
        </p>
        <a href="/user/ai-smart-features-test" className="text-yellow-800 hover:underline font-medium">
          🧪 صفحة اختبار الميزات الذكية - ساعدنا في التحسين
        </a>
      </div>

      <ul className="list-disc pl-6 space-y-2">
        <li><a href="/user/help-center/articles/getting-started" className="text-blue-600 hover:underline">دليل البدء السريع للبناء</a></li>
        <li><a href="/user/help-center/articles/project-steps" className="text-blue-600 hover:underline">مراحل رحلة البناء خطوة بخطوة</a></li>
        <li><a href="/user/help-center/articles/warranty" className="text-blue-600 hover:underline">كل شيء عن الضمانات</a></li>
        <li><a href="/user/help-center/articles/documents" className="text-blue-600 hover:underline">إدارة الملفات والمستندات</a></li>
        <li><a href="/user/help-center/articles/orders" className="text-blue-600 hover:underline">كيفية إدارة الطلبات</a></li>
        <li><a href="/user/help-center/articles/support" className="text-blue-600 hover:underline">الدعم الفني والتواصل مع الخبراء</a></li>
        <li><a href="/user/help-center/articles/faq" className="text-blue-600 hover:underline">الأسئلة الشائعة</a></li>
        <li><a href="/user/ai-smart-features-test" className="text-purple-600 hover:underline font-medium">🤖 اختبار الميزات الذكية والذكاء الاصطناعي</a></li>
      </ul>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">فيديوهات تعليمية</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><a href="https://www.youtube.com/results?search_query=بناء+منزل+خطوة+بخطوة" target="_blank" rel="noopener" className="text-blue-600 hover:underline">مشاهدة فيديوهات بناء المنزل خطوة بخطوة</a></li>
        </ul>
      </div>
    </main>
  );
}
