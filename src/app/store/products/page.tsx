// @ts-nocheck
'use client'

import { SingleColumnPage } from "@/components/layout/pages"

const ProductList = () => {
  return (
    <SingleColumnPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <p className="text-gray-600">Product management coming soon...</p>
        </div>
      </div>
    </SingleColumnPage>
  )
}

export default ProductList;

