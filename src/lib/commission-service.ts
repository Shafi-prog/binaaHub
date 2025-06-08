// Commission Tracking Service
import { supabase } from '@/lib/supabaseClient';
import type { 
  Commission, 
  CommissionPayout, 
  CommissionDashboard, 
  EnhancedInviteCode 
} from '@/types/enhancements';

export class CommissionService {
  /**
   * Generate unique invitation code
   */
  static generateInviteCode(prefix: string = ''): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`.toUpperCase();
  }

  /**
   * Create invitation code for user
   */  static async createInviteCode(
    userId: string,
    commissionRate: number = 0.01,
    maxUses?: number,
    expiryDays?: number
  ): Promise<EnhancedInviteCode> {
    const code = this.generateInviteCode();
    const expiryDate = expiryDays 
      ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const { data, error } = await supabase
      .from('invite_codes')
      .insert({
        user_id: userId,
        code,
        commission_rate: commissionRate,
        usage_count: 0,
        total_commission: 0,
        is_active: true,
        expiry_date: expiryDate,
        max_uses: maxUses
      })      .select('user_id, code, usage_count, total_commission, commission_rate, is_active, expiry_date, max_uses, created_at, updated_at')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create invite code');
    
    return data as EnhancedInviteCode;
  }

  /**
   * Validate and get invitation code
   */  static async validateInviteCode(code: string): Promise<EnhancedInviteCode | null> {
    const { data, error } = await supabase
      .from('invite_codes')
      .select('user_id, code, usage_count, total_commission, commission_rate, is_active, expiry_date, max_uses, created_at, updated_at')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) return null;

    const inviteCode = data as EnhancedInviteCode;

    // Check if expired
    if (inviteCode.expiry_date && new Date(inviteCode.expiry_date) < new Date()) {
      return null;
    }

    // Check if max uses reached
    if (inviteCode.max_uses && inviteCode.usage_count >= inviteCode.max_uses) {
      return null;
    }

    return inviteCode;
  }

  /**
   * Record commission from order
   */
  static async recordCommission(
    orderId: string,
    inviteCode?: string
  ): Promise<Commission | null> {
    if (!inviteCode) return null;

    // Validate invite code
    const codeData = await this.validateInviteCode(inviteCode);
    if (!codeData) return null;    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('total_amount, user_id')
      .eq('id', orderId)
      .single();

    if (orderError || !order) throw new Error('Order not found');

    // Type the order data
    const typedOrder = order as { total_amount: number; user_id: string };

    // Prevent self-referral
    if (typedOrder.user_id === codeData.user_id) {
      return null;
    }

    // Calculate commission
    const commissionAmount = typedOrder.total_amount * codeData.commission_rate;    // Create commission record
    const { data: commission, error: commissionError } = await supabase
      .from('commissions')
      .insert({
        referrer_id: codeData.user_id,
        referee_id: typedOrder.user_id,
        order_id: orderId,
        commission_type: 'purchase',
        commission_rate: codeData.commission_rate,
        order_amount: typedOrder.total_amount,
        commission_amount: commissionAmount,
        status: 'pending'
      })
      .select('id, referrer_id, referee_id, order_id, commission_type, commission_rate, order_amount, commission_amount, status, paid_at, created_at, updated_at')
      .single();

    if (commissionError) throw commissionError;
    if (!commission) throw new Error('Failed to create commission');

    const typedCommission = commission as Commission;

    // Update invite code usage
    await supabase
      .from('invite_codes')
      .update({
        usage_count: codeData.usage_count + 1,
        total_commission: codeData.total_commission + commissionAmount
      })
      .eq('id', codeData.user_id)
      .eq('code', codeData.code);

    // Update user balance
    await this.updateUserBalance(codeData.user_id, commissionAmount);    // Send notification
    await this.sendCommissionNotification(codeData.user_id, typedCommission);

    return typedCommission;
  }
  /**
   * Record signup commission
   */
  static async recordSignupCommission(
    newUserId: string,
    inviteCode?: string,
    accountType: 'user' | 'store' = 'user'
  ): Promise<Commission | null> {
    if (!inviteCode) return null;

    // Check if user already has a used code
    const { data: existingCommissions } = await supabase
      .from('commissions')
      .select('id')
      .eq('referee_id', newUserId)
      .single();

    if (existingCommissions) {
      return null; // User already used an invite code
    }    const codeData = await this.validateInviteCode(inviteCode);
    if (!codeData) return null;

    // Fixed commission amounts for signups
    const commissionAmounts = {
      user: 10.00, // 10 SAR for user signup
      store: 50.00 // 50 SAR for store signup
    };

    const commissionAmount = commissionAmounts[accountType];
    const commissionType = accountType === 'store' ? 'store_signup' : 'user_signup';const { data: commission, error } = await supabase
      .from('commissions')
      .insert({
        referrer_id: codeData.user_id,
        referee_id: newUserId,
        commission_type: commissionType,
        commission_rate: 0, // Fixed amount, not percentage
        commission_amount: commissionAmount,
        status: 'approved' // Auto-approve signup commissions
      })
      .select('id, referrer_id, referee_id, order_id, commission_type, commission_rate, order_amount, commission_amount, status, paid_at, created_at, updated_at')
      .single();

    if (error) throw error;
    if (!commission) throw new Error('Failed to create commission');

    const typedCommission = commission as Commission;

    // Update invite code
    await supabase
      .from('invite_codes')
      .update({
        usage_count: codeData.usage_count + 1,
        total_commission: codeData.total_commission + commissionAmount
      })
      .eq('user_id', codeData.user_id)
      .eq('code', codeData.code);    // Update user balance
    await this.updateUserBalance(codeData.user_id, commissionAmount);

    return typedCommission;
  }

  /**
   * Get user's commission dashboard data
   */  static async getCommissionDashboard(userId: string): Promise<CommissionDashboard> {
    // Get commission summary
    const { data: commissions, error } = await supabase
      .from('commissions')
      .select('id, referrer_id, referee_id, order_id, commission_type, commission_rate, order_amount, commission_amount, status, paid_at, created_at, updated_at')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const allCommissions = (commissions || []) as Commission[];
    
    const total_earned = allCommissions
      .filter(c => c.status === 'approved' || c.status === 'paid')
      .reduce((sum, c) => sum + (c.commission_amount || 0), 0);

    const pending_amount = allCommissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + (c.commission_amount || 0), 0);    const paid_amount = allCommissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + (c.commission_amount || 0), 0);

    const total_referrals = allCommissions.length;
    const active_referrals = allCommissions.filter(c => c.status !== 'cancelled').length;

    // Calculate monthly earnings (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthly_earnings = allCommissions
      .filter(c => {
        const commissionDate = new Date(c.created_at);
        return commissionDate.getMonth() === currentMonth && 
               commissionDate.getFullYear() === currentYear &&
               (c.status === 'approved' || c.status === 'paid');
      })
      .reduce((sum, c) => sum + (c.commission_amount || 0), 0);

    const recent_commissions = allCommissions.slice(0, 10);

    return {
      total_earned,
      pending_amount,
      paid_amount,
      total_referrals,
      active_referrals,
      monthly_earnings,
      recent_commissions
    };
  }

  /**
   * Request commission payout
   */
  static async requestPayout(
    userId: string,
    commissionIds: string[],
    paymentMethod: string
  ): Promise<CommissionPayout> {    // Verify commissions belong to user and are approved
    const { data: commissions, error } = await supabase
      .from('commissions')
      .select('id, referrer_id, referee_id, order_id, commission_type, commission_rate, order_amount, commission_amount, status, paid_at, created_at, updated_at')
      .in('id', commissionIds)
      .eq('referrer_id', userId)
      .eq('status', 'approved');

    if (error) throw error;
    const typedCommissions = (commissions || []) as Commission[];
    if (typedCommissions.length !== commissionIds.length) {
      throw new Error('Invalid commission selection');
    }

    const totalAmount = typedCommissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);

    if (totalAmount < 50) { // Minimum payout amount
      throw new Error('Minimum payout amount is 50 SAR');
    }    // Create payout request
    const { data: payout, error: payoutError } = await supabase
      .from('commission_payouts')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        commission_ids: commissionIds,
        payment_method: paymentMethod,
        status: 'pending'
      })
      .select('id, user_id, total_amount, commission_ids, payment_method, payment_reference, status, processed_at, notes, created_at')
      .single();

    if (payoutError) throw payoutError;
    if (!payout) throw new Error('Failed to create payout');

    return payout as CommissionPayout;
  }
  /**
   * Get user's payout history
   */
  static async getPayoutHistory(userId: string): Promise<CommissionPayout[]> {
    const { data, error } = await supabase
      .from('commission_payouts')
      .select('id, user_id, total_amount, commission_ids, payment_method, payment_reference, status, processed_at, notes, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as CommissionPayout[];
  }
  /**
   * Get user's invite codes
   */
  static async getUserInviteCodes(userId: string): Promise<EnhancedInviteCode[]> {
    const { data, error } = await supabase
      .from('invite_codes')
      .select('user_id, code, usage_count, total_commission, commission_rate, is_active, expiry_date, max_uses, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as EnhancedInviteCode[];
  }

  /**
   * Deactivate invite code
   */
  static async deactivateInviteCode(userId: string, code: string): Promise<void> {
    const { error } = await supabase
      .from('invite_codes')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('code', code);

    if (error) throw error;
  }

  /**
   * Update user balance
   */
  private static async updateUserBalance(userId: string, amount: number): Promise<void> {
    const { error } = await supabase
      .from('balances')
      .upsert({
        user_id: userId,
        available_amount: amount,
        total_earned: amount
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      });

    if (error) {
      // If upsert fails, try to update existing balance
      await supabase.rpc('update_user_balance', {
        p_user_id: userId,
        p_amount: amount
      });
    }
  }

  /**
   * Send commission notification
   */
  private static async sendCommissionNotification(
    userId: string,
    commission: Commission
  ): Promise<void> {
    await supabase
      .from('system_notifications')
      .insert({
        user_id: userId,
        title: 'عمولة جديدة!',
        message: `تم إضافة عمولة بقيمة ${commission.commission_amount.toFixed(2)} ريال إلى رصيدك`,
        type: 'success',
        category: 'commission',
        related_entity_type: 'commission',
        related_entity_id: commission.id
      });

    // Also queue email notification
    const { data: user } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', userId)
      .single();

    if (user?.email) {
      await supabase
        .from('email_notifications')
        .insert({
          user_id: userId,
          template_name: 'commission_earned',
          subject: 'عمولة جديدة - منصة بناء',
          recipient_email: user.email,
          template_data: {
            user_name: user.name,
            commission_amount: commission.commission_amount,
            commission_type: commission.commission_type
          }
        });
    }
  }

  /**
   * Get commission analytics for admin dashboard
   */  static async getCommissionAnalytics(dateRange?: { start: string; end: string }) {
    let query = supabase
      .from('commissions')
      .select('id, referrer_id, referee_id, order_id, commission_type, commission_rate, order_amount, commission_amount, status, paid_at, created_at, updated_at');

    if (dateRange) {
      query = query.gte('created_at', dateRange.start).lte('created_at', dateRange.end);
    }

    const { data: commissions, error } = await query;
    if (error) throw error;

    const typedCommissions = (commissions || []) as Commission[];

    const analytics = {
      total_commissions: typedCommissions.length,
      total_amount: typedCommissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0),
      pending_amount: typedCommissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + (c.commission_amount || 0), 0),
      paid_amount: typedCommissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + (c.commission_amount || 0), 0),      by_type: {
        user_signup: typedCommissions.filter(c => c.commission_type === 'user_signup').length,
        store_signup: typedCommissions.filter(c => c.commission_type === 'store_signup').length,
        purchase: typedCommissions.filter(c => c.commission_type === 'purchase').length
      }
    };

    return analytics;
  }
}
