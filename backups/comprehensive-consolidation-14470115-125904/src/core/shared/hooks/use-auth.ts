import { useSession, signIn, signOut } from 'next-auth/react';

export interface BinnaUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'store_owner' | 'customer' | 'employee';
}

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user as BinnaUser | undefined;

  const login = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return result;
  };

  const logout = async () => {
    await signOut({ redirect: false });
  };

  const isAuthenticated = !!session;
  const isLoading = status === 'loading';

  // Role-based access control
  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]) => {
    return user?.role && roles.includes(user.role);
  };

  const isAdmin = () => hasRole('admin');
  const isStoreOwner = () => hasRole('store_owner');
  const isCustomer = () => hasRole('customer');
  const isEmployee = () => hasRole('employee');

  // Permission checks for different products
  const canAccessPOS = () => {
    return hasAnyRole(['admin', 'store_owner', 'employee']);
  };

  const canAccessInventory = () => {
    return hasAnyRole(['admin', 'store_owner']);
  };

  const canAccessAccounting = () => {
    return hasAnyRole(['admin', 'store_owner']);
  };

  const canAccessCRM = () => {
    return hasAnyRole(['admin', 'store_owner']);
  };

  const canAccessAnalytics = () => {
    return hasAnyRole(['admin', 'store_owner']);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAdmin,
    isStoreOwner,
    isCustomer,
    isEmployee,
    canAccessPOS,
    canAccessInventory,
    canAccessAccounting,
    canAccessCRM,
    canAccessAnalytics,
  };
}

export default useAuth;
