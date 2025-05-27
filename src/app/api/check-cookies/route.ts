import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get all cookies from the request
  const allCookies = request.cookies.getAll();
  
  // Check for specific cookies
  const hasSbAccessToken = !!allCookies.find(cookie => cookie.name === 'sb-access-token');
  const hasAccessToken = !!allCookies.find(cookie => cookie.name === 'access_token');
  const hasSbRefreshToken = !!allCookies.find(cookie => cookie.name === 'sb-refresh-token');
  
  // Get all cookie names for debugging
  const cookieNames = allCookies.map(cookie => cookie.name);
  
  // Return the cookie check results
  return NextResponse.json({
    hasSbAccessToken,
    hasAccessToken,
    hasSbRefreshToken,
    cookieNames,
    cookieCount: allCookies.length
  });
}
