import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">تسجيل الدخول</h2>
        <form className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">البريد الإلكتروني</label>
            <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="you@email.com" required />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">كلمة المرور</label>
            <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="••••••••" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition">دخول</button>
        </form>
        <div className="text-center mt-6 text-gray-600">
          ليس لديك حساب؟{' '}
          <Link href="/signup" className="text-blue-600 hover:underline font-semibold">إنشاء حساب جديد</Link>
        </div>
      </div>
    </div>
  );
}
