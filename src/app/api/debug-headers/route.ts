import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get all headers
  const headers = Object.fromEntries(request.headers.entries());
  
  // Get all cookies
  const cookies = request.cookies.getAll();
  const cookieData = cookies.map(cookie => ({
    name: cookie.name,
    value: cookie.value.substring(0, 20) + '...' // Truncate for security
  }));
  
  // Return headers and cookies for debugging
  return NextResponse.json({
    headers,
    cookies: cookieData,
    cookieCount: cookies.length,
    url: request.url,
    method: request.method
  });
}
