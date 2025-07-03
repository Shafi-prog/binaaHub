// Application-specific types
export type UserRole = 'user' | 'store' | 'admin';
export type AccountStatus = 'active' | 'suspended' | 'pending';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type ProjectStatus =
  | 'planning'
  | 'design'
  | 'permits'
  | 'construction'
  | 'finishing'
  | 'completed'
  | 'on_hold';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Database types
export interface UserData {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  account_type: UserRole;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface StoreData {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  cover_image?: string;
  business_type?: string;
  business_license?: string;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocationData {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  region?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  hasMore: boolean;
}

// Context types
export interface AuthContext {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<ApiResponse<UserData>>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface BusinessContext {
  store: StoreData | null;
  loading: boolean;
  error: string | null;
  refreshStore: () => Promise<void>;
}

// Component props types
export interface LayoutProps {
  children: React.ReactNode;
}

export interface ProtectedRouteProps extends LayoutProps {
  requiredRole?: UserRole[];
}

export interface MapProps {
  location?: LocationData;
  onLocationSelect?: (location: LocationData) => void;
  readOnly?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    title: string;
    render?: (value: any, item: T) => React.ReactNode;
  }[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
}
