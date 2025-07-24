// @ts-nocheck
export default function MarketplacePage() {
  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">السوق الإلكتروني</h2>
        <p className="text-gray-600">اكتشف المنتجات من متاجر متعددة</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">الفئات</h3>
            <div className="space-y-2">
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">الإلكترونيات</div>
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">الأزياء</div>
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">المنزل والحديقة</div>
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">البناء والتشييد</div>
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">الأدوات</div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">المنتجات المميزة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="h-32 bg-gray-200 rounded mb-2"></div>
                <h4 className="font-medium">منتج تجريبي 1</h4>
                <p className="text-sm text-gray-500">من متجر بِنَّا</p>
                <p className="text-lg font-bold text-blue-600">99 ريال</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="h-32 bg-gray-200 rounded mb-2"></div>
                <h4 className="font-medium">منتج تجريبي 2</h4>
                <p className="text-sm text-gray-500">من متجر بِنَّا</p>
                <p className="text-lg font-bold text-blue-600">149 ريال</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">المتاجر المميزة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <h4 className="font-medium">متجر الإلكترونيات</h4>
            <p className="text-sm text-gray-500">إلكترونيات وأجهزة ذكية</p>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <h4 className="font-medium">متجر الأزياء</h4>
            <p className="text-sm text-gray-500">أزياء وملابس عصرية</p>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <h4 className="font-medium">متجر المنزل</h4>
            <p className="text-sm text-gray-500">مستلزمات المنزل والحديقة</p>
          </div>
        </div>
      </div>
    </div>
  )
}


