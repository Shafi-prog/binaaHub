'use client';

import { useState, useEffect } from 'react';

export default function AdminDebug() {
  const [status, setStatus] = useState('Starting...');
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus('Fetching products...');
        
        console.log('About to fetch products...');
        const productsResponse = await fetch('/api/store/products');
        console.log('Products response received:', productsResponse.status);
        
        if (!productsResponse.ok) {
          throw new Error(`Products failed: ${productsResponse.status}`);
        }
        
        const productsData = await productsResponse.json();
        console.log('Products data:', productsData);
        setProducts(productsData.products || []);
        
        setStatus('Fetching regions...');
        
        console.log('About to fetch regions...');
        const regionsResponse = await fetch('/api/store/regions');
        console.log('Regions response received:', regionsResponse.status);
        
        if (!regionsResponse.ok) {
          throw new Error(`Regions failed: ${regionsResponse.status}`);
        }
        
        const regionsData = await regionsResponse.json();
        console.log('Regions data:', regionsData);
        setRegions(regionsData.regions || []);
        
        setStatus('Complete!');
        
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('Error occurred');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔧 Admin Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <p className="text-lg">{status}</p>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Products ({products.length})</h2>
            {products.length > 0 ? (
              <ul className="space-y-2">
                {products.slice(0, 3).map((product) => (
                  <li key={product.id} className="p-2 bg-gray-50 rounded">
                    <div className="font-medium">{product.title}</div>
                    <div className="text-sm text-gray-600">{product.handle}</div>
                  </li>
                ))}
                {products.length > 3 && (
                  <li className="text-sm text-gray-500">...and {products.length - 3} more</li>
                )}
              </ul>
            ) : (
              <p className="text-gray-500">No products loaded yet</p>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Regions ({regions.length})</h2>
            {regions.length > 0 ? (
              <ul className="space-y-2">
                {regions.map((region) => (
                  <li key={region.id} className="p-2 bg-gray-50 rounded">
                    <div className="font-medium">{region.name}</div>
                    <div className="text-sm text-gray-600">{region.currency_code}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No regions loaded yet</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Reload Page
          </button>
          <a
            href="/admin"
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md inline-block"
          >
            Go to Main Admin
          </a>
        </div>
      </div>
    </div>
  );
}
