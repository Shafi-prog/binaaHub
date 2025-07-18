// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { erpService } from '@/core/shared/services/erp-integration/service';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const dateRange = searchParams.get('dateRange') || '30'; // days
    const currency = searchParams.get('currency') || 'USD';

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(dateRange));

    // Get analytics data
    const analytics = await erpService.getStoreAnalytics(storeId, {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      currency
    });

    // Get financial metrics
    const financialMetrics = await erpService.getFinancialMetrics(storeId, {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });

    // Get sales analytics
    const salesAnalytics = await erpService.getSalesAnalytics(storeId, {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });

    // Get inventory analytics
    const inventoryAnalytics = await erpService.getInventoryAnalytics(storeId);

    // Get customer analytics
    const customerAnalytics = await erpService.getCustomerAnalytics(storeId, {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });

    return NextResponse.json({
      success: true,
      data: {
        overview: analytics,
        financialMetrics,
        salesAnalytics,
        inventoryAnalytics,
        customerAnalytics,
        period: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          days: parseInt(dateRange)
        }
      }
    });

  } catch (error) {
    console.error('Get Analytics Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, reportType, filters, ...options } = body;

    if (!storeId || !reportType) {
      return NextResponse.json(
        { error: 'Store ID and report type are required' },
        { status: 400 }
      );
    }

    let reportData;    switch (reportType) {
      case 'sales-summary':
        reportData = await erpService.generateSalesReport({
          startDate: filters.from_date,
          endDate: filters.to_date,
          format: 'json'
        });
        break;
      case 'inventory-valuation':
        reportData = await erpService.generateInventoryReport({
          includeValuation: true,
          format: 'json'
        });
        break;
      case 'customer-statement':
        reportData = await erpService.generateCustomerReport({
          includeTransactions: true,
          format: 'json'
        });
        break;
      case 'profit-loss':
        reportData = await erpService.generateProfitabilityReport({
          startDate: filters.from_date,
          endDate: filters.to_date,
          format: 'json'
        });
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: reportData,
      message: `${reportType} report generated successfully`
    });

  } catch (error) {
    console.error('Generate Report Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


