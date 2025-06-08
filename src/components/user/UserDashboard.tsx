import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import type { Database } from '@/types/database';
import { Card, StatCard, LoadingSpinner } from '@/components/ui';
import { Shield, Calendar, Box, Tag, Clock, CreditCard, File } from 'lucide-react';

interface DashboardStats {
  activeWarranties: number;
  totalOrders: number;
  pendingOrders: number;
  totalSpending: number;
  activeProjects: number;
  recentProjects: any[];
  recentOrders: any[];
  upcomingWarranties: any[];
}

export default function UserDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error('User not authenticated');

        // Get active warranties
        const { data: warranties, error: warrantiesError } = await supabase
          .from('warranties')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active');

        // Get orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*, store:stores(store_name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Get projects
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Calculate total spending
        const { data: totalSpending } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('user_id', user.id)
          .eq('payment_status', 'completed');

        if (warrantiesError || ordersError || projectsError) {
          throw new Error('Error fetching dashboard data');
        }

        // Process upcoming warranty expirations
        const upcomingWarranties = warranties
          ?.filter((w) => {
            const daysUntilExpiry = Math.ceil(
              (new Date(w.warranty_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            return daysUntilExpiry <= 30;
          })
          .sort(
            (a, b) =>
              new Date(a.warranty_end_date).getTime() - new Date(b.warranty_end_date).getTime()
          )
          .slice(0, 5);

        setStats({
          activeWarranties: warranties?.filter((w) => w.status === 'active').length || 0,
          totalOrders: orders?.length || 0,
          pendingOrders: orders?.filter((o) => o.status === 'pending').length || 0,
          totalSpending: totalSpending?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0,
          activeProjects: projects?.filter((p) => p.status === 'active').length || 0,
          recentProjects: projects || [],
          recentOrders: orders || [],
          upcomingWarranties: upcomingWarranties || [],
        });
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
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Warranties"
          value={stats.activeWarranties.toString()}
          icon={<Shield className="w-8 h-8" />}
          subtitle="Valid warranties"
          color="blue"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects.toString()}
          icon={<Calendar className="w-8 h-8" />}
          subtitle="Ongoing projects"
          color="green"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders.toString()}
          icon={<Box className="w-8 h-8" />}
          subtitle="Orders awaiting processing"
          color="yellow"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <Link href="/user/orders" className="text-blue-600 hover:text-blue-700 text-sm">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500">No recent orders</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.store.store_name}</p>
                    <p className="text-sm text-gray-500">Order #{order.order_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total_amount}</p>
                    <p
                      className={`text-sm ${order.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Active Projects */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Active Projects</h3>
            <Link href="/user/projects" className="text-blue-600 hover:text-blue-700 text-sm">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentProjects.length === 0 ? (
              <p className="text-gray-500">No active projects</p>
            ) : (
              stats.recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{project.progress}%</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Warranty Expirations */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upcoming Warranty Expirations</h3>
          <Link href="/user/warranties" className="text-blue-600 hover:text-blue-700 text-sm">
            View all warranties
          </Link>
        </div>
        <div className="space-y-4">
          {stats.upcomingWarranties.length === 0 ? (
            <p className="text-gray-500">No upcoming warranty expirations</p>
          ) : (
            stats.upcomingWarranties.map((warranty) => {
              const daysLeft = Math.ceil(
                (new Date(warranty.warranty_end_date).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              );
              return (
                <div key={warranty.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{warranty.product_name}</p>
                    <p className="text-sm text-gray-500">Expires in {daysLeft} days</p>
                  </div>
                  <button
                    onClick={() => {
                      // Handle warranty details view
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <File className="w-5 h-5" />
                  </button>
                </div>
              );
            })
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
          <span>Register Warranty</span>
        </Link>
      </div>

      {/* Total Spending Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Total Spending</h3>
            <p className="text-gray-500">All time spending across all orders</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${stats.totalSpending.toFixed(2)}</p>
            <Link
              href="/user/spending-tracking"
              className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
            >
              <CreditCard className="w-4 h-4" />
              View details
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
