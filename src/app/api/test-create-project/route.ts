import { NextRequest, NextResponse } from 'next/server';
import { createProject } from '@/lib/api/dashboard';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createProject(body);
    return NextResponse.json({ success: true, project: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || error.toString() }, { status: 500 });
  }
}
