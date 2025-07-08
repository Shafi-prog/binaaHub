// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { paymentGatewayManager, PaymentGateway, PaymentRequest, PaymentResponse } from '@/lib/payments/payment-gateway-manager';
import { 
  CreditCard, 
  Wallet, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  PieChart,
  BarChart3,
  Smartphone,
  Globe,
  Bitcoin
} from 'lucide-react';

interface PaymentStats {
  total_payments: number;
  successful_payments: number;
  failed_payments: number;
  total_amount: number;
  success_rate: number;
  gateway_breakdown: Record<string, any>;
}

export function PaymentGatewayIntegration() {
  const [activeGateways, setActiveGateways] = useState<PaymentGateway[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(100);
  const [paymentCurrency, setPaymentCurrency] = useState<string>('SAR');
  const [paymentDescription, setPaymentDescription] = useState<string>('Test Payment');
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);
  const [lastPaymentResult, setLastPaymentResult] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      
      // Load active gateways
      const gateways = paymentGatewayManager.getActiveGateways();
      setActiveGateways(gateways);
      
      if (gateways.length > 0) {
        setSelectedGateway(gateways[0].id);
      }

      // Load payment stats with better error handling
      try {
        const stats = await paymentGatewayManager.getPaymentStats('month');
        setPaymentStats(stats);
      } catch (statsError) {
        console.warn('Failed to load payment stats, using fallback:', statsError);
        setPaymentStats({
          total_payments: 0,
          successful_payments: 0,
          failed_payments: 0,
          total_amount: 0,
          success_rate: 0,
          gateway_breakdown: {}
        });
      }

      // Load recent payment history with better error handling
      try {
        const history = await paymentGatewayManager.getPaymentHistory({ limit: 10 });
        setPaymentHistory(history);
      } catch (historyError) {
        console.warn('Failed to load payment history, using fallback:', historyError);
        setPaymentHistory([]);
      }
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processTestPayment = async () => {
    if (!selectedGateway) return;

    setProcessingPayment(true);
    try {
      const paymentRequest: PaymentRequest = {
        amount: paymentAmount,
        currency: paymentCurrency,
        description: paymentDescription,
        customer_id: 'test_customer_123',
        metadata: {
          test_payment: true,
          timestamp: new Date().toISOString()
        }
      };

      const result = await paymentGatewayManager.processPayment(selectedGateway, paymentRequest);
      setLastPaymentResult(result);

      // Refresh data after payment
      setTimeout(() => {
        loadPaymentData();
      }, 1000);
    } catch (error) {
      console.error('Payment processing failed:', error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const getGatewayIcon = (type: PaymentGateway['type']) => {
    switch (type) {
      case 'stripe': return <CreditCard className="w-5 h-5" />;
      case 'paypal': return <Wallet className="w-5 h-5" />;
      case 'saudi_local': return <Smartphone className="w-5 h-5" />;
      case 'bnpl': return <Calendar className="w-5 h-5" />;
      case 'crypto': return <Bitcoin className="w-5 h-5" />;
      case 'subscription': return <Clock className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string, success: boolean) => {
    if (success && (status === 'completed' || status === 'pending')) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (status === 'failed') {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment gateways...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payment Gateway Integration</h1>
            <p className="text-indigo-100 mt-1">
              15+ payment methods • 99.8% success rate • Global coverage
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {activeGateways.length}
            </div>
            <div className="text-indigo-100">Active Gateways</div>
          </div>
        </div>
      </div>

      {/* Payment Statistics */}
      {paymentStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{paymentStats.total_payments}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {paymentStats.success_rate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {paymentStats.total_amount.toLocaleString()} SAR
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Payments</p>
                <p className="text-2xl font-bold text-red-600">{paymentStats.failed_payments}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Payment Gateways */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-indigo-600" />
              Active Payment Gateways
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {activeGateways.map((gateway) => (
              <div key={gateway.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    {getGatewayIcon(gateway.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{gateway.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{gateway.type}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {gateway.supportedCurrencies.slice(0, 3).map((currency) => (
                        <span key={currency} className="px-2 py-1 bg-gray-100 text-xs rounded">
                          {currency}
                        </span>
                      ))}
                      {gateway.supportedCurrencies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                          +{gateway.supportedCurrencies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <p className="text-xs text-gray-500 mt-1">Active</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Payment Processing */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
              Test Payment Processing
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Gateway
              </label>
              <select
                value={selectedGateway}
                onChange={(e) => setSelectedGateway(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {activeGateways.map((gateway) => (
                  <option key={gateway.id} value={gateway.id}>
                    {gateway.name} ({gateway.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={paymentCurrency}
                  onChange={(e) => setPaymentCurrency(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="SAR">SAR</option>
                  <option value="USD">USD</option>
                  <option value="AED">AED</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={paymentDescription}
                onChange={(e) => setPaymentDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              onClick={processTestPayment}
              disabled={processingPayment || !selectedGateway}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {processingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                'Process Test Payment'
              )}
            </button>

            {lastPaymentResult && (
              <div className={`p-4 rounded-lg ${
                lastPaymentResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  {getStatusIcon(lastPaymentResult.status, lastPaymentResult.success)}
                  <span className={`ml-2 font-medium ${
                    lastPaymentResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    Payment {lastPaymentResult.success ? 'Successful' : 'Failed'}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Payment ID:</strong> {lastPaymentResult.payment_id}</p>
                  <p><strong>Status:</strong> {lastPaymentResult.status}</p>
                  {lastPaymentResult.transaction_id && (
                    <p><strong>Transaction ID:</strong> {lastPaymentResult.transaction_id}</p>
                  )}
                  {lastPaymentResult.error_message && (
                    <p className="text-red-600"><strong>Error:</strong> {lastPaymentResult.error_message}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Payment History */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
            Recent Payment History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gateway
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.length > 0 ? (
                paymentHistory.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.payment_id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.transaction_id || 'No transaction ID'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full capitalize">
                          {payment.gateway_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.amount.toLocaleString()} {payment.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status, payment.success)}
                        <span className={`ml-2 text-sm capitalize ${
                          payment.success ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No payment history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gateway Performance Breakdown */}
      {paymentStats && Object.keys(paymentStats.gateway_breakdown).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
              Gateway Performance Breakdown
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(paymentStats.gateway_breakdown).map(([gatewayId, stats]) => (
                <div key={gatewayId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 capitalize">{gatewayId}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      stats.successful > stats.failed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {stats.total > 0 ? ((stats.successful / stats.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium">{stats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Successful:</span>
                      <span className="font-medium text-green-600">{stats.successful}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Failed:</span>
                      <span className="font-medium text-red-600">{stats.failed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Volume:</span>
                      <span className="font-medium">{stats.amount.toLocaleString()} SAR</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


