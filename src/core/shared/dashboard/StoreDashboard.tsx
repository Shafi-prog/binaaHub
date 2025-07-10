import React from 'react';
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  salesGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  revenueGrowth: number;
}

interface StoreDashboardProps {
  stats: DashboardStats;
  storeName: string;
}

/**
 * Store owner dashboard - ERP-style interface
 * Complete business management for individual stores
 */
export const StoreDashboard: React.FC<StoreDashboardProps> = ({ stats, storeName }) => {
  const statCards = [
    {
      title: 'إجمالي المبيعات',
      value: stats.totalSales,
      growth: stats.salesGrowth,
      icon: ChartBarIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders,
      growth: stats.ordersGrowth,
      icon: ShoppingBagIcon,
      color: 'bg-green-500'
    },
    {
      title: 'العملاء',
      value: stats.totalCustomers,
      growth: stats.customersGrowth,
      icon: UserGroupIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'الإيرادات',
      value: `${stats.totalRevenue.toLocaleString()} ر.س`,
      growth: stats.revenueGrowth,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          لوحة تحكم متجر {storeName}
        </h1>
        <p className="text-gray-600 mt-2">
          نظرة عامة على أداء متجرك اليوم
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              {card.growth > 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 ml-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 ml-1" />
              )}
              <span className={`text-sm ${card.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(card.growth)}%
              </span>
              <span className="text-gray-500 text-sm mr-2">
                من الشهر الماضي
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            إجراءات سريعة
          </h3>
          <div className="space-y-2">
            <button className="w-full text-right p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              إضافة منتج جديد
            </button>
            <button className="w-full text-right p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              معالجة الطلبات
            </button>
            <button className="w-full text-right p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              إدارة المخزون
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            الطلبات الأخيرة
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">طلب #1234</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                مكتمل
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">طلب #1235</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                قيد التنفيذ
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">طلب #1236</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                جديد
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            تنبيهات المخزون
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
              <span className="text-sm text-gray-600">
                منتج أ - مخزون منخفض
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full ml-2"></div>
              <span className="text-sm text-gray-600">
                منتج ب - يحتاج إعادة طلب
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
              <span className="text-sm text-gray-600">
                منتج ج - مخزون جيد
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
