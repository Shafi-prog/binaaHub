// Report generation utilities for dashboard
import { ConstructionExpense, Project, Order, Warranty } from '@/types/dashboard';

// Excel export functionality
export async function exportToExcel(data: any[], filename: string, sheetName: string = 'Sheet1') {
  try {
    // We'll use a simple CSV export for now, can be enhanced with xlsx library later
    const csvContent = convertToCSV(data);
    downloadCSV(csvContent, filename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
}

// Convert data to CSV format
function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');

  const csvRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      })
      .join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
}

// Download CSV file
function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// PDF export functionality (basic implementation)
export async function exportToPDF(data: any[], title: string, filename: string) {
  try {
    // For now, we'll create a simple HTML table that can be printed as PDF
    const htmlContent = generatePDFHTML(data, title);
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();

      // Auto print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
}

// Generate HTML for PDF export
function generatePDFHTML(data: any[], title: string): string {
  if (!data || data.length === 0)
    return '<html><body><h1>لا توجد بيانات للتصدير</h1></body></html>';

  const headers = Object.keys(data[0]);

  const headerRow = headers
    .map(
      (header) =>
        `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">${header}</th>`
    )
    .join('');

  const dataRows = data
    .map((row) => {
      const cells = headers
        .map(
          (header) => `<td style="border: 1px solid #ddd; padding: 8px;">${row[header] || ''}</td>`
        )
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 20px;
          direction: rtl;
        }
        h1 {
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        @media print {
          body { margin: 0; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <table>
        <thead>
          <tr>${headerRow}</tr>
        </thead>
        <tbody>
          ${dataRows}
        </tbody>
      </table>
      <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
        تم إنشاء هذا التقرير في ${new Date().toLocaleDateString('ar-SA')}
      </div>
    </body>
    </html>
  `;
}

// Specific report generators
export async function generateExpensesReport(
  expenses: ConstructionExpense[],
  projectName?: string
) {
  const reportData = expenses.map((expense) => ({
    العنوان: expense.title,
    الوصف: expense.description || '',
    المبلغ: `${expense.amount} ${expense.currency}`,
    التاريخ: new Date(expense.expense_date).toLocaleDateString('ar-SA'),
    الفئة: expense.category?.name_ar || '',
    المورد: expense.vendor_name || '',
    'حالة الدفع':
      expense.payment_status === 'paid'
        ? 'مدفوع'
        : expense.payment_status === 'pending'
          ? 'معلق'
          : 'ملغي',
    النوع: expense.is_budgeted ? 'مخطط' : 'طارئ',
  }));

  const title = projectName ? `تقرير مصروفات مشروع ${projectName}` : 'تقرير المصروفات';
  const filename = projectName ? `expenses-${projectName}` : 'expenses-report';

  return { reportData, title, filename };
}

export async function generateProjectsReport(projects: Project[]) {
  const reportData = projects.map((project) => ({
    'اسم المشروع': project.name,
    الوصف: project.description || '',
    النوع: project.project_type,
    الموقع: project.location,
    الحالة: getProjectStatusAr(project.status),
    'نسبة الإنجاز': `${project.progress_percentage}%`,
    'الميزانية المقدرة': project.budget_estimate
      ? `${project.budget_estimate} ${project.currency}`
      : '',
    'التكلفة الفعلية': `${project.actual_cost} ${project.currency}`,
    'تاريخ البدء': project.start_date
      ? new Date(project.start_date).toLocaleDateString('ar-SA')
      : '',
    'تاريخ الإنجاز المتوقع': project.expected_completion_date
      ? new Date(project.expected_completion_date).toLocaleDateString('ar-SA')
      : '',
    الأولوية: getPriorityAr(project.priority),
  }));

  return {
    reportData,
    title: 'تقرير المشاريع',
    filename: 'projects-report',
  };
}

export async function generateOrdersReport(orders: Order[]) {
  const reportData = orders.map((order) => ({
    'رقم الطلب': order.order_number,
    المتجر: order.store?.store_name || '',
    'إجمالي المبلغ': `${order.total_amount} ${order.currency}`,
    الحالة: getOrderStatusAr(order.status),
    'حالة الدفع':
      order.payment_status === 'paid'
        ? 'مدفوع'
        : order.payment_status === 'pending'
          ? 'معلق'
          : order.payment_status === 'failed'
            ? 'فشل'
            : 'مُسترد',
    'تاريخ الطلب': new Date(order.created_at).toLocaleDateString('ar-SA'),
    'تاريخ التسليم المتوقع': order.estimated_delivery_date
      ? new Date(order.estimated_delivery_date).toLocaleDateString('ar-SA')
      : '',
    'عنوان التسليم': order.delivery_address || '',
    المدينة: order.delivery_city || '',
  }));

  return {
    reportData,
    title: 'تقرير الطلبات',
    filename: 'orders-report',
  };
}

export async function generateWarrantiesReport(warranties: Warranty[]) {
  const reportData = warranties.map((warranty) => ({
    'رقم الضمان': warranty.warranty_number,
    'اسم المنتج': warranty.product_name,
    'العلامة التجارية': warranty.brand || '',
    الموديل: warranty.model || '',
    'تاريخ الشراء': new Date(warranty.purchase_date).toLocaleDateString('ar-SA'),
    'تاريخ بداية الضمان': new Date(warranty.warranty_start_date).toLocaleDateString('ar-SA'),
    'تاريخ انتهاء الضمان': new Date(warranty.warranty_end_date).toLocaleDateString('ar-SA'),
    'مدة الضمان': `${warranty.warranty_period_months} شهر`,
    'نوع الضمان': getWarrantyTypeAr(warranty.warranty_type),
    الحالة: getWarrantyStatusAr(warranty.status),
    'عدد المطالبات': warranty.claim_count.toString(),
    المورد: warranty.vendor_name || '',
    'قابل للنقل': warranty.is_transferable ? 'نعم' : 'لا',
  }));

  return {
    reportData,
    title: 'تقرير الضمانات',
    filename: 'warranties-report',
  };
}

// Helper functions for Arabic translations
function getProjectStatusAr(status: string): string {
  const statusMap: Record<string, string> = {
    planning: 'التخطيط',
    design: 'التصميم',
    permits: 'التصاريح',
    construction: 'قيد الإنشاء',
    finishing: 'اللمسات الأخيرة',
    completed: 'مكتمل',
    on_hold: 'متوقف مؤقتاً',
  };
  return statusMap[status] || status;
}

function getOrderStatusAr(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'في الانتظار',
    confirmed: 'مؤكد',
    processing: 'قيد المعالجة',
    shipped: 'تم الشحن',
    delivered: 'تم التسليم',
    cancelled: 'ملغي',
    returned: 'مُرتجع',
  };
  return statusMap[status] || status;
}

function getWarrantyStatusAr(status: string): string {
  const statusMap: Record<string, string> = {
    active: 'نشط',
    expired: 'منتهي الصلاحية',
    claimed: 'تم المطالبة',
    void: 'ملغي',
    transferred: 'محول',
  };
  return statusMap[status] || status;
}

function getWarrantyTypeAr(type: string): string {
  const typeMap: Record<string, string> = {
    manufacturer: 'ضمان الشركة المصنعة',
    extended: 'ضمان ممتد',
    store: 'ضمان المتجر',
    custom: 'ضمان مخصص',
  };
  return typeMap[type] || type;
}

function getPriorityAr(priority: string): string {
  const priorityMap: Record<string, string> = {
    low: 'منخفض',
    medium: 'متوسط',
    high: 'عالي',
    urgent: 'عاجل',
  };
  return priorityMap[priority] || priority;
}
