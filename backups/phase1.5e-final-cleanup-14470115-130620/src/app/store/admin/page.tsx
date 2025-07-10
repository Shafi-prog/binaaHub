// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/domains/shared/components/ui/card';
import { Button } from '@/domains/shared/components/ui/button';
import { Badge } from '@/domains/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/domains/shared/components/ui/tabs';
import { 
  Plus, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  BarChart3,
  Settings,
  Eye,
  DollarSign,
  ArrowRight
} from 'lucide-react';

export default function StoreAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockItems: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalProducts: 156,
      totalOrders: 89,
      totalCustomers: 234,
      totalRevenue: 15750,
      pendingOrders: 12,
      lowStockItems: 8
    });
  }, []);

  const quickActions = [
    { 
      title: 'Add Product', 
      description: 'Add new products to your store',
      icon: <Package className="w-6 h-6" />,
      href: '/store/add-product',
      color: 'bg-blue-500'
    },
    { 
      title: 'View Orders', 
      description: 'Manage customer orders',
      icon: <ShoppingCart className="w-6 h-6" />,
      href: '/store/orders',
      color: 'bg-green-500'
    },
    { 
      title: 'Analytics', 
      description: 'View store analytics',
      icon: <BarChart3 className="w-6 h-6" />,
      href: '/store/analytics',
      color: 'bg-purple-500'
    },
    { 
      title: 'Settings', 
      description: 'Store configuration',
      icon: <Settings className="w-6 h-6" />,
      href: '/store/settings',
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Administration</h1>
          <p className="text-gray-600">Manage your store operations and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {stats.pendingOrders} pending
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              {stats.lowStockItems > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.lowStockItems} low stock
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Active customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(action.href)}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                  <div className="flex items-center text-sm text-blue-600">
                    Get started <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock order items */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">#ORD-001</p>
                    <p className="text-sm text-gray-600">Customer A</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$125.00</p>
                    <Badge variant="outline">Processing</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">#ORD-002</p>
                    <p className="text-sm text-gray-600">Customer B</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$89.50</p>
                    <Badge variant="outline">Shipped</Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Orders
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>Products requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.lowStockItems > 0 && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Low Stock Items</p>
                      <p className="text-sm text-gray-600">{stats.lowStockItems} products</p>
                    </div>
                    <Badge variant="destructive">Action Required</Badge>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Categories</p>
                    <p className="text-sm text-gray-600">8 active categories</p>
                  </div>
                  <Badge variant="outline">OK</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Manage Inventory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}





