// Mock Supabase Service for Development
// Provides the same interface as Supabase but stores data locally
// This allows development to continue without valid Supabase credentials

interface MockUser {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
}

interface MockSession {
  user: MockUser;
  access_token: string;
}

class MockSupabaseClient {
  private users: Map<string, MockUser> = new Map();
  private sessions: Map<string, MockSession> = new Map();
  private data: Map<string, any[]> = new Map();
  private currentSession: MockSession | null = null;

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleTables = [
      'user_profiles',
      'orders',
      'warranties', 
      'invoices',
      'invoice_items',
      'construction_projects'
    ];

    sampleTables.forEach(table => {
      this.data.set(table, []);
    });

    // Create demo users
    this.createDemoUser('demo.user@binna.sa', 'demo123456', {
      name: 'مستخدم تجريبي',
      role: 'user'
    });

    this.createDemoUser('demo.store@binna.sa', 'demo123456', {
      name: 'متجر تجريبي', 
      role: 'store_admin'
    });
  }

  private createDemoUser(email: string, password: string, metadata: any) {
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);
    
    this.users.set(email, {
      id: userId,
      email,
      user_metadata: metadata
    });

    // Create user profile
    const userProfiles = this.data.get('user_profiles') || [];
    userProfiles.push({
      id: userId,
      user_id: userId,
      email,
      display_name: metadata.name,
      city: 'الرياض',
      account_type: 'free',
      loyalty_points: 1250,
      current_level: 3,
      total_spent: 15750,
      created_at: new Date().toISOString()
    });
    this.data.set('user_profiles', userProfiles);

    // Create sample orders
    const orders = this.data.get('orders') || [];
    orders.push({
      id: 'ord_' + userId.substr(-6),
      user_id: userId,
      order_number: '#2024-001',
      store_name: 'متجر مواد البناء المتقدمة',
      total_amount: 775,
      status: 'delivered',
      created_at: '2024-01-15',
      shipping_address: 'الرياض، حي النرجس',
      payment_method: 'بطاقة ائتمان',
      tracking_number: 'TRK123456789'
    });
    this.data.set('orders', orders);

    // Create sample warranties
    const warranties = this.data.get('warranties') || [];
    warranties.push({
      id: 'war_' + userId.substr(-6),
      user_id: userId,
      product_name: 'مضخة المياه عالية الكفاءة',
      store_name: 'متجر الأدوات الصحية المتقدمة',
      purchase_date: '2024-01-15',
      expiry_date: '2026-01-15',
      status: 'active',
      warranty_type: 'ضمان الشركة المصنعة',
      product_value: 850,
      created_at: '2024-01-15'
    });
    this.data.set('warranties', warranties);

    // Create sample projects
    const projects = this.data.get('construction_projects') || [];
    projects.push({
      id: 'proj_' + userId.substr(-6),
      client_id: userId,
      name: 'مشروع فيلا العائلة',
      description: 'بناء فيلا سكنية بمساحة 400 متر مربع',
      status: 'in-progress',
      start_date: '2024-01-01',
      budget: 500000,
      spent_amount: 250000,
      location: 'الرياض، حي الملقا',
      project_type: 'سكني',
      created_at: '2024-01-01'
    });
    this.data.set('construction_projects', projects);

    // Create sample invoices
    const invoices = this.data.get('invoices') || [];
    const invoiceId = 'inv_' + userId.substr(-6);
    invoices.push({
      id: invoiceId,
      user_id: userId,
      invoice_number: 'INV-2024-001',
      store_name: 'متجر مواد البناء المتقدمة',
      total_amount: 775,
      status: 'paid',
      issue_date: '2024-01-15',
      due_date: '2024-02-15',
      created_at: '2024-01-15'
    });
    this.data.set('invoices', invoices);

    // Create sample invoice items
    const invoiceItems = this.data.get('invoice_items') || [];
    invoiceItems.push(
      {
        id: 'item_1_' + userId.substr(-6),
        invoice_id: invoiceId,
        description: 'أسمنت أبيض',
        quantity: 25,
        unit_price: 15,
        total_price: 375
      },
      {
        id: 'item_2_' + userId.substr(-6),
        invoice_id: invoiceId,
        description: 'رمل ناعم',
        quantity: 5,
        unit_price: 80,
        total_price: 400
      }
    );
    this.data.set('invoice_items', invoiceItems);
  }

  // Mock Auth methods
  auth = {
    signUp: async (credentials: { email: string; password: string; options?: any }) => {
      const { email, password, options } = credentials;
      
      if (this.users.has(email)) {
        return {
          data: { user: null, session: null },
          error: { message: 'User already exists' }
        };
      }

      const userId = 'user_' + Math.random().toString(36).substr(2, 9);
      const user: MockUser = {
        id: userId,
        email,
        user_metadata: options?.data || {}
      };

      this.users.set(email, user);
      
      const session: MockSession = {
        user,
        access_token: 'mock_token_' + userId
      };
      
      this.sessions.set(userId, session);
      this.currentSession = session;

      // Create user profile
      const userProfiles = this.data.get('user_profiles') || [];
      userProfiles.push({
        id: userId,
        user_id: userId,
        email,
        display_name: options?.data?.name || email.split('@')[0],
        city: 'الرياض',
        account_type: options?.data?.account_type || 'free',
        loyalty_points: 0,
        current_level: 1,
        total_spent: 0,
        created_at: new Date().toISOString()
      });
      this.data.set('user_profiles', userProfiles);

      return {
        data: { user, session },
        error: null
      };
    },

    signInWithPassword: async (credentials: { email: string; password: string }) => {
      const { email } = credentials;
      const user = this.users.get(email);
      
      if (!user) {
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid login credentials' }
        };
      }

      const session: MockSession = {
        user,
        access_token: 'mock_token_' + user.id
      };
      
      this.sessions.set(user.id, session);
      this.currentSession = session;

      return {
        data: { user, session },
        error: null
      };
    },

    signOut: async () => {
      this.currentSession = null;
      return { error: null };
    },

    getUser: async () => {
      return {
        data: { user: this.currentSession?.user || null },
        error: null
      };
    },

    getSession: async () => {
      return {
        data: { session: this.currentSession },
        error: null
      };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Mock subscription
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  };

  // Mock Database methods
  from(table: string) {
    return {
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            const tableData = this.data.get(table) || [];
            const item = tableData.find((row: any) => row[column] === value);
            return {
              data: item || null,
              error: item ? null : { code: 'PGRST116', message: 'No rows found' }
            };
          },
          order: (column: string, options?: any) => ({
            then: async () => {
              const tableData = this.data.get(table) || [];
              const filtered = tableData.filter((row: any) => row[column] === value);
              return {
                data: filtered,
                error: null
              };
            }
          }),
          then: async () => {
            const tableData = this.data.get(table) || [];
            const filtered = tableData.filter((row: any) => row[column] === value);
            return {
              data: filtered,
              error: null
            };
          }
        }),
        limit: (count: number) => ({
          then: async () => {
            const tableData = this.data.get(table) || [];
            return {
              data: tableData.slice(0, count),
              error: null
            };
          }
        }),
        order: (column: string, options?: any) => ({
          then: async () => {
            const tableData = this.data.get(table) || [];
            return {
              data: tableData,
              error: null
            };
          }
        }),
        then: async () => {
          const tableData = this.data.get(table) || [];
          return {
            data: tableData,
            error: null
          };
        }
      }),

      insert: (data: any) => ({
        select: () => ({
          then: async () => {
            const tableData = this.data.get(table) || [];
            const newItems = Array.isArray(data) ? data : [data];
            
            const insertedItems = newItems.map(item => ({
              id: Math.random().toString(36).substr(2, 9),
              ...item,
              created_at: new Date().toISOString()
            }));
            
            tableData.push(...insertedItems);
            this.data.set(table, tableData);
            
            return {
              data: insertedItems,
              error: null
            };
          }
        })
      }),

      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: async () => {
              const tableData = this.data.get(table) || [];
              const index = tableData.findIndex((row: any) => row[column] === value);
              
              if (index === -1) {
                return {
                  data: null,
                  error: { message: 'No rows found to update' }
                };
              }
              
              tableData[index] = { ...tableData[index], ...data };
              this.data.set(table, tableData);
              
              return {
                data: tableData[index],
                error: null
              };
            }
          })
        })
      })
    };
  }
}

// Export mock client
export const mockSupabaseClient = new MockSupabaseClient();

// Mock client component client creator
export const createClientComponentClient = () => mockSupabaseClient;
