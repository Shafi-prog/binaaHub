// @ts-nocheck
'use client'

/**
 * Simple Offline POS Page
 */

import { useState } from 'react'

export const dynamic = 'force-dynamic'

export default function OfflinePOSPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Offline POS System
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-4">
            Offline Point of Sale system is under development.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Product Catalog</h3>
              <p className="text-blue-700 text-sm">Manage and browse products offline</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Transaction Processing</h3>
              <p className="text-green-700 text-sm">Process sales without internet</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Data Sync</h3>
              <p className="text-purple-700 text-sm">Sync when connection is restored</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


