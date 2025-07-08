// @ts-nocheck
// Construction Supervisor Management Service
import { supabase } from '@/lib/supabaseClient';
import type { 
  ConstructionSupervisor, 
  SupervisorRequest, 
  ConstructionContract,
  PaymentMilestone,
  ProjectExpense,
  SupervisorPermission
} from '@/types/enhancements';
import type {
  UserBalance,
  BalanceTransaction,
  SpendingAuthorization,
  CommissionRecord,
  WarrantyRecord
} from '@/types/balance-management';

export class SupervisorService {
  /**
   * Register as a construction supervisor
   */  static async registerSupervisor(
    userId: string,
    supervisorData: Omit<ConstructionSupervisor, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'rating' | 'total_projects'>
  ): Promise<ConstructionSupervisor> {
    const { data, error } = await supabase
      .from('construction_supervisors')
      .insert({
        user_id: userId,
        ...supervisorData,
        rating: 0,
        total_projects: 0,
        is_available: true,
        is_verified: false
      })
      .select('id, user_id, full_name, phone, email, location, specializations, experience_years, certifications, portfolio_urls, hourly_rate, daily_rate, rating, total_projects, is_available, is_verified, created_at, updated_at')
      .single();

    if (error) throw error;
    return data as ConstructionSupervisor;
  }

  /**
   * Update supervisor profile
   */  static async updateSupervisorProfile(
    supervisorId: string,
    updates: Partial<ConstructionSupervisor>
  ): Promise<ConstructionSupervisor> {
    const { data, error } = await supabase
      .from('construction_supervisors')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', supervisorId)
      .select('id, user_id, full_name, phone, email, location, specializations, experience_years, certifications, portfolio_urls, hourly_rate, daily_rate, rating, total_projects, is_available, is_verified, created_at, updated_at')
      .single();

    if (error) throw error;
    return data as ConstructionSupervisor;
  }

  /**
   * Get available supervisors with filtering
   */  static async getAvailableSupervisors(filters?: {
    specializations?: string[];
    minRating?: number;
    maxHourlyRate?: number;
    location?: { lat: number; lng: number; radius: number };
    email?: string;
    city?: string;
    isPublic?: boolean;
  }): Promise<ConstructionSupervisor[]> {
    let query = supabase
      .from('construction_supervisors')
      .select('id, user_id, full_name, phone, email, location, specializations, experience_years, certifications, portfolio_urls, hourly_rate, daily_rate, rating, total_projects, is_available, is_verified, created_at, updated_at');

    // Only show available/verified for public or default
    if (!filters || filters.isPublic || (!filters.email && !filters.city)) {
      query = query.eq('is_available', true).eq('is_verified', true);
    }
    if (filters?.minRating) {
      query = query.gte('rating', filters.minRating);
    }
    if (filters?.maxHourlyRate) {
      query = query.lte('hourly_rate', filters.maxHourlyRate);
    }
    if (filters?.specializations && filters.specializations.length > 0) {
      query = query.overlaps('specializations', filters.specializations);
    }
    if (filters?.email) {
      query = query.ilike('email', `%${filters.email}%`);
    }
    if (filters?.city) {
      query = query.ilike('location', `%${filters.city}%`);
    }
    const { data, error } = await query.order('rating', { ascending: false });
    if (error) throw error;
    return (data || []) as ConstructionSupervisor[];
  }

  /**
   * Request supervisor for project
   */  static async requestSupervisor(
    userId: string,
    requestData: Omit<SupervisorRequest, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'>
  ): Promise<SupervisorRequest> {
    const { data, error } = await supabase
      .from('supervisor_requests')
      .insert({
        user_id: userId,
        ...requestData,
        status: 'pending'
      })
      .select('id, user_id, supervisor_id, project_id, request_type, description, budget_range_min, budget_range_max, preferred_start_date, duration_weeks, status, supervisor_response, created_at, updated_at')
      .single();

    if (error) throw error;

    const typedData = data as SupervisorRequest;

    // Send notification to supervisor
    if (requestData.supervisor_id) {
      await this.sendSupervisorNotification(
        requestData.supervisor_id,
        'طلب إشراف جديد',
        `لديك طلب إشراف جديد على مشروع`,
        'supervisor_request',
        typedData.id
      );
    }

    return typedData;
  }

  /**
   * Supervisor responds to request
   */
  static async respondToRequest(
    supervisorId: string,
    requestId: string,
    response: 'accepted' | 'declined',
    responseMessage?: string
  ): Promise<SupervisorRequest> {
    // Verify supervisor owns this request
    const supervisor = await this.getSupervisorByUserId(supervisorId);
    if (!supervisor) throw new Error('Supervisor not found');    const { data, error } = await supabase
      .from('supervisor_requests')
      .update({
        status: response,
        supervisor_response: responseMessage,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .eq('supervisor_id', supervisor.id)
      .select('id, user_id, supervisor_id, project_id, request_type, description, budget_range_min, budget_range_max, preferred_start_date, duration_weeks, status, supervisor_response, created_at, updated_at')
      .single();

    if (error) throw error;

    const typedData = data as SupervisorRequest;

    // Notify project owner
    await this.sendUserNotification(
      typedData.user_id,
      response === 'accepted' ? 'تم قبول طلب الإشراف' : 'تم رفض طلب الإشراف',
      `${response === 'accepted' ? 'تم قبول' : 'تم رفض'} طلب الإشراف على مشروعك`,
      'supervisor_response',
      requestId
    );

    return typedData;
  }

  /**
   * Create construction contract
   */
  static async createContract(
    userId: string,
    contractData: Omit<ConstructionContract, 'id' | 'contract_number' | 'created_at' | 'updated_at' | 'status'>
  ): Promise<ConstructionContract> {
    // Generate contract number
    const contractNumber = await this.generateContractNumber();

    const { data, error } = await supabase
      .from('construction_contracts')
      .insert({
        ...contractData,
        user_id: userId,
        contract_number: contractNumber,
        status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;    // Create payment milestones
    if (contractData.payment_schedule && contractData.payment_schedule.length > 0) {
      await this.createPaymentMilestones(data.id as string, contractData.payment_schedule);
    }

    return data as unknown as ConstructionContract;
  }

  /**
   * Sign contract
   */
  static async signContract(
    contractId: string,
    userId: string,
    signatureType: 'user' | 'supervisor'
  ): Promise<ConstructionContract> {
    const updateData: any = {};
    
    if (signatureType === 'user') {
      updateData.user_signature_date = new Date().toISOString();
    } else {
      updateData.supervisor_signature_date = new Date().toISOString();
    }

    // Check if both signatures are present to activate contract
    const { data: contract } = await supabase
      .from('construction_contracts')
      .select('user_signature_date, supervisor_signature_date')
      .eq('id', contractId)
      .single();

    if (contract) {
      const hasUserSignature = contract.user_signature_date || signatureType === 'user';
      const hasSupervisorSignature = contract.supervisor_signature_date || signatureType === 'supervisor';
      
      if (hasUserSignature && hasSupervisorSignature) {
        updateData.status = 'active';
      }
    }    const { data, error } = await supabase
      .from('construction_contracts')
      .update(updateData)
      .eq('id', contractId)
      .select('id, project_id, user_id, supervisor_id, contract_number, total_amount, status, start_date, end_date, terms, user_signature_date, supervisor_signature_date, created_at, updated_at')
      .single();

    if (error) throw error;
    return data as unknown as ConstructionContract;
  }

  /**
   * Grant supervisor permissions
   */
  static async grantSupervisorPermissions(
    contractId: string,
    supervisorId: string,
    permissions: Omit<SupervisorPermission, 'id' | 'contract_id' | 'supervisor_id' | 'granted_at' | 'granted_by'>[]
  ): Promise<SupervisorPermission[]> {
    const permissionRecords = permissions.map(perm => ({
      contract_id: contractId,
      supervisor_id: supervisorId,
      ...perm,
      granted_at: new Date().toISOString()
    }));    const { data, error } = await supabase
      .from('supervisor_permissions')
      .insert(permissionRecords)
      .select('id, contract_id, supervisor_id, permission_type, spending_limit, category_restrictions, is_active, granted_at, expires_at, granted_by');

    if (error) throw error;
    return (data || []) as unknown as SupervisorPermission[];
  }

  /**
   * Record project expense
   */
  static async recordExpense(
    expenseData: Omit<ProjectExpense, 'id' | 'created_at' | 'updated_at' | 'approval_status'>
  ): Promise<ProjectExpense> {    const { data, error } = await supabase
      .from('project_expenses')
      .insert({
        ...expenseData,
        approval_status: 'pending'
      })
      .select('id, project_id, supervisor_id, expense_type, description, amount, receipt_url, approval_status, approved_by, approved_at, notes, created_at, updated_at')
      .single();

    if (error) throw error;

    // Notify project owner about new expense
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', expenseData.project_id)
      .single();

    if (project) {
      const typedProject = project as { user_id: string };
      await this.sendUserNotification(
        typedProject.user_id,
        'مصروف جديد يحتاج موافقة',
        `تم تسجيل مصروف جديد بقيمة ${expenseData.amount} ريال`,
        'expense_approval',
        (data as ProjectExpense).id
      );
    }

    return data as unknown as ProjectExpense;
  }

  /**
   * Approve/reject expense
   */
  static async approveExpense(
    expenseId: string,
    approverId: string,
    status: 'approved' | 'rejected',
    notes?: string
  ): Promise<ProjectExpense> {    const { data, error } = await supabase
      .from('project_expenses')
      .update({
        approval_status: status,
        approved_by: approverId,
        approved_at: new Date().toISOString(),
        notes: notes
      })
      .eq('id', expenseId)
      .select('id, project_id, supervisor_id, expense_type, description, amount, receipt_url, approval_status, approved_by, approved_at, notes, created_at, updated_at')
      .single();

    if (error) throw error;

    const typedData = data as unknown as ProjectExpense;

    // Notify supervisor about approval/rejection
    if (typedData.supervisor_id) {
      const { data: supervisor } = await supabase
        .from('construction_supervisors')
        .select('user_id')
        .eq('id', typedData.supervisor_id)
        .single();

      if (supervisor) {
        const typedSupervisor = supervisor as { user_id: string };
        await this.sendUserNotification(
          typedSupervisor.user_id,
          status === 'approved' ? 'تم الموافقة على المصروف' : 'تم رفض المصروف',
          `تم ${status === 'approved' ? 'الموافقة على' : 'رفض'} المصروف بقيمة ${typedData.amount} ريال`,
          'expense_decision',
          expenseId
        );
      }
    }

    return typedData;
  }

  /**
   * Complete payment milestone
   */
  static async completeMilestone(
    milestoneId: string,
    supervisorId: string,
    completionNotes?: string
  ): Promise<PaymentMilestone> {    const { data, error } = await supabase
      .from('payment_milestones')
      .update({
        status: 'completed',
        completed_date: new Date().toISOString(),
        notes: completionNotes
      })
      .eq('id', milestoneId)
      .select('id, contract_id, milestone_number, title, description, amount, due_date, status, completed_date, notes, completion_criteria, created_at, updated_at')
      .single();

    if (error) throw error;

    const typedData = data as unknown as PaymentMilestone;

    // Notify project owner about milestone completion
    const { data: contract } = await supabase
      .from('construction_contracts')
      .select('user_id')
      .eq('id', typedData.contract_id)
      .single();

    if (contract) {
      const typedContract = contract as { user_id: string };
      await this.sendUserNotification(
        typedContract.user_id,
        'تم إكمال مرحلة دفع',
        `تم إكمال مرحلة "${typedData.title}" وهي جاهزة للموافقة والدفع`,
        'milestone_completed',
        milestoneId
      );
    }

    return typedData;
  }

  /**
   * Get supervisor dashboard data
   */
  static async getSupervisorDashboard(userId: string) {
    const supervisor = await this.getSupervisorByUserId(userId);
    if (!supervisor) throw new Error('Supervisor not found');

    // Get active contracts
    const { data: activeContracts } = await supabase
      .from('construction_contracts')
      .select(`
        *,
        project:projects(name, description)
      `)
      .eq('supervisor_id', supervisor.id)
      .eq('status', 'active');

    // Get recent expenses
    const { data: recentExpenses } = await supabase
      .from('project_expenses')
      .select('*')
      .eq('supervisor_id', supervisor.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get pending milestones
    const { data: pendingMilestones } = await supabase
      .from('payment_milestones')
      .select(`
        *,
        contract:construction_contracts(project_id, user_id)
      `)
      .in('contract_id', activeContracts?.map(c => c.id) || [])
      .eq('status', 'pending');

    // Calculate analytics
    const analytics = {
      active_projects: activeContracts?.length || 0,
      completed_projects: supervisor.total_projects,
      total_earnings: 0, // Calculate from completed milestones
      monthly_earnings: 0, // Calculate current month earnings
      average_rating: supervisor.rating,
      pending_requests: 0 // Count pending supervisor requests
    };

    return {
      supervisor,
      analytics,
      active_contracts: activeContracts || [],
      recent_expenses: recentExpenses || [],
      pending_milestones: pendingMilestones || []
    };
  }
  /**
   * Get or create user balance
   */
  static async getUserBalance(userId: string): Promise<UserBalance> {
    // First check if user already has a balance record
    const { data: existingBalance, error: queryError } = await supabase
      .from('user_balances')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!queryError && existingBalance) {
      return existingBalance as unknown as UserBalance;
    }

    // If no balance exists, create one with zero balance
    const { data: newBalance, error: createError } = await supabase
      .from('user_balances')
      .insert({
        user_id: userId,
        current_balance: 0,
        currency: 'SAR', // Saudi Riyal default currency
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (createError) throw createError;
    return newBalance as unknown as UserBalance;
  }

  /**
   * Add funds to user balance
   */
  static async addFunds(
    userId: string,
    amount: number,
    paymentMethod: string,
    description?: string
  ): Promise<{balance: UserBalance, transaction: BalanceTransaction}> {
    // Begin a transaction
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Get current balance
    const currentBalance = await this.getUserBalance(userId);
    
    // Create the transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('balance_transactions')
      .insert({
        user_id: userId,
        transaction_type: 'deposit',
        amount,
        currency: currentBalance.currency,
        status: 'completed',
        payment_method: paymentMethod,
        transaction_date: new Date().toISOString(),
        description: description || 'إيداع رصيد',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (transactionError) throw transactionError;
    
    // Update the user balance
    const newBalance = currentBalance.current_balance + amount;
    const { data: updatedBalance, error: updateError } = await supabase
      .from('user_balances')
      .update({
        current_balance: newBalance,
        last_deposit_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', currentBalance.id)
      .select('*')
      .single();
    
    if (updateError) throw updateError;
    
    return {
      balance: updatedBalance as unknown as UserBalance,
      transaction: transaction as unknown as BalanceTransaction
    };
  }

  /**
   * Withdraw funds from user balance
   */
  static async withdrawFunds(
    userId: string,
    amount: number,
    description?: string
  ): Promise<{balance: UserBalance, transaction: BalanceTransaction}> {
    // Get current balance
    const currentBalance = await this.getUserBalance(userId);
    
    // Check if user has sufficient funds
    if (currentBalance.current_balance < amount) {
      throw new Error('رصيد غير كافي');
    }
    
    // Create the transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('balance_transactions')
      .insert({
        user_id: userId,
        transaction_type: 'withdrawal',
        amount,
        currency: currentBalance.currency,
        status: 'completed',
        transaction_date: new Date().toISOString(),
        description: description || 'سحب رصيد',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (transactionError) throw transactionError;
    
    // Update the user balance
    const newBalance = currentBalance.current_balance - amount;
    const { data: updatedBalance, error: updateError } = await supabase
      .from('user_balances')
      .update({
        current_balance: newBalance,
        last_withdrawal_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', currentBalance.id)
      .select('*')
      .single();
    
    if (updateError) throw updateError;
    
    return {
      balance: updatedBalance as unknown as UserBalance,
      transaction: transaction as unknown as BalanceTransaction
    };
  }

  /**
   * Request spending authorization
   */
  static async requestSpendingAuthorization(
    supervisorId: string,
    userId: string,
    projectId: string,
    amount: number,
    purpose: string,
    authorizationType: 'one_time' | 'recurring' | 'category_based',
    category?: string,
    expiryDate?: string,
    notes?: string
  ): Promise<SpendingAuthorization> {
    // Verify supervisor exists
    const supervisor = await this.getSupervisorByUserId(supervisorId);
    if (!supervisor) throw new Error('Supervisor not found');
    
    // Create authorization request
    const { data, error } = await supabase
      .from('spending_authorizations')
      .insert({
        user_id: userId,
        supervisor_id: supervisor.id,
        project_id: projectId,
        amount,
        currency: 'SAR', // Default to Saudi Riyal
        purpose,
        authorization_type: authorizationType,
        category,
        spending_limit: amount,
        status: 'pending',
        expiry_date: expiryDate,
        notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) throw error;
    
    // Notify the user about the authorization request
    const typedData = data as unknown as SpendingAuthorization;
    await this.sendUserNotification(
      userId,
      'طلب إذن صرف جديد',
      `قام المشرف بطلب إذن صرف بمبلغ ${amount} ريال لـ ${purpose}`,
      'spending_authorization',
      typedData.id
    );
    
    return typedData;
  }

  /**
   * Respond to spending authorization request
   */
  static async respondToAuthorizationRequest(
    userId: string,
    authorizationId: string,
    response: 'approved' | 'rejected',
    notes?: string
  ): Promise<SpendingAuthorization> {
    // Verify user owns this authorization request
    const { data: authRequest, error: findError } = await supabase
      .from('spending_authorizations')
      .select('*')
      .eq('id', authorizationId)
      .eq('user_id', userId)
      .single();
    
    if (findError || !authRequest) throw new Error('Authorization request not found or not authorized');
    
    const typedAuthRequest = authRequest as unknown as SpendingAuthorization;
    
    // Update the authorization status
    const { data, error } = await supabase
      .from('spending_authorizations')
      .update({
        status: response,
        approved_date: response === 'approved' ? new Date().toISOString() : null,
        notes: notes ? `${typedAuthRequest.notes || ''}\n${notes}` : typedAuthRequest.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', authorizationId)
      .select('*')
      .single();

    if (error) throw error;
    
    const typedData = data as unknown as SpendingAuthorization;
    
    // Notify the supervisor about the authorization response
    await this.sendSupervisorNotification(
      typedAuthRequest.supervisor_id,
      response === 'approved' ? 'تمت الموافقة على طلب الإذن بالصرف' : 'تم رفض طلب الإذن بالصرف',
      `${response === 'approved' ? 'تمت الموافقة على' : 'تم رفض'} طلب الإذن بالصرف بمبلغ ${typedAuthRequest.amount} ريال`,
      'authorization_response',
      authorizationId
    );
    
    return typedData;
  }

  /**
   * Record a commission for a supervisor
   */  static async recordCommission(
    supervisorId: string,
    userId: string,
    projectId: string,
    commissionType: 'purchase' | 'project_completion' | 'milestone',
    baseAmount: number,
    percentage: number,
    description?: string,
    references?: any
  ): Promise<CommissionRecord> {
    // Calculate commission amount
    const commissionAmount = (baseAmount * percentage) / 100;
    
    // Create commission record
    const { data, error } = await supabase
      .from('commission_records')
      .insert({
        supervisor_id: supervisorId,
        user_id: userId,
        project_id: projectId,
        expense_id: references?.expenseId || null,
        purchase_id: references?.purchaseId || null,
        transaction_id: references?.transactionId || null,
        commission_type: commissionType,
        amount: commissionAmount,
        percentage,
        base_amount: baseAmount,
        currency: 'SAR', // Default to Saudi Riyal
        status: 'pending',
        description: description || `عمولة ${commissionType === 'purchase' ? 'مشتريات' : commissionType === 'project_completion' ? 'إتمام مشروع' : 'معلم دفع'}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) throw error;
    
    const typedData = data as unknown as CommissionRecord;
    
    // Notify the supervisor about the commission
    await this.sendSupervisorNotification(
      supervisorId,
      'عمولة جديدة',
      `تم تسجيل عمولة جديدة بقيمة ${commissionAmount} ريال`,
      'commission',
      typedData.id
    );
    
    return typedData;
  }

  /**
   * Pay commission to supervisor
   */
  static async payCommission(
    commissionId: string,
    adminId: string
  ): Promise<CommissionRecord> {
    // Get commission details
    const { data: commission, error: findError } = await supabase
      .from('commission_records')
      .select('*')
      .eq('id', commissionId)
      .single();
    
    if (findError || !commission) throw new Error('Commission record not found');
    
    const typedCommission = commission as unknown as CommissionRecord;
    
    // Update commission status
    const { data, error } = await supabase
      .from('commission_records')
      .update({
        status: 'paid',
        payment_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', commissionId)
      .select('*')
      .single();

    if (error) throw error;
    
    const typedData = data as unknown as CommissionRecord;
    
    // Create a transaction for the commission payment
    await supabase
      .from('balance_transactions')
      .insert({
        user_id: typedCommission.supervisor_id,
        transaction_type: 'commission',
        amount: typedCommission.amount,
        currency: typedCommission.currency,
        status: 'completed',
        reference_id: commissionId,
        reference_type: 'commission',
        transaction_date: new Date().toISOString(),
        description: `دفع عمولة: ${typedCommission.description}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    // Notify the supervisor about the commission payment
    await this.sendSupervisorNotification(
      typedCommission.supervisor_id,
      'تم دفع العمولة',
      `تم دفع عمولة بقيمة ${typedCommission.amount} ريال`,
      'commission_payment',
      commissionId
    );
    
    return typedData;
  }

  /**
   * Record warranty information
   */
  static async recordWarranty(
    projectId: string,
    registeredBy: string,
    itemData: {
      item_name: string;
      vendor_name?: string;
      vendor_contact?: string;
      purchase_date: string;
      warranty_start_date: string;
      warranty_end_date: string;
      warranty_terms?: string;
      warranty_document_url?: string;
      expense_id?: string;
      purchase_id?: string;
    }
  ): Promise<WarrantyRecord> {
    const { data, error } = await supabase
      .from('warranty_records')
      .insert({
        project_id: projectId,
        registered_by: registeredBy,
        status: 'active',
        ...itemData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) throw error;
    
    const typedData = data as unknown as WarrantyRecord;
    
    // Get project owner
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();
    
    if (project) {
      const typedProject = project as { user_id: string };
      // Notify the project owner about the warranty record
      await this.sendUserNotification(
        typedProject.user_id,
        'تم تسجيل ضمان جديد',
        `تم تسجيل ضمان جديد لـ ${itemData.item_name}`,
        'warranty',
        typedData.id
      );
    }
    
    return typedData;
  }

  /**
   * Get supervisor's commissions
   */
  static async getSupervisorCommissions(supervisorId: string): Promise<CommissionRecord[]> {
    const { data, error } = await supabase
      .from('commission_records')
      .select('*')
      .eq('supervisor_id', supervisorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as unknown as CommissionRecord[];
  }

  /**
   * Get user's authorizations
   */
  static async getUserAuthorizations(userId: string): Promise<SpendingAuthorization[]> {
    const { data, error } = await supabase
      .from('spending_authorizations')
      .select(`
        *,
        supervisor:construction_supervisors(id, full_name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as unknown as SpendingAuthorization[];
  }

  /**
   * Get supervisor's pending authorizations
   */
  static async getSupervisorAuthorizations(supervisorId: string): Promise<SpendingAuthorization[]> {
    const supervisor = await this.getSupervisorByUserId(supervisorId);
    if (!supervisor) throw new Error('Supervisor not found');

    const { data, error } = await supabase
      .from('spending_authorizations')
      .select(`
        *,
        user:profiles(id, full_name)
      `)
      .eq('supervisor_id', supervisor.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as unknown as SpendingAuthorization[];
  }

  /**
   * Get project warranties
   */
  static async getProjectWarranties(projectId: string): Promise<WarrantyRecord[]> {
    const { data, error } = await supabase
      .from('warranty_records')
      .select('*')
      .eq('project_id', projectId)
      .order('warranty_end_date', { ascending: true });

    if (error) throw error;
    return (data || []) as unknown as WarrantyRecord[];
  }

  /**
   * Update warranty status
   */
  static async updateWarrantyStatus(
    warrantyId: string,
    status: 'active' | 'expired' | 'claimed',
    claimDetails?: string
  ): Promise<WarrantyRecord> {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'claimed') {
      updateData.claim_date = new Date().toISOString();
      updateData.claim_details = claimDetails;
    }

    const { data, error } = await supabase
      .from('warranty_records')
      .update(updateData)
      .eq('id', warrantyId)
      .select('*')
      .single();

    if (error) throw error;
    return data as unknown as WarrantyRecord;
  }

  /**
   * Get transaction history for user
   */  static async getTransactionHistory(
    userId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<{ transactions: BalanceTransaction[]; totalCount: number }> {
    const { limit = 10, offset = 0 } = options;
    
    try {
      const { data, error, count } = await supabase
        .from('balance_transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('transaction_date', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      return {
        transactions: (data || []) as unknown as BalanceTransaction[],
        totalCount: count || 0
      };
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  }

  /**
   * Request a supervision agreement (user requests a supervisor)
   */
  static async requestAgreement({ supervisorId, userId }: { supervisorId: string; userId: string; }) {
    // Insert a new supervisor_request row with status 'pending'
    const { data, error } = await supabase
      .from('supervisor_requests')
      .insert({
        user_id: userId,
        supervisor_id: supervisorId,
        request_type: 'full_supervision',
        description: 'طلب إشراف من المستخدم',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')    .single();
    if (error) throw error;
    // Notify supervisor
    const id = (data as { id: string | number | undefined })?.id?.toString() || '';
    await this.sendSupervisorNotification(
      supervisorId,
      'طلب إشراف جديد',
      'لديك طلب إشراف جديد من مستخدم',
      'supervisor_request',
      id
    );
    return data;
  }

  /**
   * Helper functions
   */  private static async getSupervisorByUserId(userId: string): Promise<ConstructionSupervisor | null> {
    const { data, error } = await supabase
      .from('construction_supervisors')
      .select('id, user_id, full_name, phone, email, location, specialization, experience_years, rating, total_projects, availability_status, created_at, updated_at')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data as unknown as ConstructionSupervisor;
  }

  private static async generateContractNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `CONTRACT-${year}-${timestamp}`;
  }

  private static async createPaymentMilestones(
    contractId: string,
    paymentSchedule: Array<{
      milestone_number: number;
      title: string;
      description?: string;
      amount: number;
      due_date: string;
      completion_criteria?: string;
    }>
  ): Promise<void> {
    const milestones = paymentSchedule.map(milestone => ({
      contract_id: contractId,
      ...milestone
    }));

    const { error } = await supabase
      .from('payment_milestones')
      .insert(milestones);

    if (error) throw error;
  }
  private static async sendSupervisorNotification(
    supervisorId: string,
    title: string,
    message: string,
    category: string,
    relatedId: string
  ): Promise<void> {
    const { data: supervisor } = await supabase
      .from('construction_supervisors')
      .select('user_id')
      .eq('id', supervisorId)
      .single();

    if (supervisor) {
      const typedSupervisor = supervisor as { user_id: string };
      await this.sendUserNotification(typedSupervisor.user_id, title, message, category, relatedId);
    }
  }

  private static async sendUserNotification(
    userId: string,
    title: string,
    message: string,
    category: string,
    relatedId: string
  ): Promise<void> {
    await supabase
      .from('system_notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type: 'info',
        category,
        related_entity_type: category,
        related_entity_id: relatedId
      });
  }
}


