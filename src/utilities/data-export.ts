// utilities/data-export.ts
/**
 * Utility for exporting data to CSV format
 */

type ExportOptions = {
  filename: string;
  delimiter?: string;
}

/**
 * Exports data to CSV and triggers a download
 * @param data Array of objects to export
 * @param options Export options including filename and delimiter
 */
export function exportToCSV(data: Record<string, any>[], options: ExportOptions): void {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  const delimiter = options.delimiter || ',';
  const filename = options.filename || 'export.csv';
  
  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(delimiter),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values with commas, quotes, etc.
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && (value.includes(delimiter) || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        return value;
      }).join(delimiter)
    )
  ].join('\n');
  
  // Create a blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create download URL
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}