import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Heart, 
  Bell, 
  Settings, 
  Star, 
  Clock, 
  Truck,
  Shield,
  Gift,
  HelpCircle,
  LogOut,
  Edit,
  Plus,
  Eye,
  Download
} from 'lucide-react';
import { useAuth } from '@/shared/hooks/use-auth';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    seller: string;
  }[];
  tracking?: string;
  estimatedDelivery?: string;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  district: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet';
  name: string;
  details: string;
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
}

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  seller: string;
  inStock: boolean;
  dateAdded: string;
}

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    newsletter: true
  });

  useEffect(() => {
    loadUserData();
    loadOrders();
    loadAddresses();
    loadPaymentMethods();
    loadWishlist();
    loadNotifications();
  }, []);

  const loadUserData = () => {
    setProfileData({
      name: user?.name || 'Ahmed Al-Rashid',
      email: user?.email || 'ahmed@example.com',
      phone: '+966501234567',
      birthDate: '1985-01-15',
      gender: 'male',
      newsletter: true
    });
  };

  const loadOrders = () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'BIN-2024-001',
        date: '2024-01-15',
        status: 'delivered',
        total: 1299,
        items: [
          {
            id: '1',
            name: 'Samsung Galaxy S24',
            image: '/api/placeholder/60/60',
            price: 1299,
            quantity: 1,
            seller: 'TechStore KSA'
          }
        ],
        tracking: 'TR123456789',
        estimatedDelivery: '2024-01-18'
      },
      {
        id: '2',
        orderNumber: 'BIN-2024-002',
        date: '2024-01-20',
        status: 'shipped',
        total: 450,
        items: [
          {
            id: '2',
            name: 'Nike Air Max 270',
            image: '/api/placeholder/60/60',
            price: 450,
            quantity: 1,
            seller: 'Sports Central'
          }
        ],
        tracking: 'TR987654321',
        estimatedDelivery: '2024-01-25'
      }
    ];
    
    setOrders(mockOrders);
  };

  const loadAddresses = () => {
    const mockAddresses: Address[] = [
      {
        id: '1',
        type: 'home',
        name: 'Ahmed Al-Rashid',
        street: 'Al-Olaya Street, Building 123, Apt 45',
        city: 'Riyadh',
        district: 'Al-Olaya',
        postalCode: '11564',
        phone: '+966501234567',
        isDefault: true
      },
      {
        id: '2',
        type: 'work',
        name: 'Ahmed Al-Rashid',
        street: 'King Fahd Road, Tower 2, Floor 15',
        city: 'Riyadh',
        district: 'Al-Muraba',
        postalCode: '11432',
        phone: '+966501234567',
        isDefault: false
      }
    ];
    
    setAddresses(mockAddresses);
  };

  const loadPaymentMethods = () => {
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: '1',
        type: 'card',
        name: 'Visa Card',
        details: 'Primary card',
        lastFour: '1234',
        expiryDate: '12/26',
        isDefault: true
      },
      {
        id: '2',
        type: 'wallet',
        name: 'STC Pay',
        details: 'Mobile wallet',
        lastFour: '5678',
        expiryDate: '',
        isDefault: false
      }
    ];
    
    setPaymentMethods(mockPaymentMethods);
  };

  const loadWishlist = () => {
    const mockWishlist: WishlistItem[] = [
      {
        id: '1',
        productId: 'prod-1',
        name: 'iPhone 15 Pro',
        price: 4999,
        originalPrice: 5299,
        image: '/api/placeholder/60/60',
        seller: 'Apple Store KSA',
        inStock: true,
        dateAdded: '2024-01-10'
      },
      {
        id: '2',
        productId: 'prod-2',
        name: 'MacBook Pro M3',
        price: 8999,
        image: '/api/placeholder/60/60',
        seller: 'Apple Store KSA',
        inStock: false,
        dateAdded: '2024-01-08'
      }
    ];
    
    setWishlist(mockWishlist);
  };

  const loadNotifications = () => {
    const mockNotifications = [
      {
        id: '1',
        type: 'order',
        title: 'Order Delivered',
        message: 'Your order BIN-2024-001 has been delivered',
        date: '2024-01-18',
        read: false
      },
      {
        id: '2',
        type: 'promotion',
        title: 'Special Offer',
        message: '20% off on electronics this weekend',
        date: '2024-01-17',
        read: true
      }
    ];
    
    setNotifications(mockNotifications);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-orange-600 bg-orange-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'support', label: 'Help & Support', icon: HelpCircle }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {profileData.name}!</h2>
        <p className="opacity-90">Manage your account and track your orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <Gift className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reward Points</p>
              <p className="text-2xl font-bold text-gray-900">1,250</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Wishlist Items</p>
              <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Addresses</p>
              <p className="text-2xl font-bold text-gray-900">{addresses.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 3).map(order => (
              <div key={order.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img 
                  src={order.items[0].image} 
                  alt={order.items[0].name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveTab('orders')}
              className="flex items-center space-x-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span>Track Order</span>
            </button>
            
            <button
              onClick={() => setActiveTab('addresses')}
              className="flex items-center space-x-2 p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span>Add Address</span>
            </button>
            
            <button
              onClick={() => setActiveTab('wishlist')}
              className="flex items-center space-x-2 p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>View Wishlist</span>
            </button>
            
            <button
              onClick={() => setActiveTab('support')}
              className="flex items-center space-x-2 p-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Get Help</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const OrdersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Orders</h2>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-md">
            <option>All Orders</option>
            <option>Delivered</option>
            <option>Shipped</option>
            <option>Processing</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{order.orderNumber}</h3>
                <p className="text-sm text-gray-600">Placed on {order.date}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">Sold by {item.seller}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.price} SAR</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                {order.tracking && (
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                    <Truck className="w-4 h-4" />
                    <span>Track Package</span>
                  </button>
                )}
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                  <Download className="w-4 h-4" />
                  <span>Download Invoice</span>
                </button>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{order.total} SAR</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AddressesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        <button className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(address => (
          <div key={address.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{address.name}</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {address.type}
                </span>
                {address.isDefault && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <p>{address.street}</p>
              <p>{address.district}, {address.city} {address.postalCode}</p>
              <p>{address.phone}</p>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-200 transition-colors text-sm">
                Edit
              </button>
              <button className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded-md hover:bg-red-200 transition-colors text-sm">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const WishlistTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Wishlist</h2>
        <p className="text-gray-600">{wishlist.length} items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </button>
            </div>
            
            <h3 className="font-semibold mb-2">{item.name}</h3>
            
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg font-bold text-green-600">{item.price} SAR</span>
              {item.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {item.originalPrice} SAR
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">Sold by {item.seller}</p>
            
            <div className="flex space-x-2">
              <button 
                className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors ${
                  item.inStock 
                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!item.inStock}
              >
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-200 transition-colors">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProfileTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile Settings</h2>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date
            </label>
            <input
              type="date"
              value={profileData.birthDate}
              onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={profileData.gender}
              onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preferences</h3>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={profileData.newsletter}
              onChange={(e) => setProfileData({...profileData, newsletter: e.target.checked})}
              className="w-4 h-4 text-orange-600 rounded"
            />
            <span className="text-sm text-gray-700">
              Subscribe to newsletter for updates and promotions
            </span>
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'orders': return <OrdersTab />;
      case 'addresses': return <AddressesTab />;
      case 'wishlist': return <WishlistTab />;
      case 'profile': return <ProfileTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{profileData.name}</h3>
                  <p className="text-sm text-gray-600">{profileData.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
                
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
