// @ts-nocheck
export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
        <p className="text-gray-600">Discover products from multiple stores</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">Electronics</div>
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">Fashion</div>
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">Home & Garden</div>
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">Construction</div>
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">Tools</div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="h-32 bg-gray-200 rounded mb-2"></div>
                <h4 className="font-medium">Sample Product 1</h4>
                <p className="text-sm text-gray-500">By Store Name</p>
                <p className="text-lg font-bold text-blue-600">SAR 99</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="h-32 bg-gray-200 rounded mb-2"></div>
                <h4 className="font-medium">Sample Product 2</h4>
                <p className="text-sm text-gray-500">By Store Name</p>
                <p className="text-lg font-bold text-blue-600">SAR 149</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Stores</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <h4 className="font-medium">Store Name 1</h4>
            <p className="text-sm text-gray-500">Electronics & Gadgets</p>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <h4 className="font-medium">Store Name 2</h4>
            <p className="text-sm text-gray-500">Fashion & Clothing</p>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <h4 className="font-medium">Store Name 3</h4>
            <p className="text-sm text-gray-500">Home & Garden</p>
          </div>
        </div>
      </div>
    </div>
  )
}


