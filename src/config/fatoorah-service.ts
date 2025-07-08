// @ts-nocheck
// Fatoorah Payment Gateway Integration Service
import axios from 'axios';

interface FatoorahConfig {
  baseUrl: string;
  token: string;
  testMode: boolean;
}

interface PaymentRequest {
  InvoiceAmount: number;
  CurrencyIso: string;
  CustomerName: string;
  CustomerEmail?: string;
  CustomerMobile?: string;
  CallBackUrl: string;
  ErrorUrl: string;
  Language: string;
  DisplayCurrencyIso: string;
  MobileCountryCode?: string;
  CustomerReference?: string;
  InvoiceItems?: Array<{
    ItemName: string;
    Quantity: number;
    UnitPrice: number;
  }>;
}

interface PaymentResponse {
  IsSuccess: boolean;
  Message: string;
  ValidationErrors?: string[];
  Data: {
    InvoiceId: number;
    PaymentURL: string;
  };
}

interface PaymentStatusResponse {
  IsSuccess: boolean;
  Message: string;
  Data: {
    InvoiceId: number;
    InvoiceStatus: string;
    InvoiceValue: number;
    CustomerName: string;
    CustomerEmail: string;
    CustomerMobile: string;
    InvoiceDisplayValue: string;
    DueDeposit: number;
    PaidDeposit: number;
    PaidDeposits: Array<{
      PaymentGateway: string;
      GatewayTransactionId: string;
      PaymentId: number;
      AuthorizationId: string;
      TransactionId: string;
      ReferenceId: string;
      TrackId: string;
      Amount: number;
      Currency: string;
      Error: string;
      CardNumber: string;
      ErrorCode: string;
    }>;
  };
}

export class FatoorahService {
  private config: FatoorahConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_FATOORAH_BASE_URL || 'https://apitest.myfatoorah.com',
      token: process.env.FATOORAH_API_TOKEN || '',
      testMode: process.env.NODE_ENV !== 'production'
    };
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Create a new payment request
   */
  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/v2/SendPayment`,
        paymentData,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Fatoorah payment creation error:', error);
      throw new Error('Failed to create payment request');
    }
  }

  /**
   * Check payment status
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/v2/getPaymentStatus`,
        { Key: paymentId, KeyType: 'PaymentId' },
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Fatoorah payment status check error:', error);
      throw new Error('Failed to check payment status');
    }
  }

  /**
   * Get payment status by invoice ID
   */
  async getPaymentStatusByInvoiceId(invoiceId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/v2/getPaymentStatus`,
        { Key: invoiceId, KeyType: 'InvoiceId' },
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Fatoorah payment status check error:', error);
      throw new Error('Failed to check payment status');
    }
  }

  /**
   * Process payment callback
   */
  async processCallback(paymentId: string, status: string) {
    try {
      const paymentStatus = await this.getPaymentStatus(paymentId);
      
      if (paymentStatus.IsSuccess) {
        return {
          success: true,
          status: paymentStatus.Data.InvoiceStatus,
          amount: paymentStatus.Data.InvoiceValue,
          transactionId: paymentStatus.Data.PaidDeposits[0]?.TransactionId,
          gatewayTransactionId: paymentStatus.Data.PaidDeposits[0]?.GatewayTransactionId
        };
      }

      return {
        success: false,
        message: paymentStatus.Message
      };
    } catch (error) {
      console.error('Fatoorah callback processing error:', error);
      return {
        success: false,
        message: 'Failed to process payment callback'
      };
    }
  }

  /**
   * Create payment URL for invoice
   */
  async createInvoicePaymentUrl(invoice: {
    id: string;
    total_amount: number;
    buyer_name: string;
    buyer_email?: string;
    buyer_phone?: string;
    invoice_number: string;
    items: Array<{
      description: string;
      quantity: number;
      unit_price: number;
    }>;
  }): Promise<{ success: boolean; paymentUrl?: string; message?: string }> {
    try {
      const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/fatoorah/callback`;
      const errorUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/error`;

      const paymentRequest: PaymentRequest = {
        InvoiceAmount: invoice.total_amount,
        CurrencyIso: 'SAR',
        CustomerName: invoice.buyer_name,
        CustomerEmail: invoice.buyer_email,
        CustomerMobile: invoice.buyer_phone,
        CallBackUrl: callbackUrl,
        ErrorUrl: errorUrl,
        Language: 'ar',
        DisplayCurrencyIso: 'SAR',
        CustomerReference: invoice.invoice_number,
        InvoiceItems: invoice.items.map(item => ({
          ItemName: item.description,
          Quantity: item.quantity,
          UnitPrice: item.unit_price
        }))
      };

      const response = await this.createPayment(paymentRequest);

      if (response.IsSuccess) {
        return {
          success: true,
          paymentUrl: response.Data.PaymentURL
        };
      }

      return {
        success: false,
        message: response.Message
      };
    } catch (error) {
      console.error('Error creating invoice payment URL:', error);
      return {
        success: false,
        message: 'فشل في إنشاء رابط الدفع'
      };
    }
  }
}

export const fatoorahService = new FatoorahService();


