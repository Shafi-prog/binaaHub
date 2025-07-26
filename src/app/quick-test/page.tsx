'use client';

import { useState } from 'react';
import { supabaseDataService } from '@/core/shared/services/supabase-data-service';

export default function QuickTestPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runQuickTest = async () => {
    setLoading(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    try {
      // Test 1: Get material prices
      console.log('Testing getMaterialPrices...');
      const prices = await supabaseDataService.getMaterialPrices();
      results.tests.push({
        name: 'Material Prices',
        status: prices.length > 0 ? 'success' : 'empty',
        count: prices.length,
        sample: prices.slice(0, 2)
      });

      // Test 2: Get user profile
      console.log('Testing getUserProfile...');
      try {
        const profile = await supabaseDataService.getUserProfile('test-user-1');
        results.tests.push({
          name: 'User Profile',
          status: profile ? 'success' : 'empty',
          data: profile
        });
      } catch (error) {
        results.tests.push({
          name: 'User Profile',
          status: 'error',
          error: error.message
        });
      }

      // Test 3: Get system stats
      console.log('Testing getSystemStats...');
      const stats = await supabaseDataService.getSystemStats();
      results.tests.push({
        name: 'System Stats',
        status: 'success',
        data: stats
      });

    } catch (error) {
      results.tests.push({
        name: 'Global Error',
        status: 'error',
        error: error.message
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🧪 Quick Database Test</h1>
          
          <div className="mb-6">
            <button
              onClick={runQuickTest}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
            >
              {loading ? '🔄 Testing...' : '🚀 Run Quick Test'}
            </button>
          </div>

          {testResults && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">📊 Test Results</h2>
                <p className="text-gray-600 text-sm">Executed at: {testResults.timestamp}</p>
              </div>

              {testResults.tests.map((test: any, index: number) => (
                <div key={index} className={`border rounded-lg p-4 ${
                  test.status === 'success' ? 'border-green-200 bg-green-50' :
                  test.status === 'empty' ? 'border-yellow-200 bg-yellow-50' :
                  'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-lg ${
                      test.status === 'success' ? 'text-green-600' :
                      test.status === 'empty' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {test.status === 'success' ? '✅' :
                       test.status === 'empty' ? '⚠️' : '❌'}
                    </span>
                    <h3 className="font-semibold">{test.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      test.status === 'success' ? 'bg-green-100 text-green-800' :
                      test.status === 'empty' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {test.status}
                    </span>
                  </div>

                  {test.count !== undefined && (
                    <p className="text-sm text-gray-600 mb-2">Records found: {test.count}</p>
                  )}

                  {test.error && (
                    <div className="bg-red-100 border border-red-200 rounded p-3 text-red-700 text-sm">
                      Error: {test.error}
                    </div>
                  )}

                  {test.sample && test.sample.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Sample Data:</p>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(test.sample, null, 2)}
                      </pre>
                    </div>
                  )}

                  {test.data && !test.sample && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Data:</p>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex gap-4 justify-center">
            <a
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              🏠 Back to Homepage
            </a>
            <a
              href="/database-management"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              🛠️ Database Management
            </a>
            <a
              href="https://qghcdswwagbwqqqtcrfq.supabase.co"
              target="_blank"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              🗄️ Supabase Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
