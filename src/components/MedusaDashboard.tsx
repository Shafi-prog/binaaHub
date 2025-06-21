'use client';

import { useState, useEffect } from 'react';
import { medusaClient, MedusaProduct, MedusaCollection } from '@/lib/medusa-client';

export default function MedusaDashboard() {
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [collections, setCollections] = useState<MedusaCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Test health check
        const health = await medusaClient.healthCheck();
        setHealthStatus(health);

        // Fetch products and collections
        const [productsData, collectionsData] = await Promise.all([
          medusaClient.getProducts(),
          medusaClient.getCollections(),
        ]);

        setProducts(productsData.products);
        setCollections(collectionsData.collections);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Medusa API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Medusa data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
            <p className="mb-4">{error}</p>
            <p className="text-sm text-gray-600">
              Make sure the Medusa server is running on http://localhost:9000
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Medusa Commerce Dashboard</h1>
          <p className="mt-2 text-gray-600">Connected to your Medusa backend</p>
        </div>

        {/* Health Status */}
        {healthStatus && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Medusa API is healthy - Status: {healthStatus.status}
                </p>
                <p className="text-xs text-green-600">
                  Last checked: {new Date(healthStatus.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">📦</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Products
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {products.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">📂</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Collections
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {collections.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">🚀</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      API Status
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Connected
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Products ({products.length})
            </h3>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No products found. Add some products to your Medusa store!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-900">{product.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{product.description || 'No description'}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(product.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Collections Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Collections ({collections.length})
            </h3>
            {collections.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No collections found. Create some collections to organize your products!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {collections.map((collection) => (
                  <div key={collection.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-900">{collection.title}</h4>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(collection.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* API Endpoints Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
          <h4 className="font-medium text-blue-900 mb-2">Available API Endpoints:</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Store API: <code>http://localhost:9000/store/*</code></p>
            <p>• Admin API: <code>http://localhost:9000/admin/*</code></p>
            <p>• Health Check: <code>http://localhost:9000/health</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
