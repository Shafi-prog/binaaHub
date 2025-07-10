// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const envStatus = {
    NODE_ENV: process.env.NODE_ENV,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    platform: process.env.VERCEL ? 'Vercel' : 'Local',
    vercelUrl: process.env.VERCEL_URL,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json({
    status: 'Environment Check',
    environment: envStatus,
    loginEndpoints: [
      '/api/auth/simple-login',
      '/api/auth/local-login',
      '/api/auth/login-db',
      '/api/auth/login'
    ],
    recommendations: {
      missingEnvVars: [
        !envStatus.hasSupabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL',
        !envStatus.hasSupabaseAnonKey && 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        !envStatus.hasSupabaseServiceKey && 'SUPABASE_SERVICE_ROLE_KEY',
        !envStatus.hasDatabaseUrl && 'DATABASE_URL'
      ].filter(Boolean)
    }
  });
}
