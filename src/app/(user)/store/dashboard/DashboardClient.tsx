'use client'

import LogoutButton from '@/components/ui/LogoutButton'

type DashboardClientProps = {
  name: string
  email: string
  accountType: 'user' | 'store'
}

export function DashboardClient({ name, email, accountType }: DashboardClientProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">لوحة تحكم المتجر</h1>
      <p className="text-gray-600 mb-2">مرحباً {name} 👋</p>
      <p className="text-gray-600 text-sm">البريد الإلكتروني: {email}</p>
      <p className="text-gray-600 text-sm">نوع الحساب: {accountType}</p>
      <hr className="my-4" />
      <p className="text-gray-500">🛠 جاري تطوير لوحة تحكم المتجر</p>

      {/* زر تسجيل الخروج */}
      <LogoutButton />
    </div>
  )
}
