// @ts-nocheck
export interface StoreStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  monthlyOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
  topProducts: Product[];
}

export interface Order {
  id: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export async function getStoreDashboardStats(storeId?: string): Promise<StoreStats> {
  // Mock data for development
  const mockStats: StoreStats = {
    totalRevenue: 245000,
    monthlyRevenue: 45000,
    totalOrders: 156,
    monthlyOrders: 28,
    totalProducts: 45,
    totalCustomers: 89,
    recentOrders: [
      {
        id: 'ord_001',
        customerName: 'أحمد محمد',
        amount: 2500,
        status: 'delivered',
        created_at: '2024-01-20T10:30:00Z'
      },
      {
        id: 'ord_002',
        customerName: 'فاطمة علي',
        amount: 1800,
        status: 'processing',
        created_at: '2024-01-19T14:15:00Z'
      },
      {
        id: 'ord_003',
        customerName: 'محمد السعد',
        amount: 3200,
        status: 'shipped',
        created_at: '2024-01-18T09:45:00Z'
      },
      {
        id: 'ord_004',
        customerName: 'نورا أحمد',
        amount: 950,
        status: 'pending',
        created_at: '2024-01-17T16:20:00Z'
      }
    ],
    topProducts: [
      {
        id: 'prod_001',
        name: 'أدوات البناء الأساسية',
        sales: 45,
        revenue: 15000
      },
      {
        id: 'prod_002',
        name: 'مواد التشطيب',
        sales: 32,
        revenue: 12800
      },
      {
        id: 'prod_003',
        name: 'معدات السلامة',
        sales: 28,
        revenue: 8400
      }
    ]
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return mockStats;
}
