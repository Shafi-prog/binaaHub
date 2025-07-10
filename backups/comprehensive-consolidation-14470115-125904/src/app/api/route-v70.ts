// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

// Mock database operations - replace with real database calls
const progressUpdates: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, projectId, progressData, imageUrl, timestamp } = body;

    if (!userId || !projectId || !progressData) {
      return NextResponse.json(
        { error: 'بيانات التقدم غير مكتملة' },
        { status: 400 }
      );
    }

    // Create progress update record
    const progressUpdate = {
      id: `progress_${Date.now()}`,
      userId,
      projectId,
      progressPercentage: progressData.progressPercentage,
      qualityScore: progressData.qualityScore,
      detectedElements: progressData.detectedElements,
      recommendations: progressData.recommendations,
      progressChange: progressData.progressChange,
      areasChanged: progressData.areasChanged,
      imageUrl,
      timestamp: timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Store in mock database
    progressUpdates.push(progressUpdate);

    // In production, save to real database:
    // await db.constructionProgress.create({ data: progressUpdate });

    return NextResponse.json({
      success: true,
      progressUpdate,
      message: 'تم حفظ تحديث التقدم بنجاح'
    });

  } catch (error) {
    console.error('Error saving progress update:', error);
    return NextResponse.json(
      { error: 'فشل في حفظ تحديث التقدم' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const projectId = searchParams.get('projectId');

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    // Filter progress updates
    let filteredUpdates = progressUpdates.filter(update => update.userId === userId);
    
    if (projectId) {
      filteredUpdates = filteredUpdates.filter(update => update.projectId === projectId);
    }

    // Sort by timestamp (most recent first)
    filteredUpdates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // In production, fetch from real database:
    // const filteredUpdates = await db.constructionProgress.findMany({
    //   where: { userId, ...(projectId && { projectId }) },
    //   orderBy: { timestamp: 'desc' }
    // });

    return NextResponse.json({
      success: true,
      progressUpdates: filteredUpdates,
      count: filteredUpdates.length
    });

  } catch (error) {
    console.error('Error fetching progress updates:', error);
    return NextResponse.json(
      { error: 'فشل في جلب تحديثات التقدم' },
      { status: 500 }
    );
  }
}


