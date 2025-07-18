"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { Wallet, CreditCard, Plus, Minus, DollarSign, TrendingUp, TrendingDown, RefreshCw, Download, Eye, Gift, Crown } from 'lucide-react';

export const dynamic = 'force-dynamic'

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'refund' | 'bonus';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

interface BalanceInfo {
  main: number;
  pending: number;
  bonus: number;
  total: number;
}

export default function BalancePage() {
  const [balance, setBalance] = useState<BalanceInfo>({
    main: 2850.00,
    pending: 150.00,
    bonus: 50.00,
    total: 3050.00
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      type: 'deposit',
      amount: 1000.00,
      description: 'إيداع من بطاقة ائتمانية',
      date: '2024-03-20T10:30:00',
      status: 'completed',
      reference: 'DEP123456'
    },
    {
      id: 'TXN002',
      type: 'purchase',
      amount: -250.50,
      description: 'شراء - أسمنت بورتلاند',
      date: '2024-03-19T14:15:00',
      status: 'completed',
      reference: 'PUR789123'
    },
    {
      id: 'TXN003',
      type: 'bonus',
      amount: 50.00,
      description: 'مكافأة العضوية الذهبية',
      date: '2024-03-18T09:45:00',
      status: 'completed',
      reference: 'BON456789'
    },
    {
      id: 'TXN004',
      type: 'deposit',
      amount: 500.00,
      description: 'إيداع مصرفي',
      date: '2024-03-17T16:20:00',
      status: 'pending',
      reference: 'DEP987654'
    },
    {
      id: 'TXN005',
      type: 'withdrawal',
      amount: -100.00,
      description: 'سحب إلى المحفظة',
      date: '2024-03-16T11:30:00',
      status: 'completed',
      reference: 'WTH654321'
    }
  ]);

  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'deposit': return <Plus className="w-5 h-5 text-green-600" />;
      case 'withdrawal': return <Minus className="w-5 h-5 text-red-600" />;
      case 'purchase': return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'refund': return <RefreshCw className="w-5 h-5 text-purple-600" />;
      case 'bonus': return <Gift className="w-5 h-5 text-yellow-600" />;
      default: return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionText = (type: string) => {
    switch(type) {
      case 'deposit': return 'إيداع';
      case 'withdrawal': return 'سحب';
      case 'purchase': return 'شراء';
      case 'refund': return 'استرداد';
      case 'bonus': return 'مكافأة';
      default: return 'معاملة';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed': return 'مكتملة';
      case 'pending': return 'قيد المعالجة';
      case 'failed': return 'فاشلة';
      default: return 'غير محدد';
    }
  };

  const handleAddFunds = () => {
    if (!addAmount || parseFloat(addAmount) <= 0) return;
    
    const newTransaction: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'deposit',
      amount: parseFloat(addAmount),
      description: `إيداع من ${paymentMethod === 'card' ? 'بطاقة ائتمانية' : 'حساب مصرفي'}`,
      date: new Date().toISOString(),
      status: 'pending',
      reference: `DEP${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };

    setTransactions([newTransaction, ...transactions]);
    setBalance(prev => ({
      ...prev,
      pending: prev.pending + parseFloat(addAmount),
      total: prev.total + parseFloat(addAmount)
    }));
    
    setAddAmount('');
    setShowAddFunds(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Wallet className="w-8 h-8 text-green-600" />
          محفظة بنا
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          إدارة رصيدك ومتابعة معاملاتك المالية
        </Typography>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <EnhancedCard className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="caption" size="sm" className="text-green-100 mb-1">الرصيد الأساسي</Typography>
              <Typography variant="heading" size="2xl" weight="bold">{balance.main.toLocaleString('ar-SA')} ر.س</Typography>
            </div>
            <Wallet className="w-8 h-8 text-green-200" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="caption" size="sm" className="text-yellow-100 mb-1">رصيد معلق</Typography>
              <Typography variant="heading" size="2xl" weight="bold">{balance.pending.toLocaleString('ar-SA')} ر.س</Typography>
            </div>
            <RefreshCw className="w-8 h-8 text-yellow-200" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="caption" size="sm" className="text-purple-100 mb-1">رصيد المكافآت</Typography>
              <Typography variant="heading" size="2xl" weight="bold">{balance.bonus.toLocaleString('ar-SA')} ر.س</Typography>
            </div>
            <Gift className="w-8 h-8 text-purple-200" />
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="caption" size="sm" className="text-blue-100 mb-1">إجمالي الرصيد</Typography>
              <Typography variant="heading" size="2xl" weight="bold">{balance.total.toLocaleString('ar-SA')} ر.س</Typography>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </EnhancedCard>
      </div>

      {/* Quick Actions */}
      <EnhancedCard className="p-6 mb-8">
        <Typography variant="subheading" size="xl" weight="semibold" className="mb-4">العمليات السريعة</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => setShowAddFunds(true)}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center gap-3"
          >
            <Plus className="w-5 h-5" />
            إضافة رصيد
          </Button>
          
          <Button
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50 p-4 rounded-lg flex items-center gap-3"
          >
            <Minus className="w-5 h-5" />
            سحب رصيد
          </Button>
          
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 p-4 rounded-lg flex items-center gap-3"
          >
            <Download className="w-5 h-5" />
            تنزيل كشف حساب
          </Button>
        </div>
      </EnhancedCard>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EnhancedCard className="p-6 m-4 max-w-md w-full">
            <Typography variant="subheading" size="xl" weight="semibold" className="mb-4">إضافة رصيد</Typography>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ (ر.س)</label>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="card">بطاقة ائتمانية</option>
                  <option value="bank">حساب مصرفي</option>
                  <option value="wallet">محفظة إلكترونية</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddFunds}
                disabled={!addAmount || parseFloat(addAmount) <= 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                إضافة رصيد
              </Button>
              <Button
                onClick={() => setShowAddFunds(false)}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </Button>
            </div>
          </EnhancedCard>
        </div>
      )}

      {/* Transaction History */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <Typography variant="subheading" size="xl" weight="semibold">سجل المعاملات</Typography>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              عرض الكل
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تصدير
            </Button>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
              لا توجد معاملات بعد
            </Typography>
            <Typography variant="body" size="lg" className="text-gray-500">
              ستظهر جميع معاملاتك المالية هنا
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <EnhancedCard key={transaction.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900">
                          {transaction.description}
                        </Typography>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                          {getStatusText(transaction.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{getTransactionText(transaction.type)}</span>
                        <span>{new Date(transaction.date).toLocaleDateString('ar-SA')}</span>
                        {transaction.reference && <span>#{transaction.reference}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <Typography
                      variant="subheading"
                      size="lg"
                      weight="bold"
                      className={
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('ar-SA')} ر.س
                    </Typography>
                  </div>
                </div>
              </EnhancedCard>
            ))}
          </div>
        )}
      </div>

      {/* Membership Benefits */}
      <EnhancedCard className="p-6 mt-8 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-6 h-6 text-yellow-600" />
          <Typography variant="subheading" size="xl" weight="semibold" className="text-yellow-800">
            العضوية الذهبية
          </Typography>
        </div>
        
        <Typography variant="body" size="lg" className="text-yellow-700 mb-4">
          احصل على مكافآت إضافية وخصومات حصرية مع العضوية الذهبية
        </Typography>
        
        <Button
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          ترقية العضوية
        </Button>
      </EnhancedCard>

      {/* Floating Help */}
      <Link href="/user/help-center" className="fixed bottom-8 left-8 bg-green-600 text-white rounded-full shadow-lg px-5 py-3 hover:bg-green-700 z-50">
        مساعدة؟
      </Link>
    </div>
  );
}
