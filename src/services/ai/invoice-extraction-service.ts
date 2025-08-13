// Lightweight Arabic Invoice Extraction service (mock). Replace with real OCR + extraction.
export interface InvoiceLineItem { description: string; quantity?: number; unit_price?: number; amount: number }
export interface InvoiceExtraction { invoice_number?: string; date?: string; vendor_name?: string; vendor_tax_id?: string; total?: number; subtotal?: number; tax?: number; tax_rate?: number; currency?: string; line_items?: InvoiceLineItem[]; ocr_text?: string }

export async function extractInvoice(_: File): Promise<InvoiceExtraction> {
  return {
    invoice_number: 'INV-PLACEHOLDER-001',
    date: new Date().toISOString().slice(0, 10),
    vendor_name: 'Sample Vendor',
    vendor_tax_id: '123456789012345',
    currency: 'SAR',
    subtotal: 100,
    tax_rate: 15,
    tax: 15,
    total: 115,
    line_items: [
      { description: 'Sample Item', quantity: 1, unit_price: 100, amount: 100 }
    ],
    ocr_text: 'Mock OCR content. Integrate real OCR later.'
  }
}
