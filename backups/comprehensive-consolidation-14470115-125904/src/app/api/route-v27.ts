// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { SupervisorService } from '@/domains/shared/services/supervisor-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action, ...data } = await request.json()

    switch (action) {
      case 'request_authorization':
        const { userId, projectId, amount, purpose, authorizationType, category, expiryDate, notes } = data
        const authRequest = await SupervisorService.requestSpendingAuthorization(
          user.id, // supervisor requesting authorization
          userId, // project owner
          projectId,
          amount,
          purpose,
          authorizationType,
          category,
          expiryDate,
          notes
        )
        return NextResponse.json(authRequest)

      case 'respond_to_authorization':
        const { authorizationId, response, responseNotes } = data
        const authResponse = await SupervisorService.respondToAuthorizationRequest(
          user.id,
          authorizationId,
          response,
          responseNotes
        )
        return NextResponse.json(authResponse)

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Authorization API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process authorization action' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'user_authorizations':
        const userAuths = await SupervisorService.getUserAuthorizations(user.id)
        return NextResponse.json(userAuths)

      case 'supervisor_authorizations':
        const supervisorAuths = await SupervisorService.getSupervisorAuthorizations(user.id)
        return NextResponse.json(supervisorAuths)

      case 'authorization_details':
        const authorizationId = searchParams.get('id')
        if (!authorizationId) {
          return NextResponse.json(
            { error: 'Authorization ID is required' },
            { status: 400 }
          )
        }

        // For detailed authorization info, we'd need to add a method to SupervisorService
        // This is a placeholder for future implementation
        return NextResponse.json(
          { error: 'Not yet implemented' },
          { status: 501 }
        )

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Authorization GET API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch authorization data' },
      { status: 500 }
    )
  }
}


