import { NextRequest, NextResponse } from 'next/server';

// Mock database for construction estimates
const constructionEstimates: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, projectSpecs, estimate, createdAt } = body;

    if (!userId || !projectSpecs || !estimate) {
      return NextResponse.json(
        { error: 'بيانات التقدير غير مكتملة' },
        { status: 400 }
      );
    }

    // Create estimate record
    const estimateRecord = {
      id: `estimate_${Date.now()}`,
      userId,
      projectSpecs,
      estimate,
      createdAt: createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in mock database
    constructionEstimates.push(estimateRecord);

    // In production, save to real database:
    // await db.constructionEstimates.create({ data: estimateRecord });

    return NextResponse.json({
      success: true,
      estimateRecord,
      message: 'تم حفظ التقدير بنجاح'
    });

  } catch (error) {
    console.error('Error saving construction estimate:', error);
    return NextResponse.json(
      { error: 'فشل في حفظ التقدير' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    // Filter estimates by user
    const userEstimates = constructionEstimates.filter(est => est.userId === userId);

    // Sort by creation date (most recent first)
    userEstimates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // In production, fetch from real database:
    // const userEstimates = await db.constructionEstimates.findMany({
    //   where: { userId },
    //   orderBy: { createdAt: 'desc' }
    // });

    return NextResponse.json({
      success: true,
      estimates: userEstimates,
      count: userEstimates.length
    });

  } catch (error) {
    console.error('Error fetching construction estimates:', error);
    return NextResponse.json(
      { error: 'فشل في جلب التقديرات' },
      { status: 500 }
    );
  }
}
