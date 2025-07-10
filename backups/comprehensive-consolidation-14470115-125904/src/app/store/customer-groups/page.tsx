// @ts-nocheck
'use client'


// Force dynamic rendering to avoid SSG auth context issues
import { SingleColumnPage } from "@/components/layout/pages"


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid static generation issues

export default function CustomerGroupsList() {
  return (
    <SingleColumnPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Customer Groups</h1>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <p className="text-gray-600">Customer groups management coming soon...</p>
        </div>
      </div>
    </SingleColumnPage>
  )
}


