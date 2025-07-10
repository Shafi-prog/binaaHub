// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Mock AI processing - In production, integrate with Paperless-ngx + OpenAI
async function processReceiptWithAI(fileBuffer: Buffer, fileName: string): Promise<any> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock AI extraction results
  const mockResults = [
    {
      vendor: "محل الصالحي لمواد البناء",
      amount: 2450.00,
      date: "2025-06-14",
      category: "مواد البناء",
      items: ["أسمنت بورتلاند 50 كيس", "حديد تسليح 12 مم", "رمل أبيض 5 متر مكعب"],
      confidence: 0.94
    },
    {
      vendor: "مؤسسة النجار للأدوات",
      amount: 890.50,
      date: "2025-06-14", 
      category: "أدوات ومعدات",
      items: ["مثقاب كهربائي", "مفكات متنوعة", "شريط قياس"],
      confidence: 0.87
    },
    {
      vendor: "مطعم الزعفران",
      amount: 125.00,
      date: "2025-06-14",
      category: "وجبات العمال",
      items: ["وجبة غداء × 5", "مشروبات", "خدمة التوصيل"],
      confidence: 0.91
    }
  ];

  // Return random result for demo
  return mockResults[Math.floor(Math.random() * mockResults.length)];
}

// Real AI processing function (for production)
async function processWithOpenAI(extractedText: string): Promise<any> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `أنت نظام ذكي لاستخراج بيانات الفواتير والإيصالات. استخرج المعلومات التالية من النص باللغة العربية واستخرجها بتنسيق JSON:
          {
            "vendor": "اسم المورد أو المتجر",
            "amount": رقم المبلغ الإجمالي,
            "date": "التاريخ بتنسيق YYYY-MM-DD",
            "category": "فئة المصروف (مواد البناء، أدوات، وجبات، إلخ)",
            "items": ["قائمة بالعناصر المشتراة"],
            "confidence": رقم من 0 إلى 1 يمثل مستوى الثقة في الاستخراج
          }`
        },
        {
          role: 'user',
          content: extractedText
        }
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to process with OpenAI');
  }

  const result = await response.json();
  return JSON.parse(result.choices[0].message.content);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'لم يتم تحديد ملف' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'receipts');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save uploaded file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileName = `${userId}-${Date.now()}-${file.name}`;
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Process with AI
    let expenseData;
    
    if (process.env.NODE_ENV === 'production' && process.env.OPENAI_API_KEY) {
      // Production: Use real AI processing
      // First, extract text using OCR (Tesseract or Paperless-ngx)
      const extractedText = await extractTextFromFile(buffer, file.type);
      expenseData = await processWithOpenAI(extractedText);
    } else {
      // Development: Use mock AI processing
      expenseData = await processReceiptWithAI(buffer, fileName);
    }

    // Store in database (implement your database logic here)
    await storeProcessedReceipt(userId, fileName, expenseData);

    return NextResponse.json({
      success: true,
      expenseData,
      fileName,
      message: 'تم معالجة الفاتورة بنجاح'
    });

  } catch (error) {
    console.error('Receipt processing error:', error);
    return NextResponse.json(
      { error: 'فشل في معالجة الفاتورة' },
      { status: 500 }
    );
  }
}

// OCR text extraction (implement with Tesseract.js or similar)
async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  // For demo, return mock text
  return `
  فاتورة رقم: 2025001
  التاريخ: 14/06/2025
  محل الصالحي لمواد البناء
  العنوان: الرياض، المملكة العربية السعودية
  
  أسمنت بورتلاند 50 كيس × 15 ريال = 750 ريال
  حديد تسليح 12 مم × 5 طن × 300 ريال = 1500 ريال  
  رمل أبيض 5 متر مكعب × 40 ريال = 200 ريال
  
  المجموع الفرعي: 2450 ريال
  ضريبة القيمة المضافة (15%): 367.50 ريال
  المجموع الإجمالي: 2817.50 ريال
  `;
}

// Database storage function
async function storeProcessedReceipt(userId: string, fileName: string, expenseData: any): Promise<void> {
  // Implement database storage logic here
  // For now, just log to console
  console.log('Storing processed receipt:', {
    userId,
    fileName,
    expenseData,
    timestamp: new Date().toISOString()
  });
}


