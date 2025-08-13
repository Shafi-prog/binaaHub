AI Replacement Endpoints

- POST /api/ai/advice
  Body: { projectType, constructionPhase, location, budget?, soilType?, specificQuestion? }
  Returns: Advice { text_en, text_ar, sbcReferences, ... }

- POST /api/ai/invoice-extract
  Multipart form-data with field name: invoice (File)
  Returns: InvoiceExtraction { invoice_number, date, vendor_name, total, line_items, ... }

Note: Current implementations are mock and safe. Integrate real OCR (tesseract.js) and domain logic later.
