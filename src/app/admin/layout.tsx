import { ReactNode } from 'react'

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Binna Platform Administration
          </h1>
        </div>
      </header>
      
      <div className="flex">
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              <a href="/admin/dashboard" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                Dashboard
              </a>
              <a href="/admin/stores" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                Store Management
              </a>
              <a href="/admin/marketplace" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                Marketplace Settings
              </a>
              <a href="/admin/analytics" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                Platform Analytics
              </a>
              <a href="/admin/finance" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                Finance & Commissions
              </a>
            </div>
          </div>
        </nav>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
