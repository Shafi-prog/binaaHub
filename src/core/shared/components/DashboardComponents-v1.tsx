// @ts-nocheck
import { Card } from '@/domains/shared/components/ui';
import { UserDashboardStats } from '@/domains/shared/services/api/user-dashboard';
import { formatCurrency } from '@/domains/shared/utils';
import Link from 'next/link';

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
};

export function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center">
        {icon && <div className="mr-4 text-gray-400">{icon}</div>}
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-2">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
          {description && <p className="mt-4 text-sm text-gray-500">{description}</p>}
        </div>
      </div>
    </Card>
  );
}

type ProjectCardProps = {
  project: UserDashboardStats['recentProjects'][0];
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/user/projects/${project.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-gray-900">{project.name}</h4>
            <p className="text-sm text-gray-500 mt-1">{project.project_type}</p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              project.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : project.status === 'planning'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {project.status}
          </span>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 mt-1">{project.progress}% Complete</span>
        </div>
      </Card>
    </Link>
  );
}

type WarrantyCardProps = {
  warranty: UserDashboardStats['recentWarranties'][0];
};

export function WarrantyCard({ warranty }: WarrantyCardProps) {
  const isExpiringSoon =
    new Date(warranty.expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Link href={`/user/warranties/${warranty.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-gray-900">{warranty.product_name}</h4>
            <p className="text-sm text-gray-500 mt-1">{warranty.store_name}</p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              warranty.status === 'active' && !isExpiringSoon
                ? 'bg-green-100 text-green-800'
                : warranty.status === 'active' && isExpiringSoon
                  ? 'bg-yellow-100 text-yellow-800'
                  : warranty.status === 'expired'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isExpiringSoon && warranty.status === 'active' ? 'Expiring Soon' : warranty.status}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Expires: {new Date(warranty.expiry_date).toLocaleDateString()}
        </p>
      </Card>
    </Link>
  );
}

type OrdersTableProps = {
  orders: UserDashboardStats['recentOrders'];
};

export function RecentOrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Store
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.store_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


