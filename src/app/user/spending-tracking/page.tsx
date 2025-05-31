'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, StatCard, LoadingSpinner } from '@/components/ui';
import { getSpendingByCategory, getRecentExpenses } from '@/lib/api/dashboard';
import { generateExpensesReport, exportToExcel, exportToPDF } from '@/lib/reports';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import type {
  SpendingByCategory,
  ConstructionExpense,
  ConstructionCategory,
  SpendingData,
} from '@/types/spending-tracking';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Plus,
  Filter,
  Search,
  FileText,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function SpendingTrackingPage() {
  const [spendingCategories, setSpendingCategories] = useState<ConstructionCategory[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<ConstructionExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30'); // days
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verify auth
        const authResult = await verifyAuthWithRetry();
        if (authResult.error || !authResult.user) {
          console.error('❌ [SpendingTracking] Authentication failed');
          router.push('/login');
          return;
        }

        // Load spending data
        const [spendingCategories, expensesData] = await Promise.all([
          getSpendingByCategory(authResult.user.id),
          getRecentExpenses(authResult.user.id, parseInt(selectedPeriod)),
        ]);

        // Transform SpendingByCategory[] to ConstructionCategory[]
        const transformedCategories = spendingCategories.map((cat) => ({
          id: cat.category_id,
          category_name: cat.category_name,
          category_name_ar: cat.category_name_ar,
          color: cat.color || '#000000', // Provide default color if undefined
          total_amount: cat.total_amount,
          transaction_count: cat.transaction_count,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        // Transform dashboard expenses to spending tracking expenses
        const transformedExpenses = (expensesData || []).map((exp) => ({
          ...exp,
          category: exp.category
            ? {
                id: exp.category.id,
                category_name: exp.category.name || '',
                category_name_ar: exp.category.name_ar || '',
                color: exp.category.color || '#000000',
                total_amount: 0, // Initialize with default values
                transaction_count: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : undefined,
        }));

        setSpendingCategories(transformedCategories);
        setRecentExpenses(transformedExpenses);
      } catch (error) {
        console.error('Error loading spending data:', error);
        setError('حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [selectedPeriod, router, supabase]);

  // Calculate totals
  const totalSpent = spendingCategories.reduce((sum, cat) => sum + cat.total_amount, 0);
  const totalTransactions = spendingCategories.reduce((sum, cat) => sum + cat.transaction_count, 0);
  const pendingExpenses = recentExpenses.filter((exp) => exp.status === 'pending');

  // Filter expenses
  const filteredExpenses = recentExpenses.filter((expense) => {
    const matchesSearch =
      !searchTerm ||
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || expense.category?.id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Prepare chart data
  const pieChartData = spendingCategories.map((cat) => ({
    name: cat.name_ar || cat.name || '',
    value: cat.total_amount,
    color: cat.color,
  }));

  const barChartData = spendingCategories.map((cat) => ({
    category: cat.name_ar || cat.name || '',
    amount: cat.total_amount,
    transactions: cat.transaction_count,
  }));

  // Handle exports
  const handleExportReport = async (format: 'excel' | 'pdf') => {
    try {
      // Transform the data to match what the report generator expects
      const transformedExpenses = filteredExpenses.map((exp) => {
        const dashboardExpense: import('@/types/dashboard').ConstructionExpense = {
          id: exp.id,
          title: exp.title,
          description: exp.description,
          amount: exp.amount,
          currency: exp.currency,
          expense_date: exp.expense_date,
          created_by: exp.created_by || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          project_id: '',
          vendor_name: exp.vendor || '',
          payment_status: exp.status || 'pending',
          is_budgeted: exp.is_budgeted,
          category_id: exp.category?.id || '',
          category: exp.category
            ? {
                id: exp.category.id,
                name: exp.category.name || '',
                name_ar: exp.category.name_ar || '',
                color: exp.category.color,
                is_active: exp.category.is_active || true,
                sort_order: exp.category.sort_order || 0,
              }
            : undefined,
        };
        return dashboardExpense;
      });

      const { reportData, title, filename } = await generateExpensesReport(transformedExpenses);

      if (format === 'excel') {
        await exportToExcel(reportData, filename);
      } else {
        await exportToPDF(reportData, title, filename);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  if (loading) {
    return (
      <main className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">تتبع المصروفات</h1>
        </div>
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">تتبع المصروفات</h1>
        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => handleExportReport('excel')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              تصدير Excel
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => handleExportReport('pdf')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              تصدير PDF
            </button>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            إضافة مصروف
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المصروفات"
          value={`${totalSpent.toLocaleString()} ر.س`}
          icon={<DollarSign className="w-8 h-8 text-blue-600" />}
          subtitle="جميع المصروفات المسجلة"
        />
        <StatCard
          title="المصروفات المخططة"
          value={totalTransactions.toString()}
          icon={<Calendar className="w-8 h-8 text-green-600" />}
          subtitle="ضمن الميزانية المحددة"
        />
        <StatCard
          title="المصروفات الطارئة"
          value={pendingExpenses.length.toString()}
          icon={<TrendingUp className="w-8 h-8 text-orange-600" />}
          subtitle="خارج الميزانية"
        />
        <StatCard
          title="دفعات معلقة"
          value={`${pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()} ر.س`}
          icon={<FileText className="w-8 h-8 text-red-600" />}
          subtitle="في انتظار الدفع"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Spending by Category */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">توزيع المصروفات حسب الفئة</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} ر.س`, 'المبلغ']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart - Category Amounts */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">المصروفات حسب الفئة</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} ر.س`, 'المبلغ']} />
              <Bar dataKey="amount" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">اتجاه المصروفات الشهرية</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} ر.س`, 'المبلغ']} />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              strokeWidth={3}
              name="المصروفات الشهرية"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في المصروفات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">جميع الفئات</option>
              {spendingCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_ar || cat.name}
                </option>
              ))}
            </select>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">آخر 7 أيام</option>
            <option value="30">آخر 30 يوم</option>
            <option value="90">آخر 3 أشهر</option>
            <option value="365">السنة الماضية</option>
          </select>
        </div>
      </Card>

      {/* Recent Expenses Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">المصروفات الأخيرة</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">العنوان</th>
                <th className="px-6 py-3">الفئة</th>
                <th className="px-6 py-3">المبلغ</th>
                <th className="px-6 py-3">التاريخ</th>
                <th className="px-6 py-3">المورد</th>
                <th className="px-6 py-3">الحالة</th>
                <th className="px-6 py-3">النوع</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{expense.title}</div>
                      {expense.description && (
                        <div className="text-sm text-gray-500">{expense.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {expense.category && (
                      <>
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: expense.category.color }}
                        ></span>
                        {expense.category.name_ar || expense.category.name}
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {expense.amount.toLocaleString()} {expense.currency}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(expense.expense_date).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4">{expense.vendor || '-'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        expense.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : expense.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {expense.status === 'paid'
                        ? 'مدفوع'
                        : expense.status === 'pending'
                          ? 'معلق'
                          : 'ملغي'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        expense.is_budgeted
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {expense.is_budgeted ? 'مخطط' : 'طارئ'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مصروفات</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all'
                ? 'لم يتم العثور على مصروفات تطابق البحث المحدد'
                : 'لم تقم بإضافة أي مصروفات بعد'}
            </p>
          </div>
        )}
      </Card>
    </main>
  );
}
