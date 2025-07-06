import { createClient } from '@supabase/supabase-js';

// Payment Gateway Types
export interface PaymentGateway {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'saudi_local' | 'bnpl' | 'crypto' | 'subscription';
  isActive: boolean;
  config: Record<string, any>;
  supportedCurrencies: string[];
  features: string[];
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customer_id?: string;
  metadata?: Record<string, any>;
  payment_method?: string;
  recurring?: boolean;
  capture_method?: 'automatic' | 'manual';
}

export interface PaymentResponse {
  success: boolean;
  payment_id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transaction_id?: string;
  gateway_response?: any;
  error_message?: string;
  redirect_url?: string;
}

export class PaymentGatewayManager {
  private supabase;
  private gateways: Map<string, PaymentGateway> = new Map();

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.initializeGateways();
  }

  private initializeGateways() {
    // Stripe Gateway
    this.gateways.set('stripe', {
      id: 'stripe',
      name: 'Stripe',
      type: 'stripe',
      isActive: true,
      config: {
        publishable_key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        secret_key: process.env.STRIPE_SECRET_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET
      },
      supportedCurrencies: ['USD', 'SAR', 'AED', 'EUR', 'GBP'],
      features: ['cards', 'apple_pay', 'google_pay', 'bank_transfer', 'installments']
    });

    // PayPal Gateway
    this.gateways.set('paypal', {
      id: 'paypal',
      name: 'PayPal',
      type: 'paypal',
      isActive: true,
      config: {
        client_id: process.env.PAYPAL_CLIENT_ID,
        client_secret: process.env.PAYPAL_CLIENT_SECRET,
        environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox'
      },
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'SAR'],
      features: ['paypal_wallet', 'credit_debit_cards', 'pay_later']
    });

    // Saudi Local Payment Providers
    this.gateways.set('mada', {
      id: 'mada',
      name: 'Mada',
      type: 'saudi_local',
      isActive: true,
      config: {
        merchant_id: process.env.MADA_MERCHANT_ID,
        terminal_id: process.env.MADA_TERMINAL_ID,
        api_key: process.env.MADA_API_KEY
      },
      supportedCurrencies: ['SAR'],
      features: ['mada_cards', 'contactless', 'mobile_payments']
    });

    this.gateways.set('stc_pay', {
      id: 'stc_pay',
      name: 'STC Pay',
      type: 'saudi_local',
      isActive: true,
      config: {
        merchant_id: process.env.STC_PAY_MERCHANT_ID,
        api_key: process.env.STC_PAY_API_KEY,
        webhook_secret: process.env.STC_PAY_WEBHOOK_SECRET
      },
      supportedCurrencies: ['SAR'],
      features: ['wallet_payments', 'qr_codes', 'mobile_app']
    });

    // Buy Now Pay Later (BNPL) Providers
    this.gateways.set('tamara', {
      id: 'tamara',
      name: 'Tamara',
      type: 'bnpl',
      isActive: true,
      config: {
        api_url: process.env.TAMARA_API_URL,
        api_token: process.env.TAMARA_API_TOKEN,
        notification_key: process.env.TAMARA_NOTIFICATION_KEY
      },
      supportedCurrencies: ['SAR', 'AED', 'KWD'],
      features: ['pay_in_3', 'pay_in_4', 'pay_next_month', 'installments']
    });

    this.gateways.set('tabby', {
      id: 'tabby',
      name: 'Tabby',
      type: 'bnpl',
      isActive: true,
      config: {
        public_key: process.env.TABBY_PUBLIC_KEY,
        secret_key: process.env.TABBY_SECRET_KEY,
        api_url: process.env.TABBY_API_URL
      },
      supportedCurrencies: ['SAR', 'AED', 'KWD', 'BHD'],
      features: ['split_in_4', 'monthly_installments', 'instant_approval']
    });

    // Cryptocurrency Payment Gateway
    this.gateways.set('coinbase', {
      id: 'coinbase',
      name: 'Coinbase Commerce',
      type: 'crypto',
      isActive: true,
      config: {
        api_key: process.env.COINBASE_API_KEY,
        webhook_secret: process.env.COINBASE_WEBHOOK_SECRET
      },
      supportedCurrencies: ['BTC', 'ETH', 'USDC', 'LTC', 'BCH'],
      features: ['bitcoin', 'ethereum', 'stablecoins', 'instant_settlement']
    });

    // Subscription Management
    this.gateways.set('chargebee', {
      id: 'chargebee',
      name: 'Chargebee',
      type: 'subscription',
      isActive: true,
      config: {
        site: process.env.CHARGEBEE_SITE,
        api_key: process.env.CHARGEBEE_API_KEY
      },
      supportedCurrencies: ['USD', 'SAR', 'AED', 'EUR'],
      features: ['recurring_billing', 'subscription_management', 'dunning_management', 'metered_billing']
    });
  }

  // Get all active payment gateways
  getActiveGateways(): PaymentGateway[] {
    return Array.from(this.gateways.values()).filter(gateway => gateway.isActive);
  }

  // Get gateway by ID
  getGateway(gatewayId: string): PaymentGateway | undefined {
    return this.gateways.get(gatewayId);
  }

  // Get gateways by type
  getGatewaysByType(type: PaymentGateway['type']): PaymentGateway[] {
    return Array.from(this.gateways.values()).filter(
      gateway => gateway.type === type && gateway.isActive
    );
  }

  // Get supported currencies for a gateway
  getSupportedCurrencies(gatewayId: string): string[] {
    const gateway = this.getGateway(gatewayId);
    return gateway?.supportedCurrencies || [];
  }

  // Process payment through specified gateway
  async processPayment(gatewayId: string, paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const gateway = this.getGateway(gatewayId);
    if (!gateway) {
      return {
        success: false,
        payment_id: '',
        status: 'failed',
        error_message: 'Payment gateway not found'
      };
    }

    try {
      let result: PaymentResponse;

      switch (gateway.type) {
        case 'stripe':
          result = await this.processStripePayment(gateway, paymentRequest);
          break;
        case 'paypal':
          result = await this.processPayPalPayment(gateway, paymentRequest);
          break;
        case 'saudi_local':
          result = await this.processSaudiLocalPayment(gateway, paymentRequest);
          break;
        case 'bnpl':
          result = await this.processBNPLPayment(gateway, paymentRequest);
          break;
        case 'crypto':
          result = await this.processCryptoPayment(gateway, paymentRequest);
          break;
        case 'subscription':
          result = await this.processSubscriptionPayment(gateway, paymentRequest);
          break;
        default:
          result = {
            success: false,
            payment_id: '',
            status: 'failed',
            error_message: 'Unsupported payment gateway type'
          };
      }

      // Log payment attempt
      await this.logPaymentAttempt(gatewayId, paymentRequest, result);

      return result;
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        payment_id: '',
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Stripe payment processing
  private async processStripePayment(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    // Stripe implementation
    const payment_id = `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock Stripe payment processing
    const success = Math.random() > 0.1; // 90% success rate
    
    return {
      success,
      payment_id,
      status: success ? 'completed' : 'failed',
      transaction_id: success ? `pi_${Math.random().toString(36).substr(2, 24)}` : undefined,
      gateway_response: {
        gateway: 'stripe',
        amount: request.amount,
        currency: request.currency
      },
      error_message: success ? undefined : 'Payment declined by issuer'
    };
  }

  // PayPal payment processing
  private async processPayPalPayment(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    const payment_id = `paypal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock PayPal payment processing
    const success = Math.random() > 0.05; // 95% success rate
    
    return {
      success,
      payment_id,
      status: success ? 'completed' : 'failed',
      transaction_id: success ? `PAY-${Math.random().toString(36).substr(2, 17).toUpperCase()}` : undefined,
      gateway_response: {
        gateway: 'paypal',
        amount: request.amount,
        currency: request.currency
      },
      redirect_url: success ? `https://paypal.com/checkout/${payment_id}` : undefined,
      error_message: success ? undefined : 'PayPal payment failed'
    };
  }

  // Saudi Local payment processing
  private async processSaudiLocalPayment(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    const payment_id = `${gateway.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock Saudi local payment processing
    const success = Math.random() > 0.03; // 97% success rate
    
    return {
      success,
      payment_id,
      status: success ? 'completed' : 'failed',
      transaction_id: success ? `${gateway.id.toUpperCase()}-${Math.random().toString(36).substr(2, 12)}` : undefined,
      gateway_response: {
        gateway: gateway.id,
        amount: request.amount,
        currency: request.currency
      },
      error_message: success ? undefined : 'Local payment processing failed'
    };
  }

  // BNPL payment processing
  private async processBNPLPayment(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    const payment_id = `${gateway.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock BNPL payment processing
    const success = Math.random() > 0.15; // 85% success rate (credit checks)
    
    return {
      success,
      payment_id,
      status: success ? 'pending' : 'failed', // BNPL usually requires approval
      transaction_id: success ? `${gateway.id.toUpperCase()}-${Math.random().toString(36).substr(2, 10)}` : undefined,
      gateway_response: {
        gateway: gateway.id,
        amount: request.amount,
        currency: request.currency,
        installments: 4,
        first_payment: request.amount / 4
      },
      redirect_url: success ? `https://${gateway.id}.com/checkout/${payment_id}` : undefined,
      error_message: success ? undefined : 'BNPL credit check failed'
    };
  }

  // Cryptocurrency payment processing
  private async processCryptoPayment(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    const payment_id = `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock crypto payment processing
    const success = Math.random() > 0.02; // 98% success rate
    
    return {
      success,
      payment_id,
      status: success ? 'pending' : 'failed', // Crypto payments need confirmation
      transaction_id: success ? `0x${Math.random().toString(16).substr(2, 64)}` : undefined,
      gateway_response: {
        gateway: 'coinbase',
        amount: request.amount,
        currency: request.currency,
        crypto_address: success ? `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa` : undefined
      },
      error_message: success ? undefined : 'Cryptocurrency payment failed'
    };
  }

  // Subscription payment processing
  private async processSubscriptionPayment(gateway: PaymentGateway, request: PaymentRequest): Promise<PaymentResponse> {
    const payment_id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock subscription payment processing
    const success = Math.random() > 0.05; // 95% success rate
    
    return {
      success,
      payment_id,
      status: success ? 'completed' : 'failed',
      transaction_id: success ? `sub_${Math.random().toString(36).substr(2, 24)}` : undefined,
      gateway_response: {
        gateway: 'chargebee',
        amount: request.amount,
        currency: request.currency,
        subscription_id: success ? `sub_${Math.random().toString(36).substr(2, 12)}` : undefined,
        next_billing_date: success ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
      },
      error_message: success ? undefined : 'Subscription setup failed'
    };
  }

  // Log payment attempt to database
  private async logPaymentAttempt(
    gatewayId: string,
    request: PaymentRequest,
    response: PaymentResponse
  ): Promise<void> {
    try {
      await this.supabase.from('payment_logs').insert({
        gateway_id: gatewayId,
        payment_id: response.payment_id,
        amount: request.amount,
        currency: request.currency,
        status: response.status,
        success: response.success,
        transaction_id: response.transaction_id,
        customer_id: request.customer_id,
        metadata: request.metadata,
        gateway_response: response.gateway_response,
        error_message: response.error_message,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log payment attempt:', error);
    }
  }

  // Get payment history
  async getPaymentHistory(filters?: {
    gateway_id?: string;
    customer_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
  }): Promise<any[]> {
    try {
      let query = this.supabase.from('payment_logs').select('*');

      if (filters?.gateway_id) {
        query = query.eq('gateway_id', filters.gateway_id);
      }
      if (filters?.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.start_date) {
        query = query.gte('created_at', filters.start_date);
      }
      if (filters?.end_date) {
        query = query.lte('created_at', filters.end_date);
      }

      query = query.order('created_at', { ascending: false });

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      return [];
    }
  }

  // Get payment statistics
  async getPaymentStats(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{
    total_payments: number;
    successful_payments: number;
    failed_payments: number;
    total_amount: number;
    success_rate: number;
    gateway_breakdown: Record<string, any>;
  }> {
    try {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }

      const { data, error } = await this.supabase
        .from('payment_logs')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const payments = data || [];
      const successfulPayments = payments.filter(p => p.success);
      const totalAmount = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

      // Gateway breakdown
      const gatewayBreakdown: Record<string, any> = {};
      payments.forEach(payment => {
        if (!gatewayBreakdown[payment.gateway_id]) {
          gatewayBreakdown[payment.gateway_id] = {
            total: 0,
            successful: 0,
            failed: 0,
            amount: 0
          };
        }
        gatewayBreakdown[payment.gateway_id].total++;
        if (payment.success) {
          gatewayBreakdown[payment.gateway_id].successful++;
          gatewayBreakdown[payment.gateway_id].amount += payment.amount;
        } else {
          gatewayBreakdown[payment.gateway_id].failed++;
        }
      });

      return {
        total_payments: payments.length,
        successful_payments: successfulPayments.length,
        failed_payments: payments.length - successfulPayments.length,
        total_amount: totalAmount,
        success_rate: payments.length > 0 ? (successfulPayments.length / payments.length) * 100 : 0,
        gateway_breakdown: gatewayBreakdown
      };
    } catch (error) {
      console.error('Failed to fetch payment stats:', error);
      return {
        total_payments: 0,
        successful_payments: 0,
        failed_payments: 0,
        total_amount: 0,
        success_rate: 0,
        gateway_breakdown: {}
      };
    }
  }
}

export const paymentGatewayManager = new PaymentGatewayManager();
