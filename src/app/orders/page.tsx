'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, TruckIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

// Simple UI Components defined inline to avoid import issues
const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }: any) => {
  const baseClasses = 'font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses: Record<string, string> = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  };
  const sizeClasses: Record<string, string> = {
    default: 'px-4 py-2 rounded-lg',
    sm: 'px-3 py-1.5 text-sm rounded'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input 
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
      {...props} 
    />
  );
};

const Select = ({ children, className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

const Badge = ({ variant = 'default', className = '', children, ...props }: { 
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'; 
  children: React.ReactNode; 
  className?: string; 
} & React.HTMLAttributes<HTMLSpanElement>) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

interface Order {
  id: string;
  storeId: string;
  storeName: string;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  deliveryAddress: string;
  notes?: string;
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  unit: string;
}

const dummyOrders: Order[] = [
  {
    id: 'ORD-001',
    storeId: '1',
    storeName: 'مؤسسة البناء المتطور',
    orderDate: '2024-01-15',
    status: 'delivered',
    total: 2500,
    items: [
      { id: '1', productName: 'أسمنت بورتلاندي', quantity: 10, price: 25, unit: 'كيس' },
      { id: '2', productName: 'طوب أحمر', quantity: 5000, price: 0.5, unit: 'حبة' }
    ],
    deliveryAddress: 'حي النزهة، الرياض',
    notes: 'يرجى التوصيل صباحاً'
  },
  {
    id: 'ORD-002',
    storeId: '2',
    storeName: 'متجر الأدوات الكهربائية',
    orderDate: '2024-01-18',
    status: 'preparing',
    total: 1200,
    items: [
      { id: '3', productName: 'كابل كهربائي', quantity: 100, price: 12, unit: 'متر' }
    ],
    deliveryAddress: 'حي الملز، الرياض'
  },
  {
    id: 'ORD-003',
    storeId: '1',
    storeName: 'مؤسسة البناء المتطور',
    orderDate: '2024-01-20',
    status: 'pending',
    total: 800,
    items: [
      { id: '4', productName: 'رمل أبيض', quantity: 10, price: 80, unit: 'متر مكعب' }
    ],
    deliveryAddress: 'حي العليا، الرياض'
  }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(dummyOrders);
      setFilteredOrders(dummyOrders);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = orders;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.storeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'في الانتظار', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'مؤكد', className: 'bg-blue-100 text-blue-800' },
      preparing: { label: 'قيد التحضير', className: 'bg-orange-100 text-orange-800' },
      ready: { label: 'جاهز للاستلام', className: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'مُسلم', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'ملغي', className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'ready':
        return <TruckIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <TruckIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const totalSpent = orders
    .filter(order => order.status === 'delivered')
    .reduce((total, order) => total + order.total, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل طلباتك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">طلباتي</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                <p className="text-gray-600">إجمالي الطلبات</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length}
                </p>
                <p className="text-gray-600">طلبات نشطة</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
                <p className="text-gray-600">طلبات مكتملة</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {totalSpent.toLocaleString()} ريال
                </p>
                <p className="text-gray-600">إجمالي المصروفات</p>
              </div>
            </Card>
          </div>
          
          {/* Filters */}
          <div className="flex gap-4 mb-6">            <Input
              placeholder="البحث في الطلبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الطلبات</option>
              <option value="pending">في الانتظار</option>
              <option value="confirmed">مؤكد</option>
              <option value="preparing">قيد التحضير</option>
              <option value="ready">جاهز للاستلام</option>
              <option value="delivered">مُسلم</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">طلب رقم {order.id}</h3>
                    <p className="text-gray-600">{order.storeName}</p>
                  </div>
                  {getStatusIcon(order.status)}
                </div>
                <div className="text-left">
                  {getStatusBadge(order.status)}
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.orderDate).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">المنتجات:</h4>
                  <ul className="space-y-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="text-sm text-gray-600">
                        {item.productName} - {item.quantity} {item.unit} × {item.price} ريال
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>عنوان التوصيل:</strong> {order.deliveryAddress}
                  </p>
                  {order.notes && (
                    <p className="text-sm text-gray-600">
                      <strong>ملاحظات:</strong> {order.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xl font-bold text-blue-600">
                  المجموع: {order.total.toLocaleString()} ريال
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <EyeIcon className="h-4 w-4 ml-1" />
                    عرض التفاصيل
                  </Button>
                  {order.status === 'pending' && (
                    <Button variant="outline" size="sm">
                      إلغاء الطلب
                    </Button>
                  )}
                  {order.status === 'delivered' && (
                    <Button size="sm">
                      إعادة الطلب
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">لا توجد طلبات</p>
            <Button onClick={() => window.location.href = '/stores'}>
              تصفح المتاجر
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
