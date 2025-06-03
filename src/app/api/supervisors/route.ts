import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { SupervisorService } from '@/lib/supervisor-service'

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
      case 'register_supervisor':
        const { profile } = data
        const supervisor = await SupervisorService.registerSupervisor(user.id, profile)
        return NextResponse.json(supervisor)

      case 'request_supervisor':
        const { requirements } = data
        const request = await SupervisorService.requestSupervisor(user.id, requirements)
        return NextResponse.json(request)

      case 'respond_to_request':
        const { requestId, response, responseMessage } = data
        const responseResult = await SupervisorService.respondToRequest(
          user.id,
          requestId,
          response,
          responseMessage
        )
        return NextResponse.json(responseResult)

      case 'create_contract':
        const { contractData } = data
        const contract = await SupervisorService.createContract(user.id, contractData)
        return NextResponse.json(contract)

      case 'sign_contract':
        const { contractId, signatureType } = data
        const signedContract = await SupervisorService.signContract(contractId, user.id, signatureType)
        return NextResponse.json(signedContract)

      case 'record_expense':
        const { expenseData } = data
        const recordedExpense = await SupervisorService.recordExpense(expenseData)
        return NextResponse.json(recordedExpense)

      case 'complete_milestone':
        const { milestoneId, completionNotes } = data
        const completedMilestone = await SupervisorService.completeMilestone(
          milestoneId,
          user.id,
          completionNotes
        )
        return NextResponse.json(completedMilestone)

      case 'approve_expense':
        const { expenseId, status, notes } = data
        const approvedExpense = await SupervisorService.approveExpense(
          expenseId,
          user.id,
          status,
          notes
        )
        return NextResponse.json(approvedExpense)

      case 'add_funds':
        const { amount, paymentMethod, description } = data
        const addFundsResult = await SupervisorService.addFunds(
          user.id,
          amount,
          paymentMethod,
          description
        )
        return NextResponse.json(addFundsResult)

      case 'withdraw_funds':
        const { withdrawAmount, withdrawDescription } = data
        const withdrawResult = await SupervisorService.withdrawFunds(
          user.id,
          withdrawAmount,
          withdrawDescription
        )
        return NextResponse.json(withdrawResult)

      case 'request_authorization':
        const { projectId, authAmount, purpose, authType, category, expiryDate, authNotes } = data
        const authRequest = await SupervisorService.requestSpendingAuthorization(
          user.id, // supervisor
          data.userId, // project owner
          projectId,
          authAmount,
          purpose,
          authType,
          category,
          expiryDate,
          authNotes
        )
        return NextResponse.json(authRequest)

      case 'respond_authorization':
        const { authorizationId, authResponse, responseNotes } = data
        const authResponseResult = await SupervisorService.respondToAuthorizationRequest(
          user.id,
          authorizationId,
          authResponse,
          responseNotes
        )
        return NextResponse.json(authResponseResult);

      case 'record_commission':
        const { commissionData } = data;
        const recordedCommission = await SupervisorService.recordCommission(
          commissionData.supervisorId,
          user.id,
          commissionData.projectId,
          commissionData.commissionType,
          commissionData.baseAmount,
          commissionData.percentage,
          commissionData.description,
          {
            referenceId: commissionData.referenceId,
            referenceType: commissionData.referenceType
          }
        )
        return NextResponse.json(recordedCommission)

      case 'pay_commission':
        const { commissionId } = data
        const paidCommission = await SupervisorService.payCommission(
          commissionId,
          user.id
        )
        return NextResponse.json(paidCommission)

      case 'record_warranty':
        const { projectId: warrantyProjectId, itemData } = data
        const recordedWarranty = await SupervisorService.recordWarranty(
          warrantyProjectId,
          user.id,
          itemData
        )
        return NextResponse.json(recordedWarranty)

      case 'update_warranty':
        const { warrantyId, warrantyStatus, claimDetails } = data
        const updatedWarranty = await SupervisorService.updateWarrantyStatus(
          warrantyId,
          warrantyStatus,
          claimDetails
        )
        return NextResponse.json(updatedWarranty)

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Supervisor API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process supervisor action' },
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
      case 'dashboard':
        const dashboard = await SupervisorService.getSupervisorDashboard(user.id)
        return NextResponse.json(dashboard)

      case 'find_supervisors':
        const location = searchParams.get('location')
        const specialization = searchParams.get('specialization')
        const filters: any = {}
        if (location) filters.location = location
        if (specialization) filters.specializations = [specialization]
        
        const supervisors = await SupervisorService.getAvailableSupervisors(filters)
        return NextResponse.json(supervisors)

      case 'balance':
        const userBalance = await SupervisorService.getUserBalance(user.id)
        return NextResponse.json(userBalance)

      case 'authorizations':
        const authorizations = await SupervisorService.getUserAuthorizations(user.id)
        return NextResponse.json(authorizations)

      case 'supervisor_authorizations':
        const supervisorAuths = await SupervisorService.getSupervisorAuthorizations(user.id)
        return NextResponse.json(supervisorAuths)

      case 'commissions':
        const commissions = await SupervisorService.getSupervisorCommissions(user.id)
        return NextResponse.json(commissions)

      case 'project_warranties':
        const projectId = searchParams.get('projectId')
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          )
        }
        const warranties = await SupervisorService.getProjectWarranties(projectId)
        return NextResponse.json(warranties)

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Supervisor GET API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch supervisor data' },
      { status: 500 }
    )
  }
}
