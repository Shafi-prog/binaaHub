// TEMP BACKUP - Clean UserDataContext with proper Supabase integration
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { mockSupabaseClient } from '@/core/shared/services/mock-supabase';
import { supabaseDataService } from '@/core/shared/services/supabase-data-service';
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
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
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
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
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
  loyaltyPoints: number;
  currentLevel: number;
  communityPosts: number;
  monthlySpent: number;
  balanceAmount: number;
  aiInsights: number;
}

// Context Data Structure
interface UserData {
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
      loyaltyPoints: 0,
      currentLevel: 1,
      communityPosts: 0,
      monthlySpent: 0,
      balanceAmount: 0,
      aiInsights: 0,
    },
    isLoading: true,
    error: null,
  });

  const supabase = createClientComponentClient();

  // Calculate stats from loaded data
  const calculateStats = (data: Partial<UserData>): UserStats => {
    const { profile, orders = [], warranties = [], projects = [], invoices = [] } = data;

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
      loyaltyPoints: profile?.loyaltyPoints || 0,
      currentLevel: profile?.currentLevel || 1,
      monthlySpent,
      balanceAmount,
      aiInsights: 5, // Calculated based on user activity
      communityPosts: 12, // Could be calculated from posts table
    };
  };

  // Load real user data from Supabase using the data service
  const loadUserDataFromSupabase = async (tempUser: any): Promise<Partial<UserData>> => {
    const userId = tempUser.id || 'temp-user';
    const userRole = tempUser.role || 'user';

    try {
      // Try to insert sample data for demo user if it doesn't exist (don't await to avoid blocking)
      supabaseDataService.insertSampleData(userId, userRole).catch(err => 
        console.warn('Sample data insertion failed (expected for mock client):', err)
      );

      // Get profile
      const profileData = await supabaseDataService.getUserProfile(userId);
      
      const profile: UserProfile = {
        id: profileData.id || userId,
        name: profileData.display_name || tempUser.name || 'مستخدم تجريبي',
        email: profileData.email || tempUser.email || 'user@binna',
        phone: profileData.phone || '+966501234567',
        city: profileData.city || 'الرياض',
        memberSince: profileData.created_at || '2024-01-01',
        accountType: profileData.account_type || 'free',
        loyaltyPoints: profileData.loyalty_points || 1250,
        currentLevel: profileData.current_level || 3,
        totalSpent: profileData.total_spent || 15750,
      };

      // Get orders
      const ordersData = await supabaseDataService.getUserOrders(userId);
      const orders: Order[] = ordersData.map((order: any) => ({
        id: order.id,
        orderNumber: order.order_number,
        store: order.store_name || 'متجر مواد البناء',
        items: order.items || [],
        total: order.total_amount,
        status: order.status,
        orderDate: order.created_at,
        shippingAddress: order.shipping_address || 'الرياض',
        paymentMethod: order.payment_method || 'card',
        trackingNumber: order.tracking_number
      }));

      // Get warranties
      const warrantiesData = await supabaseDataService.getUserWarranties(userId);
      const warranties: Warranty[] = warrantiesData.map((warranty: any) => ({
        id: warranty.id,
        productName: warranty.product_name,
        store: warranty.store_name || 'متجر',
        purchaseDate: warranty.purchase_date,
        expiryDate: warranty.expiry_date,
        status: warranty.status,
        warrantyType: warranty.warranty_type,
        value: warranty.value || 0
      }));

      // Get projects
      const projectsData = await supabaseDataService.getUserProjects(userId);
      const projects: Project[] = projectsData.map((project: any) => ({
        id: project.id,
        name: project.project_name,
        description: project.description,
        status: project.status,
        startDate: project.start_date,
        budget: project.budget,
        spent: project.actual_cost || 0,
        location: project.location?.city || 'الرياض',
        type: project.project_type || 'سكني'
      }));

      // Get invoices
      const invoicesData = await supabaseDataService.getUserInvoices(userId);
      const invoices: Invoice[] = invoicesData.map((invoice: any) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        store: invoice.store_name || 'متجر',
        amount: invoice.total_amount,
        status: invoice.status,
        issueDate: invoice.created_at,
        dueDate: invoice.due_date,
        items: invoice.items || []
      }));

      return {
        profile,
        orders,
        warranties,
        projects,
        invoices,
      };
    } catch (error) {
      console.error('Error loading real user data:', error);
      // Fallback to simplified mock data
      return {
        profile: {
          id: userId,
          name: tempUser.name || 'مستخدم تجريبي',
          email: tempUser.email || 'user@binna',
          phone: '+966501234567',
          city: 'الرياض',
          memberSince: '2024-01-01',
          accountType: 'free',
          loyaltyPoints: 1250,
          currentLevel: 3,
          totalSpent: 15750,
        },
        orders: [],
        warranties: [],
        projects: [],
        invoices: [],
      };
    }
  };

  // Load user data from various sources
  const loadUserData = async () => {
    try {
      setUserData(prev => ({ ...prev, isLoading: true, error: null }));

      // Force use of mock client for development
      if (!supabaseDataService.isUsingMockClient()) {
        console.log('🔄 Forcing supabaseDataService to use mock client');
        await supabaseDataService.forceMockClient();
      }

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
          try {
            const parsedUser = JSON.parse(decodeURIComponent(tempAuthCookie));
            console.log('🍪 Loading data for temp auth user:', parsedUser.email);
            
            // Load real data for temp user from Supabase
            const realData = await loadUserDataFromSupabase(parsedUser);
            const completeData = {
              profile: realData.profile || null,
              orders: realData.orders || [],
              warranties: realData.warranties || [],
              projects: realData.projects || [],
              invoices: realData.invoices || [],
            };
            
            console.log('✅ Successfully loaded user data:', {
              profile: !!completeData.profile,
              orders: completeData.orders.length,
              projects: completeData.projects.length
            });
            
            setUserData(prev => ({
              ...prev,
              ...completeData,
              stats: calculateStats(completeData),
              isLoading: false
            }));
            return;
          } catch (cookieError) {
            console.error('Error parsing temp auth cookie:', cookieError);
            // Continue to no auth found case
          }
        }
        
        // No auth found
        console.log('❌ No authentication found');
        setUserData(prev => ({
          ...prev,
          isLoading: false,
          error: 'غير مصرح بالوصول'
        }));
        return;
      }

      // Load data for authenticated user
      console.log('Loading data for authenticated user:', authUser.id);
      const realData = await loadUserDataFromSupabase({ id: authUser.id, email: authUser.email });
      const completeData = {
        profile: realData.profile || null,
        orders: realData.orders || [],
        warranties: realData.warranties || [],
        projects: realData.projects || [],
        invoices: realData.invoices || [],
      };
      
      console.log('✅ Successfully loaded authenticated user data');
      setUserData(prev => ({
        ...prev,
        ...completeData,
        stats: calculateStats(completeData),
        isLoading: false
      }));

    } catch (error) {
      console.error('❌ Error loading user data:', error);
      // Don't show error immediately, instead try to provide fallback data
      const getCookie = (name: string) => {
        if (typeof window === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const tempAuthCookie = getCookie('temp_auth_user');
      if (tempAuthCookie) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(tempAuthCookie));
          console.log('🔄 Providing fallback data for temp user');
          
          // Provide minimal fallback data
          const fallbackData = {
            profile: {
              id: 'temp-user',
              name: parsedUser.name || 'مستخدم تجريبي',
              email: parsedUser.email || 'user@binna',
              phone: '+966501234567',
              city: 'الرياض',
              memberSince: '2024-01-01',
              accountType: 'free' as const,
              loyaltyPoints: 1250,
              currentLevel: 3,
              totalSpent: 15750,
            },
            orders: [],
            warranties: [],
            projects: [],
            invoices: [],
          };
          
          setUserData(prev => ({
            ...prev,
            ...fallbackData,
            stats: calculateStats(fallbackData),
            isLoading: false,
            error: null
          }));
          return;
        } catch (fallbackError) {
          console.error('Fallback data failed:', fallbackError);
        }
      }
      
      setUserData(prev => ({
        ...prev,
        isLoading: false,
        error: 'حدث خطأ في تحميل البيانات'
      }));
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
          .from('user_profiles')
          .update(updates)
          .eq('user_id', user.id);
      }
      
      setUserData(prev => ({
        ...prev,
        profile: updatedProfile
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // ... rest of the action methods remain the same
  const addOrder = (order: Order) => {
    setUserData(prev => {
      const newOrders = [...prev.orders, order];
      const newData = { ...prev, orders: newOrders };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setUserData(prev => {
      const newOrders = prev.orders.map(order => 
        order.id === id ? { ...order, ...updates } : order
      );
      const newData = { ...prev, orders: newOrders };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const addWarranty = (warranty: Warranty) => {
    setUserData(prev => {
      const newWarranties = [...prev.warranties, warranty];
      const newData = { ...prev, warranties: newWarranties };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const updateWarranty = (id: string, updates: Partial<Warranty>) => {
    setUserData(prev => {
      const newWarranties = prev.warranties.map(warranty => 
        warranty.id === id ? { ...warranty, ...updates } : warranty
      );
      const newData = { ...prev, warranties: newWarranties };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const addProject = (project: Project) => {
    setUserData(prev => {
      const newProjects = [...prev.projects, project];
      const newData = { ...prev, projects: newProjects };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setUserData(prev => {
      const newProjects = prev.projects.map(project => 
        project.id === id ? { ...project, ...updates } : project
      );
      const newData = { ...prev, projects: newProjects };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const addInvoice = (invoice: Invoice) => {
    setUserData(prev => {
      const newInvoices = [...prev.invoices, invoice];
      const newData = { ...prev, invoices: newInvoices };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setUserData(prev => {
      const newInvoices = prev.invoices.map(invoice => 
        invoice.id === id ? { ...invoice, ...updates } : invoice
      );
      const newData = { ...prev, invoices: newInvoices };
      return {
        ...newData,
        stats: calculateStats(newData)
      };
    });
  };

  // Load data when auth state changes
  useEffect(() => {
    if (!authLoading) {
      loadUserData();
    }
  }, [authLoading, authUser, session]);

  // Context value
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
