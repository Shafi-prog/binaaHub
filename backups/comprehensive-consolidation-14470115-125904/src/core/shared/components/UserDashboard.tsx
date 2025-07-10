// @ts-nocheck
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import type { Database } from '@/domains/shared/types/database';
import { Card } from '@/domains/shared/components/ui/card';
import { StatCard } from '@/domains/shared/components/ui/StatCard';
import { LoadingSpinner } from '@/domains/shared/components/ui/loading-spinner';
import { Shield, Calendar, Box, Tag, Clock, CreditCard, File } from 'lucide-react';
import { isProjectActive, getStatusLabel, getProgressFromStatus, getProjectTypeLabel } from '@/domains/shared/services/project-utils';
import { getUserDashboardStats, type UserDashboardStats } from '@/domains/shared/services/api/user-dashboard';

export default function UserDashboard() {
  const [stats, setStats] = useState<UserDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, [supabase]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('User not authenticated');
          return;
        }        // Use the new user dashboard API that includes invoices
        const dashboardStats = await getUserDashboardStats(user.id);
        setStats(dashboardStats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [supabase]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!stats) return null;
  return (
    <div className="space-y-6">
      {/* DEBUG: Show current user info - Only in development */}
      {process.env.NODE_ENV === 'development' && currentUser && (
        <div className="p-4 bg-yellow-100 rounded text-yellow-900 text-sm mb-2">
          <strong>Debug:</strong> User ID: {currentUser.id} | Email: {currentUser.email}
        </div>
      )}      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Active Warranties"
          value={stats?.activeWarranties?.toString() ?? '0'}
          icon={<Shield className="w-8 h-8" />}
          subtitle="Valid warranties"
          color="blue"
        />
        <StatCard
          title="Active Projects"
          value={stats?.activeProjects?.toString() ?? '0'}
          icon={<Calendar className="w-8 h-8" />}
          subtitle="Ongoing projects"
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders?.toString() ?? '0'}
          icon={<Box className="w-8 h-8" />}
          subtitle="Orders & invoices combined"
          color="purple"
        />
        <StatCard
          title="Total Invoices"
          value={stats?.totalInvoices?.toString() ?? '0'}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }          subtitle="Store invoices received"
          color="yellow"/>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">        {/* Recent Orders & Invoices */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Orders & Invoices</h3>
            <Link href="/user/orders" className="text-blue-600 hover:text-blue-700 text-sm">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500">No recent orders or invoices</p>
            ) : (
              stats.recentOrders.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {/* Type indicator icon */}
                    <div className={`p-2 rounded-full ${
                      item.type === 'invoice' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.type === 'invoice' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium">{item.store_name}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          item.type === 'invoice' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.type === 'invoice' ? 'Invoice' : 'Order'}
                        </span>
                        <p className="text-sm text-gray-500">
                          {item.type === 'invoice' && item.invoice_number 
                            ? `#${item.invoice_number}` 
                            : `#${item.id.slice(0, 8)}...`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">${item.amount}</p>
                    <div className="flex items-center justify-end space-x-2">
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        item.status === 'delivered' || item.status === 'paid' 
                          ? 'bg-green-100 text-green-700' 
                          : item.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
                      {item.type === 'invoice' && item.payment_status && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.payment_status === 'paid' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-orange-100 text-orange-600'
                        }`}>
                          {item.payment_status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>        {/* Active Projects */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Active Projects</h3>
            <Link href="/user/projects" className="text-blue-600 hover:text-blue-700 text-sm">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentProjects.filter(isProjectActive).length === 0 ? (
              <p className="text-gray-500">No active projects</p>
            ) : (
              stats.recentProjects.filter(isProjectActive).slice(0, 5).map((project) => {
                const progressPercentage = project.progress || getProgressFromStatus(project.status);
                return (
                  <div key={project.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-gray-500">{getStatusLabel(project.status)}</p>
                    </div>
                    <div className="text-right">
                      <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{progressPercentage}%</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>      {/* Recent Warranties */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Warranties</h3>
          <Link href="/user/warranties" className="text-blue-600 hover:text-blue-700 text-sm">
            View all warranties
          </Link>
        </div>
        <div className="space-y-4">
          {stats.recentWarranties.length === 0 ? (
            <p className="text-gray-500">No warranties found</p>
          ) : (
            stats.recentWarranties.map((warranty) => (
              <div key={warranty.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{warranty.product_name}</p>
                  <p className="text-sm text-gray-500">{warranty.store_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Expires: {new Date(warranty.expiry_date).toLocaleDateString()}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    warranty.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {warranty.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/user/projects/new"
          className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
        >
          <Calendar className="w-5 h-5" />
          <span>New Project</span>
        </Link>
        <Link
          href="/user/orders"
          className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
        >
          <Tag className="w-5 h-5" />
          <span>Place Order</span>
        </Link>
        <Link
          href="/user/warranties/register"
          className="flex items-center justify-center gap-2 p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
        >
          <Shield className="w-5 h-5" />
          <span>Register Warranty</span>        </Link>
      </div>
    </div>
  );
}


