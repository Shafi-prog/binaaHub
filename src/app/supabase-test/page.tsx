'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SupabaseTestResult {
  connectionStatus: string;
  tables: string[];
  sampleQueries: Record<string, any>;
  errors: string[];
}

export default function SupabaseTestPage() {
  const [result, setResult] = useState<SupabaseTestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testSupabase = async () => {
      const supabase = createClientComponentClient();
      const errors: string[] = [];
      let connectionStatus = 'Unknown';
      let tables: string[] = [];      const sampleQueries: Record<string, any> = {
        products: null,
        erp_orders: null,
        users: null
      };

      try {
        // Test basic connection
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) {
          errors.push(`Auth error: ${authError.message}`);
          connectionStatus = 'Auth Failed';
        } else {
          connectionStatus = authData.user ? 'Authenticated' : 'Not Authenticated';
        }

        // Test table access
        const tablesToTest = ['products', 'erp_orders', 'users'];
        
        for (const table of tablesToTest) {
          try {
            const { data, error } = await supabase
              .from(table)
              .select('*')
              .limit(1);
            
            if (error) {
              errors.push(`${table}: ${error.message}`);
            } else {
              tables.push(table);
              sampleQueries[table as keyof typeof sampleQueries] = data;
            }
          } catch (err) {
            errors.push(`${table}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        }

        setResult({
          connectionStatus,
          tables,
          sampleQueries,
          errors
        });
      } catch (error) {
        errors.push(`General error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setResult({
          connectionStatus: 'Failed',
          tables: [],
          sampleQueries,
          errors
        });
      } finally {
        setLoading(false);
      }
    };

    testSupabase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Testing Supabase connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Database Test</h1>
        
        {/* Connection Status */}
        <div className={`p-4 rounded-lg mb-6 ${
          result?.connectionStatus === 'Authenticated' ? 'bg-green-100 text-green-800' :
          result?.connectionStatus === 'Not Authenticated' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          <strong>Connection Status:</strong> {result?.connectionStatus}
        </div>

        {/* Available Tables */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Available Tables ({result?.tables.length || 0})</h2>
          {result?.tables.length ? (
            <div className="flex flex-wrap gap-2">
              {result.tables.map(table => (
                <span key={table} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {table}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tables accessible</p>
          )}
        </div>

        {/* Sample Queries */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Sample Query Results</h2>
          <div className="space-y-4">
            {Object.entries(result?.sampleQueries || {}).map(([table, data]) => (
              <div key={table}>
                <h3 className="font-medium text-gray-900">{table}</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm mt-1 overflow-auto max-h-40">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Errors */}
        {result?.errors.length ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-red-800 mb-4">Errors ({result.errors.length})</h2>
            <div className="space-y-2">
              {result.errors.map((error, index) => (
                <div key={index} className="text-red-700 text-sm font-mono">
                  {error}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <p className="text-green-800">✅ No errors detected!</p>
          </div>
        )}
        
        <div className="text-center">
          <a 
            href="/store/dashboard" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Store Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
