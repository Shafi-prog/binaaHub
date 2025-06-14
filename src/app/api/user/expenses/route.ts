import { NextRequest, NextResponse } from 'next/server';

// Mock database operations - replace with real database calls
const expenses: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, vendor, amount, date, category, items, source, processedAt } = body;

    if (!userId || !vendor || !amount) {
      return NextResponse.json(
        { error: 'بيانات المصروف غير مكتملة' },
        { status: 400 }
      );
    }

    // Create expense record
    const expense = {
      id: `exp_${Date.now()}`,
      userId,
      vendor,
      amount: parseFloat(amount),
      date,
      category,
      items: items || [],
      source: source || 'manual',
      processedAt: processedAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in mock database
    expenses.push(expense);

    // In production, save to real database:
    // await db.expenses.create({ data: expense });

    return NextResponse.json({
      success: true,
      expense,
      message: 'تم حفظ المصروف بنجاح'
    });

  } catch (error) {
    console.error('Error saving expense:', error);
    return NextResponse.json(
      { error: 'فشل في حفظ المصروف' },
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

    // Filter expenses by user
    const userExpenses = expenses.filter(exp => exp.userId === userId);

    // In production, fetch from real database:
    // const userExpenses = await db.expenses.findMany({ where: { userId } });

    return NextResponse.json({
      success: true,
      expenses: userExpenses,
      total: userExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    });

  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'فشل في جلب المصروفات' },
      { status: 500 }
    );
  }
}
