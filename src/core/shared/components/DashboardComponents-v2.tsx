// Dashboard Components
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/domains/shared/components/ui/card';
import { Badge } from '@/domains/shared/components/ui/badge';
import { Button } from '@/domains/shared/components/ui/button';
import { LucideIcon, FolderOpen, Activity, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  change, 
  changeType = 'neutral',
  className = ''
}: StatCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType];

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">
            {description}
          </p>
        )}
        {change && (
          <p className={`text-xs ${changeColor} mt-1`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description?: string;
    status: string;
    completion_percentage?: number;
    budget?: number;
    spent?: number;
    category?: string;
    priority?: 'low' | 'medium' | 'high';
    start_date?: string;
    end_date?: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete, onView }: ProjectCardProps) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const budgetUtilization = project.budget && project.spent 
    ? (project.spent / project.budget) * 100 
    : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {project.title}
            </CardTitle>
            {project.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge className={statusColors[project.status as keyof typeof statusColors] || statusColors.draft}>
            {project.status}
          </Badge>
          {project.priority && (
            <Badge variant="outline" className={priorityColors[project.priority]}>
              {project.priority} priority
            </Badge>
          )}
          {project.category && (
            <Badge variant="outline">
              {project.category}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {project.completion_percentage !== undefined && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.completion_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${project.completion_percentage}%` }}
                />
              </div>
            </div>
          )}

          {project.budget && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Budget</span>
                <span>{budgetUtilization.toFixed(1)}% used</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-900">
                  ${project.spent?.toLocaleString() || 0} / ${project.budget.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    budgetUtilization > 90 ? 'bg-red-500' : 
                    budgetUtilization > 75 ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                />
              </div>
            </div>
          )}

          {(project.start_date || project.end_date) && (
            <div className="text-sm text-gray-600">
              {project.start_date && (
                <div>Start: {new Date(project.start_date).toLocaleDateString()}</div>
              )}
              {project.end_date && (
                <div>End: {new Date(project.end_date).toLocaleDateString()}</div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(project.id)}>
              View
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(project.id)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" onClick={() => onDelete(project.id)}>
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  stats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalBudget: number;
    totalSpent: number;
    budgetUtilization: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Projects"
        value={stats.totalProjects}
        icon={FolderOpen}
        description="All projects"
      />
      <StatCard
        title="Active Projects"
        value={stats.activeProjects}
        icon={Activity}
        description="Currently in progress"
      />
      <StatCard
        title="Budget Utilization"
        value={`${stats.budgetUtilization.toFixed(1)}%`}
        icon={DollarSign}
        description={`$${stats.totalSpent.toLocaleString()} of $${stats.totalBudget.toLocaleString()}`}
        changeType={stats.budgetUtilization > 90 ? 'negative' : 'positive'}
      />
      <StatCard
        title="Completed"
        value={stats.completedProjects}
        icon={TrendingUp}
        description="Finished projects"
      />
    </div>
  );
}

interface ExpenseListProps {
  expenses: Array<{
    id: string;
    amount: number;
    description: string;
    category: string;
    date: string;
  }>;
  title?: string;
}

export function ExpenseList({ expenses, title = "Recent Expenses" }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No expenses found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{expense.description}</div>
                <div className="text-sm text-gray-500">
                  {expense.category} • {new Date(expense.date).toLocaleDateString()}
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                ${expense.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default {
  StatCard,
  ProjectCard,
  DashboardStats,
  ExpenseList
};
