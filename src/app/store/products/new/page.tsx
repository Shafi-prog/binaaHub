'use client';
// This page has been removed. Please use the Medusa admin panel for product creation.
export default function RemovedProductNewPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">تم نقل إنشاء المنتج</h1>
        <p className="mb-2">يتم الآن إدارة إنشاء المنتج في لوحة تحكم Medusa.</p>
        <a href="http://localhost:9000/admin/products" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">اذهب إلى منتجات Medusa</a>
      </div>
    </div>
  );
}
