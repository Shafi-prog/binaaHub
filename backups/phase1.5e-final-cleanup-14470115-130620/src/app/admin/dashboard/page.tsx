// @ts-nocheck
export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Platform Dashboard</h2>
        <p className="text-gray-600">Monitor and manage the Binna marketplace platform</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Stores</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Products</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">SAR 0</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <p className="text-gray-500">No recent activity to display</p>
      </div>
    </div>
  )
}


