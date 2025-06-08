import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center">
        <LoadingSpinner size="lg" />
        <h2 className="mt-6 text-2xl font-bold text-blue-700">جاري التحميل...</h2>
        <p className="mt-2 text-gray-500 text-center max-w-xs">
          يرجى الانتظار قليلاً أثناء تحميل البيانات من منصة بناء الذكية.
        </p>
      </div>
    </div>
  );
}
