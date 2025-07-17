// @ts-nocheck
import { EnhancedLoading } from '@/core/shared/components/loading';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
      </div>
      
      {/* Loading Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center border border-white/20">
        {/* Logo Container */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl mx-auto flex items-center justify-center shadow-lg animate-pulse-glow">
            <div className="text-white text-3xl font-bold font-cairo">ب</div>
          </div>
        </div>
        
        {/* Main Loading Animation */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin opacity-60"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-3 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 font-cairo animate-fadeIn">
            جارٍ تحميل البيانات...
          </h2>
          <p className="text-gray-600 text-base font-tajawal animate-slideUp">
            يرجى الانتظار قليلاً
          </p>
        </div>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
        
        {/* Loading Bar */}
        <div className="mt-8 w-full max-w-xs mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-shimmer"
                 style={{
                   background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
                   backgroundSize: '200% 100%',
                   animation: 'shimmer 2s infinite'
                 }}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


