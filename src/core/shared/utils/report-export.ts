// Simple report export utilities for PDF and Excel (with graceful fallback to CSV)
// Client-side only
import { saveAs } from 'file-saver';

export type ReportTopProduct = {
  product_name: string;
  quantity: number;
  sales: number;
};

export type ReportSummary = {
  periodLabel: string;
  customerName?: string;
  totalSales: number;
  ordersCount: number;
  customersCount: number;
  topProducts: ReportTopProduct[];
};

export async function exportReportToPDF(summary: ReportSummary) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'p', unit: 'pt' });

  const marginX = 40;
  let y = 50;

  doc.setFontSize(16);
  doc.text('تقارير BinaaHub', marginX, y);
  y += 24;

  doc.setFontSize(12);
  doc.text(`الفترة: ${summary.periodLabel}`, marginX, y); y += 18;
  if (summary.customerName) {
    doc.text(`العميل: ${summary.customerName}`, marginX, y); y += 18;
  }
  doc.text(`إجمالي المبيعات: ${formatCurrency(summary.totalSales)}`, marginX, y); y += 18;
  doc.text(`عدد الطلبات: ${summary.ordersCount}`, marginX, y); y += 18;
  doc.text(`عدد العملاء: ${summary.customersCount}`, marginX, y); y += 24;

  // Top products table (simple rendering without autotable)
  doc.setFontSize(14);
  doc.text('أفضل المنتجات', marginX, y); y += 16;
  doc.setFontSize(11);
  // headers
  const colX = [marginX, marginX + 250, marginX + 360];
  doc.text('المنتج', colX[0], y);
  doc.text('الكمية', colX[1], y);
  doc.text('المبيعات', colX[2], y);
  y += 12;
  doc.setLineWidth(0.5);
  doc.line(marginX, y, marginX + 450, y);
  y += 10;

  const rows = summary.topProducts.slice(0, 20);
  for (const r of rows) {
    if (y > 760) { // new page
      doc.addPage();
      y = 50;
    }
    doc.text(r.product_name || '-', colX[0], y, { maxWidth: 240 });
    doc.text(String(r.quantity ?? 0), colX[1], y);
    doc.text(formatCurrency(r.sales ?? 0), colX[2], y);
    y += 16;
  }

  doc.save(`binaahub-report-${Date.now()}.pdf`);
}

export async function exportReportToExcel(summary: ReportSummary) {
  // Try to use xlsx if available; otherwise, fallback to CSV
  try {
    const xlsx: any = await import('xlsx');
    const wb = xlsx.utils.book_new();

    const overview = [
      { الحقل: 'الفترة', القيمة: summary.periodLabel },
      { الحقل: 'العميل', القيمة: summary.customerName || '-' },
      { الحقل: 'إجمالي المبيعات', القيمة: summary.totalSales },
      { الحقل: 'عدد الطلبات', القيمة: summary.ordersCount },
      { الحقل: 'عدد العملاء', القيمة: summary.customersCount },
    ];
    const wsOverview = xlsx.utils.json_to_sheet(overview);
    xlsx.utils.book_append_sheet(wb, wsOverview, 'نظرة عامة');

    const topProducts = summary.topProducts.map(p => ({
      المنتج: p.product_name,
      الكمية: p.quantity,
      المبيعات: p.sales,
    }));
    const wsTop = xlsx.utils.json_to_sheet(topProducts);
    xlsx.utils.book_append_sheet(wb, wsTop, 'أفضل المنتجات');

    const wbout = xlsx.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `binaahub-report-${Date.now()}.xlsx`);
  } catch (e) {
    // Fallback: generate CSV compatible with Excel
    const lines: string[] = [];
    lines.push('الفترة,العميل,إجمالي المبيعات,عدد الطلبات,عدد العملاء');
    lines.push(`${escapeCsv(summary.periodLabel)},${escapeCsv(summary.customerName || '-')},${summary.totalSales},${summary.ordersCount},${summary.customersCount}`);
    lines.push('');
    lines.push('أفضل المنتجات');
    lines.push('المنتج,الكمية,المبيعات');
    for (const p of summary.topProducts) {
      lines.push(`${escapeCsv(p.product_name)},${p.quantity},${p.sales}`);
    }
    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `binaahub-report-${Date.now()}.csv`);
  }
}

function formatCurrency(n: number) {
  try {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(Number(n || 0));
  } catch {
    return `${Number(n || 0).toFixed(2)} SAR`;
  }
}

function escapeCsv(v: string) {
  if (v == null) return '';
  const needsQuotes = /[",\n]/.test(v);
  const escaped = v.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}
