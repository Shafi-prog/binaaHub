// src/lib/database.ts
import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create singleton database client
let databaseInstance: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Get a database client instance (singleton pattern)
 */
export function getDatabase() {
  if (!databaseInstance) {
    databaseInstance = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // For server-side operations
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    console.log('🗄️ Database client initialized');
  }
  return databaseInstance;
}

/**
 * Get a client-side database client with auth support
 */
export function getClientDatabase() {
  return createClientComponentClient<Database>();
}

/**
 * Database connection configuration
 */
export const dbConfig = {
  url: supabaseUrl,
  key: supabaseKey,
  options: {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
};

/**
 * Database table names (for type safety)
 */
export const tables = {
  users: 'users',
  store_profiles: 'store_profiles',
  orders: 'orders',
  order_items: 'order_items',
  products: 'products',
  warranties: 'warranties',
  warranty_claims: 'warranty_claims',
  projects: 'projects',
  project_materials: 'project_materials',
  notifications: 'notifications',
  spending_tracking: 'spending_tracking',
  store_analytics: 'store_analytics',
  store_views: 'store_views',
  marketing_campaigns: 'marketing_campaigns',
} as const;

/**
 * Common database operations
 */
export class DatabaseOperations {
  private db: ReturnType<typeof createClient<Database>>;

  constructor(useClientAuth = false) {
    this.db = useClientAuth ? getClientDatabase() : getDatabase();
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    try {
      const { data, error } = await this.db.from(tables.users).select('*').eq('id', id).single();

      if (error) {
        console.error('❌ [DB] Error fetching user by ID:', error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('❌ [DB] Unexpected error in getUserById:', error);
      return { data: null, error };
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string) {
    try {
      const { data, error } = await this.db
        .from(tables.users)
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('❌ [DB] Error fetching user by email:', error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('❌ [DB] Unexpected error in getUserByEmail:', error);
      return { data: null, error };
    }
  }

  /**
   * Update user data
   */
  async updateUser(id: string, updates: Partial<Database['public']['Tables']['users']['Update']>) {
    try {
      const { data, error } = await this.db
        .from(tables.users)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ [DB] Error updating user:', error.message);
        return { data: null, error };
      }

      console.log('✅ [DB] User updated successfully:', id);
      return { data, error: null };
    } catch (error) {
      console.error('❌ [DB] Unexpected error in updateUser:', error);
      return { data: null, error };
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    try {
      const { data, error } = await this.db.from(tables.users).insert(userData).select().single();

      if (error) {
        console.error('❌ [DB] Error creating user:', error.message);
        return { data: null, error };
      }

      console.log('✅ [DB] User created successfully:', data.id);
      return { data, error: null };
    } catch (error) {
      console.error('❌ [DB] Unexpected error in createUser:', error);
      return { data: null, error };
    }
  }

  /**
   * Get orders for user
   */
  async getUserOrders(userId: string, limit = 10) {
    try {
      const { data, error } = await this.db
        .from(tables.orders)
        .select(
          `
          *,
          order_items(*)
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ [DB] Error fetching user orders:', error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('❌ [DB] Unexpected error in getUserOrders:', error);
      return { data: null, error };
    }
  }

  /**
   * Get user projects
   */
  async getUserProjects(userId: string, limit = 10) {
    try {
      const { data, error } = await this.db
        .from(tables.projects)
        .select(
          `
          *,
          project_materials(*)
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ [DB] Error fetching user projects:', error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('❌ [DB] Unexpected error in getUserProjects:', error);
      return { data: null, error };
    }
  }

  /**
   * Get user warranties
   */
  async getUserWarranties(userId: string, limit = 10) {
    try {
      const { data, error } = await this.db
        .from(tables.warranties)
        .select(
          `
          *,
          warranty_claims(*)
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ [DB] Error fetching user warranties:', error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('❌ [DB] Unexpected error in getUserWarranties:', error);
      return { data: null, error };
    }
  }

  /**
   * Health check for database connection
   */
  async healthCheck() {
    try {
      const { data, error } = await this.db.from(tables.users).select('id').limit(1);

      if (error) {
        console.error('❌ [DB] Health check failed:', error.message);
        return { healthy: false, error: error.message };
      }

      console.log('✅ [DB] Health check passed');
      return { healthy: true, error: null };
    } catch (error) {
      console.error('❌ [DB] Health check error:', error);
      return { healthy: false, error: String(error) };
    }
  }
}

/**
 * Database transaction helper
 */
export async function withTransaction<T>(
  operations: (db: ReturnType<typeof getDatabase>) => Promise<T>
): Promise<{ data: T | null; error: any }> {
  const db = getDatabase();

  try {
    const result = await operations(db);
    return { data: result, error: null };
  } catch (error) {
    console.error('❌ [DB] Transaction failed:', error);
    return { data: null, error };
  }
}

/**
 * Database query builder helpers
 */
export const queryBuilder = {
  /**
   * Build a select query with common joins
   */
  users: {
    withProfile: (db: ReturnType<typeof getDatabase>) =>
      db.from(tables.users).select(`
        *,
        store_profiles(*)
      `),

    withStats: (db: ReturnType<typeof getDatabase>) =>
      db.from(tables.users).select(`
        *,
        orders(count),
        projects(count),
        warranties(count)
      `),
  },

  /**
   * Build order queries with relations
   */
  orders: {
    withItems: (db: ReturnType<typeof getDatabase>) =>
      db.from(tables.orders).select(`
        *,
        order_items(*),
        users(name, email)
      `),
  },

  /**
   * Build project queries with materials
   */
  projects: {
    withMaterials: (db: ReturnType<typeof getDatabase>) =>
      db.from(tables.projects).select(`
        *,
        project_materials(*),
        users(name, email)
      `),
  },
};

/**
 * Export default database instance for quick access
 */
export const db = getDatabase();

/**
 * Export client database for component use
 */
export const clientDb = getClientDatabase();

/**
 * Common database operations instance
 */
export const dbOps = new DatabaseOperations(true); // Use client auth by default

console.log('🗄️ Database module initialized with Supabase');
