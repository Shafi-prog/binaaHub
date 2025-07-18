import Link from 'next/link';
export default function UserDocumentsPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">    
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-700">ملفاتي</h1>
        <Link href="/user/help-center/articles/documents" className="text-blue-600 hover:underline">تعرف على إدارة الملفات</Link>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="font-bold mb-2">إدارة الملفات</h2> 
        <ul className="list-disc pl-6 text-gray-700">     
          <li>رفع المستندات المهمة لمشاريعك</li>
          <li>تحميل الفواتير والضمانات بسهولة</li>        
          <li>تنظيم ملفاتك حسب المشروع أو الطلب</li>      
        </ul>
      </div>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">ملفاتي</h1>
        <p>هنا ستجد جميع الملفات والفواتير والضمانات الخاصة بك.</p>
      </div>
      {/* Floating help button */}
      <Link href="/user/help-center" className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full shadow-lg px-5 py-3 hover:bg-blue-700 z-50">مساعدة؟</Link>
    </main>
  );
}
