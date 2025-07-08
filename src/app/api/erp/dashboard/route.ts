// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { initERPService } from '@/lib/erp/mongodb-service';

export async function GET(request: NextRequest) {
  try {
    const erpService = await initERPService();
    const stats = await erpService.getDashboardStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}


