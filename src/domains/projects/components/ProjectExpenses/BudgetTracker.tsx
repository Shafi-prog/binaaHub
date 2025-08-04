'use client';

import React from 'react';

interface ProjectExpensesSummaryProps {
  projectId: string;
}

interface ProjectExpense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export function ProjectExpensesSummary({ projectId }: ProjectExpensesSummaryProps) {
  // For now, we'll create a simple placeholder since we need project expenses hook
  const expenses: ProjectExpense[] = []; // This would come from useProjectExpenses hook
  const loading = false;
  const error = null;
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budget = 50000; // This would come from project data

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget & Expenses</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget & Expenses</h3>
        <p className="text-red-600">Error loading expenses: {error}</p>
      </div>
    );
  }

  const budgetUsed = budget > 0 ? (totalExpenses / budget) * 100 : 0;
  const remaining = budget - totalExpenses;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Budget & Expenses</h3>
        <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
          Add Expense
        </button>
      </div>

      {/* Budget Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Budget Usage</span>
          <span className="text-sm font-medium text-gray-900">
            {budgetUsed.toFixed(1)}% used
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 75 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>${totalExpenses.toLocaleString()} spent</span>
          <span>${budget.toLocaleString()} budget</span>
        </div>
      </div>

      {/* Expense Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-lg font-semibold text-gray-900">${totalExpenses.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Spent</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className={`text-lg font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(remaining).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            {remaining >= 0 ? 'Remaining' : 'Over Budget'}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-lg font-semibold text-gray-900">{expenses.length}</p>
          <p className="text-sm text-gray-500">Transactions</p>
        </div>
      </div>

      {/* Recent Expenses */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Recent Expenses</h4>
        {expenses.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No expenses recorded yet</p>
            <p className="text-sm text-gray-400 mt-1">Start tracking your project costs</p>
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.slice(0, 3).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-600">
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-medium text-gray-900">
                  ${expense.amount.toLocaleString()}
                </span>
              </div>
            ))}
            {expenses.length > 3 && (
              <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-800">
                View all {expenses.length} expenses
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
