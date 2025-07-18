// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { SupervisorService } from '@/core/shared/services/supervisor-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const searchParams = request.nextUrl.searchParams
    const supervisorId = searchParams.get('supervisorId')
    const userId = searchParams.get('userId')
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') || '10') : 10
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset') || '0') : 0

    const options: {
      userId?: string;
      projectId?: string;
      status?: string;
      limit: number;
      offset: number;    } = {
      userId: userId || undefined,
      projectId: projectId || undefined,
      status: status as any || undefined,
      limit,
      offset
    };

    const commissions = await SupervisorService.getSupervisorCommissions(
      supervisorId || user.id
    )

    return NextResponse.json(commissions)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch commissions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action, ...data } = await request.json()

    switch (action) {
      case 'record_commission': {
        const { 
          userId, 
          projectId, 
          commissionType, 
          baseAmount, 
          percentage, 
          description,
          expenseId,
          purchaseId
        } = data
        
        const commission = await SupervisorService.recordCommission(
          user.id,
          userId,
          projectId,
          commissionType,
          baseAmount,
          percentage,
          description,
          { expenseId, purchaseId }
        )
        
        return NextResponse.json(commission)
      }

      case 'pay_commission': {
        const { commissionId, paymentMethod } = data
        
        const paymentResult = await SupervisorService.payCommission(
          commissionId,
          paymentMethod
        )
        
        return NextResponse.json(paymentResult)
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process commission action' },
      { status: 500 }
    )
  }
}


