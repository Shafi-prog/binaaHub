'use client';

import React, { useState } from 'react';
import { EnhancedModal, EnhancedButton } from '@/components/ui/enhanced-components';
import { Typography } from '@/components/ui/enhanced-components';
import { ClientIcon } from '@/components/icons';
import { toast } from 'react-hot-toast';

interface ForSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (forSaleData: {
    for_sale: boolean;
    advertisement_number: string;
    sale_price: string;
    sale_description: string;
    profit_percentage: number;
  }) => void;
  projectName: string;
  totalCost?: number; // Total actual cost of the project
  budget?: number; // Original budget for reference
  loading?: boolean;
}

export default function ForSaleModal({
  isOpen,
  onClose,
  onSubmit,
  projectName,
  totalCost = 0,
  budget = 0,
  loading = false,
}: ForSaleModalProps) {
  const [decision, setDecision] = useState<'yes' | 'no' | null>(null);
  const [forSaleData, setForSaleData] = useState({
    advertisement_number: '',
    sale_price: '',
    sale_description: '',
    profit_percentage: 10, // Default 10% profit
  });

  // Calculate suggested sale price based on total cost + profit
  const calculateSalePrice = (cost: number, profitPercentage: number) => {
    return Math.round(cost * (1 + profitPercentage / 100));
  };

  const suggestedPrice = totalCost > 0 ? calculateSalePrice(totalCost, forSaleData.profit_percentage) : 0;
  const handleDecision = (choice: 'yes' | 'no') => {
    setDecision(choice);
    if (choice === 'no') {
      // If user doesn't want to list for sale, submit with for_sale: false
      onSubmit({
        for_sale: false,
        advertisement_number: '',
        sale_price: '',
        sale_description: '',
        profit_percentage: 0,
      });
    }
  };

  const handleForSaleSubmit = () => {
    // Validate required fields
    if (!forSaleData.advertisement_number.trim()) {
      toast.error('رقم الإعلان مطلوب');
      return;
    }

    onSubmit({
      for_sale: true,
      ...forSaleData,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle profit percentage change and auto-update sale price
    if (name === 'profit_percentage') {
      const profitPercentage = parseFloat(value) || 0;
      const newSalePrice = totalCost > 0 ? calculateSalePrice(totalCost, profitPercentage) : 0;
      
      setForSaleData(prev => ({
        ...prev,
        profit_percentage: profitPercentage,
        sale_price: newSalePrice.toString(),
      }));
    } else {
      setForSaleData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetModal = () => {
    setDecision(null);
    setForSaleData({
      advertisement_number: '',
      sale_price: '',
      sale_description: '',
      profit_percentage: 10,
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <EnhancedModal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      title="🎉 تهانينا! مشروعك مكتمل"
    >
      <div className="space-y-6">
        {/* Congratulations Section */}
        <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClientIcon type="shield" size={32} className="text-green-600" />
          </div>
          <Typography variant="heading" size="xl" weight="bold" className="text-green-800 mb-2">
            مبروك إكمال مشروع "{projectName}"!
          </Typography>            <Typography variant="body" className="text-green-700">
              لقد تم وضع علامة على مشروعك كمكتمل بنجاح
            </Typography>
        </div>

        {decision === null && (
          <div className="space-y-4">
            <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 text-center">
              هل تريد عرض مشروعك للبيع؟
            </Typography>            <Typography variant="body" className="text-gray-600 text-center">
              يمكنك الآن عرض مشروعك المكتمل للبيع على منصة بناء ليتمكن المشترين المهتمين من العثور عليه
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <EnhancedButton
                variant="success"
                size="lg"
                onClick={() => handleDecision('yes')}
                fullWidth
                leftIcon={<ClientIcon type="money" size={20} />}
              >
                نعم، أريد عرضه للبيع
              </EnhancedButton>
              <EnhancedButton
                variant="secondary"
                size="lg"
                onClick={() => handleDecision('no')}
                fullWidth
                leftIcon={<ClientIcon type="dashboard" size={20} />}
              >
                لا، شكراً
              </EnhancedButton>
            </div>
          </div>
        )}

        {decision === 'yes' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Typography variant="subheading" size="md" weight="semibold" className="text-blue-800 mb-2">
                معلومات مطلوبة لعرض المشروع للبيع
              </Typography>
              <Typography variant="body" size="sm" className="text-blue-700">
                يرجى ملء المعلومات التالية لعرض مشروعك في صفحة المشاريع المعروضة للبيع
              </Typography>
            </div>            <div className="space-y-4">
              {/* Project Cost Summary */}
              {totalCost > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <Typography variant="subheading" size="md" weight="semibold" className="text-green-800 mb-3">
                    ملخص تكاليف المشروع
                  </Typography>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">الميزانية الأصلية:</span>
                        <span className="font-medium">{budget.toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">التكلفة الفعلية:</span>
                        <span className="font-medium text-green-700">{totalCost.toLocaleString()} ر.س</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">نسبة الربح:</span>
                        <span className="font-medium text-blue-600">{forSaleData.profit_percentage}%</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-700 font-medium">السعر المقترح:</span>
                        <span className="font-bold text-green-600">{suggestedPrice.toLocaleString()} ر.س</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profit Calculation */}
              <div>
                <Typography variant="label" size="sm" className="block mb-2">
                  نسبة الربح المطلوبة (%)
                </Typography>
                <input
                  name="profit_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={forSaleData.profit_percentage}
                  onChange={handleInputChange}
                  className="font-tajawal w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <Typography variant="caption" size="sm" className="text-gray-500 mt-1">
                  {totalCost > 0 
                    ? `سيكون السعر النهائي: ${suggestedPrice.toLocaleString()} ر.س (${totalCost.toLocaleString()} + ${forSaleData.profit_percentage}%)`
                    : 'حدد نسبة الربح المطلوبة من التكلفة الإجمالية'
                  }
                </Typography>
              </div>

              <div>
                <Typography variant="label" size="sm" className="block mb-2 text-red-600">
                  رقم الإعلان * (مطلوب)
                </Typography>
                <input
                  name="advertisement_number"
                  value={forSaleData.advertisement_number}
                  onChange={handleInputChange}
                  placeholder="مثال: AD-2025-001"
                  className="font-tajawal w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
                <Typography variant="caption" size="sm" className="text-gray-500 mt-1">
                  رقم فريد لتمييز إعلان مشروعك
                </Typography>
              </div>              <div>
                <Typography variant="label" size="sm" className="block mb-2">
                  سعر البيع النهائي (ر.س)
                </Typography>
                <input
                  name="sale_price"
                  type="number"
                  value={forSaleData.sale_price || (suggestedPrice > 0 ? suggestedPrice : '')}
                  onChange={handleInputChange}
                  placeholder={suggestedPrice > 0 ? suggestedPrice.toString() : "أدخل السعر المطلوب"}
                  className="font-tajawal w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <Typography variant="caption" size="sm" className="text-gray-500 mt-1">
                  {totalCost > 0 
                    ? `السعر المحسوب تلقائياً: ${suggestedPrice.toLocaleString()} ر.س - يمكنك تعديله حسب الحاجة`
                    : 'حدد سعر البيع المطلوب للمشروع'
                  }
                </Typography>
              </div>

              <div>
                <Typography variant="label" size="sm" className="block mb-2">
                  وصف الإعلان
                </Typography>
                <textarea
                  name="sale_description"
                  value={forSaleData.sale_description}
                  onChange={handleInputChange}
                  rows={4}
                  className="font-tajawal w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="اكتب وصفاً جذاباً للمشروع لعرضه للمشترين المحتملين... مثل: فيلا حديثة مساحة 400 متر، تشطيب فاخر، موقع ممتاز"
                />
                <Typography variant="caption" size="sm" className="text-gray-500 mt-1">
                  وصف تفصيلي يساعد المشترين في فهم مميزات مشروعك
                </Typography>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <EnhancedButton
                variant="primary"
                size="lg"
                onClick={handleForSaleSubmit}
                loading={loading}
                disabled={!forSaleData.advertisement_number.trim()}
                fullWidth
                leftIcon={<ClientIcon type="money" size={20} />}
              >
                {loading ? 'جاري النشر...' : 'نشر المشروع للبيع'}
              </EnhancedButton>
              <EnhancedButton
                variant="secondary"
                size="lg"
                onClick={() => setDecision(null)}
                fullWidth
              >
                عودة
              </EnhancedButton>
            </div>
          </div>
        )}

        {decision === 'no' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <ClientIcon type="dashboard" size={32} className="text-blue-600" />
            </div>
            <Typography variant="body" size="lg" className="text-gray-600">
              تم حفظ مشروعك كمكتمل بنجاح!
            </Typography>
            <Typography variant="body" size="sm" className="text-gray-500">
              يمكنك دائماً عرضه للبيع لاحقاً من صفحة تعديل المشروع
            </Typography>
          </div>
        )}
      </div>
    </EnhancedModal>
  );
}
