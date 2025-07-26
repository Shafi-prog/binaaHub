"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { mockSupabaseClient } from '@/core/shared/services/mock-supabase';
import { useAuth } from '@/core/shared/auth/AuthProvider';

// Unified User Data Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  city?: string;
  memberSince: string;
  accountType: 'free' | 'premium' | 'enterprise';
  loyaltyPoints: number;
  currentLevel: number;
  totalSpent: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  store: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  orderDate: string;
  expectedDelivery?: string;
  actualDelivery?: string;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
}

export interface Warranty {
  id: string;
  productName: string;
  store: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'claimed';
  claimId?: string;
  warrantyType: string;
  value: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  location: string;
  type: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  store: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  issueDate: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export interface UserStats {
  activeWarranties: number;
  activeProjects: number;
  completedProjects: number;
  totalOrders: number;
  totalInvoices: number;
  monthlySpent: number;
  balanceAmount: number;
  aiInsights: number;
  communityPosts: number;
}

// Main User Data Interface
export interface UserData {
  profile: UserProfile | null;
  orders: Order[];
  warranties: Warranty[];
  projects: Project[];
  invoices: Invoice[];
  stats: UserStats;
  isLoading: boolean;
  error: string | null;
}

// Context Actions
interface UserDataActions {
  refreshUserData: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  addWarranty: (warranty: Warranty) => void;
  updateWarranty: (id: string, updates: Partial<Warranty>) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
}

type UserDataContextType = UserData & UserDataActions;

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

interface UserDataProviderProps {
  children: ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const { user: authUser, session, isLoading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    profile: null,
    orders: [],
    warranties: [],
    projects: [],
    invoices: [],
    stats: {
      activeWarranties: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalOrders: 0,
      totalInvoices: 0,
      monthlySpent: 0,
      balanceAmount: 0,
      aiInsights: 0,
      communityPosts: 0,
    },
    isLoading: true,
    error: null,
  });

  // Try to use real Supabase, fallback to mock if not available
  const [supabase, setSupabase] = useState<any>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        const realSupabase = createClientComponentClient();
        
        // Test the connection
        const { error } = await realSupabase
          .from('user_profiles')
          .select('count')
          .limit(1);
        
        if (error) {
          console.warn('Real Supabase not available, using mock data:', error.message);
          setSupabase(mockSupabaseClient);
          setUsingMockData(true);
        } else {
          console.log('✅ Real Supabase connection established');
          setSupabase(realSupabase);
          setUsingMockData(false);
        }
      } catch (err) {
        console.warn('Supabase initialization failed, using mock data:', err);
        setSupabase(mockSupabaseClient);
        setUsingMockData(true);
      }
    };

    initializeSupabase();
  }, []);

  // Calculate stats from current data
  const calculateStats = (data: Partial<UserData>): UserStats => {
    const orders = data.orders || [];
    const warranties = data.warranties || [];
    const projects = data.projects || [];
    const invoices = data.invoices || [];
    const profile = data.profile;

    const activeWarranties = warranties.filter(w => w.status === 'active').length;
    const activeProjects = projects.filter(p => p.status === 'in-progress').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalOrders = orders.length;
    const totalInvoices = invoices.length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySpent = orders
      .filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      })
      .reduce((sum, order) => sum + order.total, 0);

    const balanceAmount = profile?.totalSpent || 0;

    return {
      activeWarranties,
      activeProjects,
      completedProjects,
      totalOrders,
      totalInvoices,
      monthlySpent,
      balanceAmount,
      aiInsights: 5, // Mock data for now
      communityPosts: 12, // Mock data for now
    };
  };

  // Load user data from various sources
  const loadUserData = async () => {
    try {
      setUserData(prev => ({ ...prev, isLoading: true, error: null }));

      // Check if we have an authenticated user from AuthProvider
      if (!authUser || !session) {
        // Fallback to temp auth cookie for backwards compatibility
        const getCookie = (name: string) => {
          if (typeof window === 'undefined') return null;
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
          return null;
        };

        const tempAuthCookie = getCookie('temp_auth_user');
        if (tempAuthCookie) {
          const parsedUser = JSON.parse(decodeURIComponent(tempAuthCookie));
          
          // Load mock data for temp user
          const mockData = await loadMockUserData(parsedUser);
          const completeData = {
            profile: mockData.profile || null,
            orders: mockData.orders || [],
            warranties: mockData.warranties || [],
            projects: mockData.projects || [],
            invoices: mockData.invoices || [],
          };
          setUserData(prev => ({
            ...prev,
            ...completeData,
            stats: calculateStats(completeData),
            isLoading: false
          }));
          return;
        }
        
        throw new Error('No authenticated user found');
      }

      // Load real user data from Supabase
      const realData = await loadRealUserData(authUser.id);
      const completeData = {
        profile: realData.profile || null,
        orders: realData.orders || [],
        warranties: realData.warranties || [],
        projects: realData.projects || [],
        invoices: realData.invoices || [],
      };
      setUserData(prev => ({
        ...prev,
        ...completeData,
        stats: calculateStats(completeData),
        isLoading: false
      }));

    } catch (error) {
      console.error('Error loading user data:', error);
      setUserData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load user data',
        isLoading: false
      }));
    }
  };

  // Load mock data for development/temp users
  const loadMockUserData = async (tempUser: any): Promise<Partial<UserData>> => {
    const mockProfile: UserProfile = {
      id: tempUser.id || 'temp-user',
      name: tempUser.name || tempUser.email?.split('@')[0] || 'مستخدم تجريبي',
      email: tempUser.email || 'test@binna.com',
      phone: '+966501234567',
      city: 'الرياض',
      memberSince: '2024-01-01',
      accountType: tempUser.account_type || 'free',
      loyaltyPoints: 1250,
      currentLevel: 3,
      totalSpent: 15750,
    };

    const mockOrders: Order[] = [
      {
        id: 'ORD001',
        orderNumber: '#2024-001',
        store: 'متجر مواد البناء المتقدمة',
        items: [
          { name: 'أسمنت أبيض - 25 كيس', quantity: 25, price: 15 },
          { name: 'رمل ناعم - 5 متر مكعب', quantity: 5, price: 80 }
        ],
        total: 775,
        status: 'delivered',
        orderDate: '2024-01-15',
        actualDelivery: '2024-01-17',
        shippingAddress: 'الرياض، حي النرجس',
        paymentMethod: 'بطاقة ائتمان',
        trackingNumber: 'TRK123456789'
      }
    ];

    const mockWarranties: Warranty[] = [
      {
        id: 'W001',
        productName: 'مضخة المياه عالية الكفاءة',
        store: 'متجر الأدوات الصحية المتقدمة',
        purchaseDate: '2024-01-15',
        expiryDate: '2026-01-15',
        status: 'active',
        warrantyType: 'ضمان الشركة المصنعة',
        value: 850
      }
    ];

    const mockProjects: Project[] = [
      {
        id: 'PRJ001',
        name: 'مشروع فيلا العائلة',
        description: 'بناء فيلا سكنية بمساحة 400 متر مربع',
        status: 'in-progress',
        startDate: '2024-01-01',
        budget: 500000,
        spent: 250000,
        location: 'الرياض، حي الملقا',
        type: 'سكني'
      }
    ];

    const mockInvoices: Invoice[] = [
      {
        id: 'INV001',
        invoiceNumber: 'INV-2024-001',
        store: 'متجر مواد البناء المتقدمة',
        amount: 775,
        status: 'paid',
        issueDate: '2024-01-15',
        dueDate: '2024-02-15',
        items: [
          { description: 'أسمنت أبيض', quantity: 25, unitPrice: 15, total: 375 },
          { description: 'رمل ناعم', quantity: 5, unitPrice: 80, total: 400 }
        ]
      }
    ];

    return {
      profile: mockProfile,
      orders: mockOrders,
      warranties: mockWarranties,
      projects: mockProjects,
      invoices: mockInvoices,
    };
  };

  // Load real user data from Supabase
  const loadRealUserData = async (userId: string): Promise<Partial<UserData>> => {
    try {
      // Load profile from user_profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Profile load error:', profileError);
      }

      // Convert profile data to UserProfile format
      const profile: UserProfile | null = profileData ? {
        id: profileData.user_id,
        name: profileData.display_name || 'مستخدم',
        email: profileData.email || '',
        phone: profileData.phone,
        city: profileData.city || 'الرياض',
        memberSince: profileData.created_at || new Date().toISOString(),
        accountType: profileData.account_type || 'free',
        loyaltyPoints: profileData.loyalty_points || 0,
        currentLevel: profileData.current_level || 1,
        totalSpent: profileData.total_spent || 0,
      } : null;

      // Load orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (ordersError && ordersError.code !== 'PGRST116') {
        console.error('Orders load error:', ordersError);
      }

      // Load warranties
      const { data: warrantiesData, error: warrantiesError } = await supabase
        .from('warranties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (warrantiesError && warrantiesError.code !== 'PGRST116') {
        console.error('Warranties load error:', warrantiesError);
      }

      // Load projects (using construction_projects table)
      const { data: projectsData, error: projectsError } = await supabase
        .from('construction_projects')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (projectsError && projectsError.code !== 'PGRST116') {
        console.error('Projects load error:', projectsError);
      }

      // Load invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          invoice_items (
            description,
            quantity,
            unit_price,
            total_price
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (invoicesError && invoicesError.code !== 'PGRST116') {
        console.error('Invoices load error:', invoicesError);
      }

      // Transform data to match our interfaces
      const orders: Order[] = (ordersData || []).map(order => ({
        id: order.id,
        orderNumber: order.order_number || `#${order.id}`,
        store: order.store_name || 'متجر بِنّا',
        items: [], // TODO: Load order items from separate table
        total: order.total_amount || 0,
        status: order.status as Order['status'] || 'pending',
        orderDate: order.created_at || new Date().toISOString(),
        expectedDelivery: order.expected_delivery,
        actualDelivery: order.actual_delivery,
        shippingAddress: order.shipping_address || '',
        paymentMethod: order.payment_method || 'بطاقة ائتمان',
        trackingNumber: order.tracking_number,
      }));

      const warranties: Warranty[] = (warrantiesData || []).map(warranty => ({
        id: warranty.id,
        productName: warranty.product_name || 'منتج',
        store: warranty.store_name || 'متجر بِنّا',
        purchaseDate: warranty.purchase_date || new Date().toISOString(),
        expiryDate: warranty.expiry_date || new Date().toISOString(),
        status: warranty.status as Warranty['status'] || 'active',
        claimId: warranty.claim_id,
        warrantyType: warranty.warranty_type || 'ضمان المصنع',
        value: warranty.product_value || 0,
      }));

      const projects: Project[] = (projectsData || []).map(project => ({
        id: project.id,
        name: project.name || 'مشروع',
        description: project.description || '',
        status: project.status as Project['status'] || 'planning',
        startDate: project.start_date || new Date().toISOString(),
        endDate: project.end_date,
        budget: project.budget || 0,
        spent: project.spent_amount || 0,
        location: project.location || 'الرياض',
        type: project.project_type || 'سكني',
      }));

      const invoices: Invoice[] = (invoicesData || []).map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number || `INV-${invoice.id}`,
        store: invoice.store_name || 'متجر بِنّا',
        amount: invoice.total_amount || 0,
        status: invoice.status as Invoice['status'] || 'pending',
        issueDate: invoice.issue_date || new Date().toISOString(),
        dueDate: invoice.due_date || new Date().toISOString(),
        items: (invoice.invoice_items || []).map((item: any) => ({
          description: item.description || '',
          quantity: item.quantity || 1,
          unitPrice: item.unit_price || 0,
          total: item.total_price || 0,
        })),
      }));

      console.log('Loaded real user data:', {
        profile: !!profile,
        orders: orders.length,
        warranties: warranties.length,
        projects: projects.length,
        invoices: invoices.length,
      });

      return {
        profile,
        orders,
        warranties,
        projects,
        invoices,
      };
    } catch (error) {
      console.error('Error loading real user data:', error);
      throw error;
    }
  };

  // Actions
  const refreshUserData = async () => {
    await loadUserData();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!userData.profile) return;
      
      const updatedProfile = { ...userData.profile, ...updates };
      
      // Update in database if real user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);
      }
      
      setUserData(prev => ({
        ...prev,
        profile: updatedProfile
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const addOrder = (order: Order) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        orders: [order, ...prev.orders]
      };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        orders: prev.orders.map(order => 
          order.id === id ? { ...order, ...updates } : order
        )
      };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const addWarranty = (warranty: Warranty) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        warranties: [warranty, ...prev.warranties]
      };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const updateWarranty = (id: string, updates: Partial<Warranty>) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        warranties: prev.warranties.map(warranty => 
          warranty.id === id ? { ...warranty, ...updates } : warranty
        )
      };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const addProject = (project: Project) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        projects: [project, ...prev.projects]
      };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        projects: prev.projects.map(project => 
          project.id === id ? { ...project, ...updates } : project
        )
      };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const addInvoice = (invoice: Invoice) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        invoices: [invoice, ...prev.invoices]
      };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        invoices: prev.invoices.map(invoice => 
          invoice.id === id ? { ...invoice, ...updates } : invoice
        )
      };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  // Load data when auth state changes or when supabase is initialized
  useEffect(() => {
    if (!authLoading && supabase) {
      loadUserData();
    }
  }, [authUser, session, authLoading, supabase]);

  const contextValue: UserDataContextType = {
    ...userData,
    refreshUserData,
    updateProfile,
    addOrder,
    updateOrder,
    addWarranty,
    updateWarranty,
    addProject,
    updateProject,
    addInvoice,
    updateInvoice,
  };

  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
};
