import { NextRequest, NextResponse } from 'next/server'

interface InvoiceLineItem { description: string; quantity?: number; unit_price?: number; amount: number }
interface InvoiceExtraction { invoice_number?: string; date?: string; vendor_name?: string; vendor_tax_id?: string; total?: number; subtotal?: number; tax?: number; tax_rate?: number; currency?: string; line_items?: InvoiceLineItem[]; ocr_text?: string }

// Minimal mock endpoint to accept a file and return stubbed extraction
export async function POST(req: NextRequest) {
  try {
    // Next.js 13/14: for multipart, clone the request and parse formData
    const form = await req.formData()
    const file = form.get('invoice') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded. Use field name "invoice"' }, { status: 400 })
    }

    const result: InvoiceExtraction = {
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

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to extract invoice', details: String(err?.message || err) }, { status: 400 })
  }
}
