'use client';

import { useState, useEffect } from 'react';
import { supabaseDataService } from '@/core/shared/services/supabase-data-service';

interface TableTestResult {
  status: 'success' | 'error';
  count?: number;
  loadTime?: number;
  sample?: any[];
  error?: string;
  stats?: any;
  profile?: any;
}

interface TestResults {
  loading: boolean;
  tables: {
    material_prices?: TableTestResult;
    system_stats?: TableTestResult;
    user_profiles?: TableTestResult;
    orders?: TableTestResult;
  };
  sampleData: any;
  errors: string[];
}

export default function SupabaseTestPage() {
  const [testResults, setTestResults] = useState<TestResults>({
    loading: true,
    tables: {},
    sampleData: null,
    errors: []
  });

  useEffect(() => {
    runDatabaseTests();
  }, []);

  const runDatabaseTests = async () => {
    const results: TestResults = {
      loading: false,
      tables: {},
      sampleData: null,
      errors: []
    };

    try {
      console.log('🚀 Starting Supabase database tests...');

      // Test 1: Material Prices
      try {
        const startTime = Date.now();
        const prices = await supabaseDataService.getMaterialPrices();
        const endTime = Date.now();
        
        results.tables.material_prices = {
          status: 'success',
          count: prices.length,
          loadTime: endTime - startTime,
          sample: prices.slice(0, 3)
        };
        console.log(`✅ Material Prices: ${prices.length} records in ${endTime - startTime}ms`);
      } catch (error: any) {
        results.tables.material_prices = {
          status: 'error',
          error: error.message
        };
        results.errors.push(`Material Prices: ${error.message}`);
      }

      // Test 2: System Stats (checks multiple tables)
      try {
        const startTime = Date.now();
        const stats = await supabaseDataService.getSystemStats();
        const endTime = Date.now();
        
        results.tables.system_stats = {
          status: 'success',
          stats: stats,
          loadTime: endTime - startTime
        };
        console.log(`✅ System Stats loaded in ${endTime - startTime}ms`);
      } catch (error: any) {
        results.tables.system_stats = {
          status: 'error',
          error: error.message
        };
        results.errors.push(`System Stats: ${error.message}`);
      }

      // Test 3: User Profile (will create sample data if needed)
      try {
        const startTime = Date.now();
        const profile = await supabaseDataService.getUserProfile('test-user-123');
        const endTime = Date.now();
        
        results.tables.user_profiles = {
          status: 'success',
          profile: profile,
          loadTime: endTime - startTime
        };
        console.log(`✅ User Profile loaded in ${endTime - startTime}ms`);
      } catch (error: any) {
        results.tables.user_profiles = {
          status: 'error',
          error: error.message
        };
        results.errors.push(`User Profile: ${error.message}`);
      }

      // Test 4: Orders
      try {
        const startTime = Date.now();
        const orders = await supabaseDataService.getUserOrders('test-user-123');
        const endTime = Date.now();
        
        results.tables.orders = {
          status: 'success',
          count: orders.length,
          loadTime: endTime - startTime,
          sample: orders.slice(0, 2)
        };
        console.log(`✅ Orders: ${orders.length} records in ${endTime - startTime}ms`);
      } catch (error: any) {
        results.tables.orders = {
          status: 'error',
          error: error.message
        };
        results.errors.push(`Orders: ${error.message}`);
      }

      // Test 5: Sample Data Creation
      try {
        await supabaseDataService.insertSampleData('test-user-123', 'user');
        results.sampleData = 'Sample data inserted successfully';
        console.log('✅ Sample data inserted');
      } catch (error: any) {
        results.errors.push(`Sample Data: ${error.message}`);
      }

    } catch (globalError: any) {
      results.errors.push(`Global Error: ${globalError.message}`);
    }

    setTestResults(results);
  };

  if (testResults.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
            <h1 className="text-3xl font-bold text-gray-900 mt-8">Testing Supabase Database</h1>
            <p className="text-gray-600 mt-4">Checking tables and data connectivity...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            🔍 Supabase Database Test Results
          </h1>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-green-600 text-2xl font-bold">
                {Object.values(testResults.tables).filter(t => t.status === 'success').length}
              </div>
              <div className="text-green-800 font-medium">Successful Tests</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-red-600 text-2xl font-bold">
                {testResults.errors.length}
              </div>
              <div className="text-red-800 font-medium">Errors</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-blue-600 text-2xl font-bold">
                {Object.keys(testResults.tables).length}
              </div>
              <div className="text-blue-800 font-medium">Tables Tested</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-6">
            {Object.entries(testResults.tables).map(([tableName, result]) => (
              <div key={tableName} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 capitalize">
                    {tableName.replace('_', ' ')}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.status === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.status}
                  </span>
                </div>

                {result.status === 'success' ? (
                  <div className="space-y-3">
                    {result.loadTime && (
                      <p className="text-sm text-gray-600">
                        ⏱️ Load Time: <span className="font-medium">{result.loadTime}ms</span>
                      </p>
                    )}
                    
                    {result.count !== undefined && (
                      <p className="text-sm text-gray-600">
                        📊 Records: <span className="font-medium">{result.count}</span>
                      </p>
                    )}

                    {result.sample && result.sample.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">📋 Sample Data:</p>
                        <div className="bg-gray-50 rounded p-3 space-y-1">
                          {result.sample.map((item: any, index: number) => (
                            <div key={index} className="text-xs text-gray-700">
                              {tableName === 'material_prices' 
                                ? `• ${item.product}: ${item.price} SAR (${item.store}, ${item.city})`
                                : `• ${JSON.stringify(item).substring(0, 100)}...`
                              }
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.stats && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">📈 Statistics:</p>
                        <div className="bg-gray-50 rounded p-3 grid grid-cols-2 gap-2 text-xs">
                          <div>Users: {result.stats.totalUsers}</div>
                          <div>Stores: {result.stats.totalStores}</div>
                          <div>Providers: {result.stats.totalServiceProviders}</div>
                          <div>Health: {result.stats.systemHealth}%</div>
                        </div>
                      </div>
                    )}

                    {result.profile && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">👤 Profile Data:</p>
                        <div className="bg-gray-50 rounded p-3 text-xs">
                          <div>Name: {result.profile.display_name}</div>
                          <div>City: {result.profile.city}</div>
                          <div>Points: {result.profile.loyalty_points}</div>
                          <div>Spent: {result.profile.total_spent} SAR</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-800 text-sm">❌ {result.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Errors */}
          {testResults.errors.length > 0 && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ Errors Encountered</h3>
              <div className="space-y-2">
                {testResults.errors.map((error, index) => (
                  <p key={index} className="text-red-700 text-sm">• {error}</p>
                ))}
              </div>
            </div>
          )}

          {/* Sample Data Status */}
          {testResults.sampleData && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Sample Data</h3>
              <p className="text-green-700">{testResults.sampleData}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={runDatabaseTests}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              🔄 Re-run Tests
            </button>
            <a
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              🏠 Back to Homepage
            </a>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">📋 Next Steps</h3>
            <div className="text-blue-700 space-y-2 text-sm">
              <p>• If all tests pass: Your database is ready! 🎉</p>
              <p>• If errors occur: Check your Supabase dashboard to create missing tables</p>
              <p>• Visit your Supabase project: <a href="https://qghcdswwagbwqqqtcrfq.supabase.co" target="_blank" className="underline">https://qghcdswwagbwqqqtcrfq.supabase.co</a></p>
              <p>• Use the SQL Editor to run the create-tables.sql script if needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
