// @ts-nocheck
export default function AdminDashboard() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">لوحة تحكم المنصة</h2>
        <p className="text-gray-600">مراقبة وإدارة منصة بنّا التجارية</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">إجمالي المتاجر</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">المنتجات النشطة</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">إجمالي العملاء</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">الإيرادات الشهرية</h3>
          <p className="text-2xl font-bold text-gray-900">0 ريال</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">النشاط الأخير</h3>
        <p className="text-gray-500">لا يوجد نشاط حديث للعرض</p>
      </div>
    </div>
  )
}


