// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { erpService } from '@/core/shared/services/erp-integration/service';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type');
    const format = searchParams.get('format') || 'json';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const storeId = searchParams.get('storeId');

    if (!reportType) {
      return NextResponse.json(
        { error: 'Report type is required' },
        { status: 400 }
      );
    }

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    const options = {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      format: format as 'json' | 'csv' | 'pdf'
    };

    let report;

    switch (reportType) {
      case 'sales':
        report = await erpService.generateSalesReport(options);
        break;
      
      case 'inventory':
        report = await erpService.generateInventoryReport({
          ...options,
          includeValuation: searchParams.get('includeValuation') === 'true',
          lowStockOnly: searchParams.get('lowStockOnly') === 'true'
        });
        break;
      
      case 'customers':
        report = await erpService.generateCustomerReport({
          ...options,
          includeTransactions: searchParams.get('includeTransactions') === 'true',
          activeOnly: searchParams.get('activeOnly') === 'true'
        });
        break;
      
      case 'profitability':
        report = await erpService.generateProfitabilityReport({
          ...options,
          groupBy: searchParams.get('groupBy') as 'item' | 'customer' | 'territory' | undefined
        });
        break;
      
      case 'performance':
        report = await erpService.generatePerformanceReport(options);
        break;
      
      case 'taxes':
        report = await erpService.generateTaxReport({
          ...options,
          taxType: searchParams.get('taxType') as 'VAT' | 'all' | undefined
        });
        break;
      
      default:
        return NextResponse.json(
          { error: `Unknown report type: ${reportType}` },
          { status: 400 }
        );
    }

    // If format is CSV, return as text
    if (format === 'csv' && typeof report === 'string') {
      return new NextResponse(report, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${reportType}-report-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    return NextResponse.json(report);

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate report' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { reportType, options, storeId } = await request.json();

    if (!reportType || !storeId) {
      return NextResponse.json(
        { error: 'Report type and store ID are required' },
        { status: 400 }
      );
    }

    let report;

    switch (reportType) {
      case 'sales':
        report = await erpService.generateSalesReport(options);
        break;
      
      case 'inventory':
        report = await erpService.generateInventoryReport(options);
        break;
      
      case 'customers':
        report = await erpService.generateCustomerReport(options);
        break;
      
      case 'profitability':
        report = await erpService.generateProfitabilityReport(options);
        break;
      
      case 'performance':
        report = await erpService.generatePerformanceReport(options);
        break;
      
      case 'taxes':
        report = await erpService.generateTaxReport(options);
        break;
      
      default:
        return NextResponse.json(
          { error: `Unknown report type: ${reportType}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      report
    });

  } catch (error) {
    console.error('Error generating custom report:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate report' },
      { status: 500 }
    );
  }
}


