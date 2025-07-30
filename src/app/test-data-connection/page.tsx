"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function DataTestPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testDataConnection();
  }, []);

  const testDataConnection = async () => {
    try {
      console.log('🧪 Testing direct Supabase connection from frontend...');
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // Get current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Session:', { sessionData, sessionError });
      
      const userId = sessionData?.session?.user?.id;
      console.log('Current user ID:', userId);

      if (!userId) {
        setError('No authenticated user found');
        setLoading(false);
        return;
      }

      // Test all data queries directly
      console.log('📡 Testing profile query...');
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('Profile result:', { profileData, profileError });

      console.log('📡 Testing projects query...');
      const { data: projectsData, error: projectsError } = await supabase
        .from('construction_projects')
        .select('*')
        .eq('user_id', userId);

      console.log('Projects result:', { count: projectsData?.length, projectsError });

      console.log('📡 Testing orders query...');
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);

      console.log('Orders result:', { count: ordersData?.length, ordersError });

      console.log('📡 Testing warranties query...');
      const { data: warrantiesData, error: warrantiesError } = await supabase
        .from('warranties')
        .select('*')
        .eq('user_id', userId);

      console.log('Warranties result:', { count: warrantiesData?.length, warrantiesError });

      setData({
        userId,
        profile: profileData,
        projects: projectsData || [],
        orders: ordersData || [],
        warranties: warrantiesData || [],
        errors: {
          profile: profileError,
          projects: projectsError,
          orders: ordersError,
          warranties: warrantiesError
        }
      });

    } catch (error) {
      console.error('❌ Test failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🧪 Testing Data Connection...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">❌ Test Failed</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">🧪 اختبار اتصال البيانات</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">👤 معلومات المستخدم</h2>
          <p><strong>User ID:</strong> <span className="font-mono text-sm">{data.userId}</span></p>
          {data.profile ? (
            <div className="mt-4">
              <p><strong>الاسم:</strong> {data.profile.display_name}</p>
              <p><strong>البريد:</strong> {data.profile.email}</p>
              <p><strong>نقاط الولاء:</strong> {data.profile.loyalty_points}</p>
              <p><strong>إجمالي الإنفاق:</strong> {data.profile.total_spent} ر.س</p>
            </div>
          ) : (
            <p className="text-red-500 mt-4">❌ لم يتم العثور على الملف الشخصي</p>
          )}
        </div>

        {/* Stats */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">📊 إحصائيات البيانات</h2>
          <div className="space-y-2">
            <p>🏠 <strong>المشاريع:</strong> {data.projects.length}</p>
            <p>🛒 <strong>الطلبات:</strong> {data.orders.length}</p>
            <p>🛡️ <strong>الضمانات:</strong> {data.warranties.length}</p>
          </div>
          
          {data.projects.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold">حالة المشاريع:</p>
              <ul className="mt-2 space-y-1">
                {data.projects.map((project: any, index: number) => (
                  <li key={index} className="text-sm">
                    • {project.project_name || project.name} ({project.status})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Errors */}
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">⚠️ الأخطاء</h2>
          {Object.entries(data.errors).map(([key, error]: [string, any]) => (
            <div key={key} className="mb-2">
              <strong>{key}:</strong> {error ? (
                <span className="text-red-500">{error.message}</span>
              ) : (
                <span className="text-green-500">✅ نجح</span>
              )}
            </div>
          ))}
        </div>

        {/* Raw Data */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">🔍 البيانات الخام</h2>
          <pre className="text-xs overflow-auto max-h-64 bg-white p-4 rounded border">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            testDataConnection();
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          🔄 إعادة الاختبار
        </button>
      </div>
    </div>
  );
}
