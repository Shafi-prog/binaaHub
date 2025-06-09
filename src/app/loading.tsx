import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 font-tajawal">
      <div className="loading-card flex flex-col items-center justify-center p-8 rounded-2xl shadow-2xl bg-white/80 border border-gray-200">
        <div className="mb-4">
          <LoadingSpinner size="lg" className="w-12 h-12 border-4 border-blue-200 border-t-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">جارٍ تحميل البيانات...</h2>
        <p className="text-gray-500 text-sm">يرجى الانتظار قليلاً</p>
      </div>
    </div>
  );
}
