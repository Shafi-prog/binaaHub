// Temporary Auth Service
// Provides basic auth functionality for development/testing

export interface TempUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'store_owner' | 'store_admin';
  type?: 'user' | 'store';
  isAuthenticated: boolean;
}

export interface AuthState {
  user: TempUser | null;
  isLoading: boolean;
  error: string | null;
}

class TempAuthService {
  private currentUser: TempUser | null = null;
  private listeners: Array<(user: TempUser | null) => void> = [];

  // Real users for production (matching database seed data)
  private mockUsers: Record<string, TempUser> = {
    'user@binaa.com': {
      id: 'real-user-001',
      email: 'user@binaa.com',
      name: 'محمد العبدالله',
      role: 'user',
      isAuthenticated: true
    },
    'store@binaa.com': {
      id: 'real-store-001',
      email: 'store@binaa.com',
      name: 'أحمد التجاري',
      role: 'store_owner',
      isAuthenticated: true
    },
    // Keep admin for system administration
    'admin@binaa.com': {
      id: 'admin-001',
      email: 'admin@binaa.com',
      name: 'مدير النظام',
      role: 'admin',
      isAuthenticated: true
    }
  };

  constructor() {
    // Check for persisted session from sessionStorage but don't auto-authenticate
    // Let the components handle authentication via the direct login system
  }

  // Subscribe to auth state changes
  onAuthStateChange(callback: (user: TempUser | null) => void): () => void {
    this.listeners.push(callback);
    
    // Immediately call with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners of auth state change
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  // Get current user
  getCurrentUser(): TempUser | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser?.isAuthenticated || false;
  }

  // Check if user has specific role
  hasRole(role: TempUser['role']): boolean {
    return this.currentUser?.role === role;
  }

  // Check if user has admin privileges
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Check if user is store owner
  isStoreOwner(): boolean {
    return this.hasRole('store_owner');
  }

  // Login with email and password
  async login(email: string, password: string): Promise<{
    success: boolean;
    user?: TempUser;
    error?: string;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = this.mockUsers[email.toLowerCase()];
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // For development, accept any password
    this.currentUser = user;
    this.notifyListeners();

    return {
      success: true,
      user
    };
  }

  // Logout
  async logout(): Promise<void> {
    this.currentUser = null;
    this.notifyListeners();
  }

  // Register new user (mock implementation)
  async register(userData: {
    email: string;
    password: string;
    name: string;
    role?: TempUser['role'];
  }): Promise<{
    success: boolean;
    user?: TempUser;
    error?: string;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (this.mockUsers[userData.email.toLowerCase()]) {
      return {
        success: false,
        error: 'Email already exists'
      };
    }

    const newUser: TempUser = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role || 'user',
      isAuthenticated: true
    };

    // Add to mock users
    this.mockUsers[userData.email.toLowerCase()] = newUser;
    this.currentUser = newUser;
    this.notifyListeners();

    return {
      success: true,
      user: newUser
    };
  }

  // Update user profile
  async updateProfile(updates: Partial<Pick<TempUser, 'name' | 'email'>>): Promise<{
    success: boolean;
    user?: TempUser;
    error?: string;
  }> {
    if (!this.currentUser) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    this.currentUser = {
      ...this.currentUser,
      ...updates
    };

    this.notifyListeners();

    return {
      success: true,
      user: this.currentUser
    };
  }

  // Reset password (mock implementation)
  async resetPassword(email: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!this.mockUsers[email.toLowerCase()]) {
      return {
        success: false,
        error: 'Email not found'
      };
    }

    return {
      success: true,
      message: 'Password reset email sent'
    };
  }

  // Verify email (mock implementation)
  async verifyEmail(token: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: 'Email verified successfully'
    };
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<TempUser[]> {
    if (!this.isAdmin()) {
      throw new Error('Unauthorized: Admin access required');
    }

    return Object.values(this.mockUsers);
  }

  // Switch user (development helper)
  switchUser(email: string): boolean {
    const user = this.mockUsers[email.toLowerCase()];
    if (user) {
      this.currentUser = user;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Set current user directly (for session restoration)
  setCurrentUser(user: TempUser | null): void {
    this.currentUser = user;
    this.notifyListeners();
  }
}

// Export singleton instance
export const tempAuthService = new TempAuthService();

// Export default
export default tempAuthService;

// Convenience functions for common operations
export const verifyTempAuth = (maxAgeHours: number = 24) => {
  // Check sessionStorage first for direct login
  if (typeof window !== 'undefined') {
    try {
      const tempUser = sessionStorage.getItem('temp_user');
      const tempTimestamp = sessionStorage.getItem('temp_auth_timestamp');
      
      if (tempUser && tempTimestamp) {
        const user = JSON.parse(tempUser);
        const timestamp = parseInt(tempTimestamp);
        const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert hours to milliseconds
        
        if (Date.now() - timestamp < maxAge) {
          // Set the user in the service using the public method
          tempAuthService.setCurrentUser({
            ...user,
            isAuthenticated: true
          });
          return { user: tempAuthService.getCurrentUser() };
        } else {
          // Clear expired session
          sessionStorage.removeItem('temp_user');
          sessionStorage.removeItem('temp_auth_timestamp');
        }
      }
    } catch (error) {
      console.error('Error reading temp auth from sessionStorage:', error);
    }
  }
  
  // Fallback to service's current user
  const currentUser = tempAuthService.getCurrentUser();
  return currentUser ? { user: currentUser } : null;
};

export const getTempAuthUser = () => {
  return tempAuthService.getCurrentUser();
};

export const clearTempAuth = () => {
  tempAuthService.logout();
};
