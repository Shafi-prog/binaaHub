import { formatDate } from '@/lib/utils';
import { BalanceTransaction, CommissionRecord, WarrantyRecord } from '@/types/balance-management';

/**
 * Generate CSV content from transactions data
 */
export function generateTransactionsCsv(transactions: BalanceTransaction[]): string {
  // CSV headers
  const headers = [
    'Transaction ID',
    'Date',
    'Type',
    'Amount',
    'Currency',
    'Status',
    'Description',
    'Payment Method',
    'Reference'
  ].join(',');
  
  // CSV rows
  const rows = transactions.map(t => [
    t.id,
    formatDate(t.transaction_date),
    t.transaction_type,
    t.amount,
    t.currency,
    t.status,
    `"${t.description || ''}"`, // Wrap in quotes to handle commas
    t.payment_method || '',
    t.reference_id || ''
  ].join(','));
  
  // Combine headers and rows
  return [headers, ...rows].join('\n');
}

/**
 * Generate CSV content from commissions data
 */
export function generateCommissionsCsv(commissions: CommissionRecord[]): string {
  // CSV headers
  const headers = [
    'Commission ID',
    'Supervisor ID',
    'User ID',
    'Project ID',
    'Type',
    'Base Amount',
    'Percentage',
    'Commission Amount',
    'Currency',
    'Status',
    'Created Date',
    'Payment Date',
    'Description'
  ].join(',');
  
  // CSV rows
  const rows = commissions.map(c => [
    c.id,
    c.supervisor_id,
    c.user_id,
    c.project_id,
    c.commission_type,
    c.base_amount,
    c.percentage,
    c.amount,
    c.currency,
    c.status,
    formatDate(c.created_at),
    c.payment_date ? formatDate(c.payment_date) : '',
    `"${c.description || ''}"` // Wrap in quotes to handle commas
  ].join(','));
  
  // Combine headers and rows
  return [headers, ...rows].join('\n');
}

/**
 * Generate CSV content from warranties data
 */
export function generateWarrantiesCsv(warranties: WarrantyRecord[]): string {
  // CSV headers
  const headers = [
    'Warranty ID',
    'Project ID',
    'Item Name',
    'Vendor Name',
    'Vendor Contact',
    'Purchase Date',
    'Warranty Start',
    'Warranty End',
    'Status',
    'Registered By',
    'Claim Date',
    'Warranty Terms'
  ].join(',');
  
  // CSV rows
  const rows = warranties.map(w => [
    w.id,
    w.project_id,
    `"${w.item_name}"`, // Wrap in quotes to handle commas
    `"${w.vendor_name || ''}"`,
    `"${w.vendor_contact || ''}"`,
    formatDate(w.purchase_date),
    formatDate(w.warranty_start_date),
    formatDate(w.warranty_end_date),
    w.status,
    w.registered_by,
    w.claim_date ? formatDate(w.claim_date) : '',
    `"${w.warranty_terms || ''}"` // Wrap in quotes to handle commas
  ].join(','));
  
  // Combine headers and rows
  return [headers, ...rows].join('\n');
}

/**
 * Download CSV data as a file
 */
export function downloadCsv(csvContent: string, fileName: string): void {
  // Create blob with CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  
  // Support for browsers with URL.createObjectURL
  if (window.URL && window.URL.createObjectURL) {
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }
  
  // Fallback for older browsers
  link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
  link.target = '_blank';
  link.download = fileName;
  link.click();
}

/**
 * Generate and download transactions CSV
 */
export function exportTransactions(transactions: BalanceTransaction[], fileName: string = 'transactions.csv'): void {
  const csvContent = generateTransactionsCsv(transactions);
  downloadCsv(csvContent, fileName);
}

/**
 * Generate and download commissions CSV
 */
export function exportCommissions(commissions: CommissionRecord[], fileName: string = 'commissions.csv'): void {
  const csvContent = generateCommissionsCsv(commissions);
  downloadCsv(csvContent, fileName);
}

/**
 * Generate and download warranties CSV
 */
export function exportWarranties(warranties: WarrantyRecord[], fileName: string = 'warranties.csv'): void {
  const csvContent = generateWarrantiesCsv(warranties);
  downloadCsv(csvContent, fileName);
}
