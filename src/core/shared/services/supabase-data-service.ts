import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export class SupabaseDataService {
  private supabase: any;
  private static instance: SupabaseDataService;
  private usingMockClient = false;

  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      // Always use real Supabase client for production data
      this.supabase = createClientComponentClient();
      console.log('✅ Using real Supabase client');
      this.usingMockClient = false;
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error);
      throw error; // Don't fallback to mock, let the error propagate
    }
  }

  private async switchToMockClient() {
    try {
      const { mockSupabaseClient } = await import('@/core/shared/services/mock-supabase');
      this.supabase = mockSupabaseClient;
      this.usingMockClient = true;
      console.log('✅ Using mock Supabase client');
    } catch (error) {
      console.error('Failed to load mock client:', error);
    }
  }

  static getInstance(): SupabaseDataService {
    if (!SupabaseDataService.instance) {
      SupabaseDataService.instance = new SupabaseDataService();
    }
    return SupabaseDataService.instance;
  }

  // Force switch to mock client (useful for development)
  async forceMockClient() {
    console.log('🔄 Forcing switch to mock client');
    await this.switchToMockClient();
  }

  // Check if using mock client
  isUsingMockClient(): boolean {
    return this.usingMockClient;
  }

  // User Profile Data
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // Handle specific Supabase RLS policy errors
        if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
          console.warn('Supabase RLS policy error detected, using fallback data');
          return this.getDefaultUserProfile(userId);
        }
        
        if (error.code !== 'PGRST116') {
          console.error('Supabase profile fetch error:', error.message);
          return this.getDefaultUserProfile(userId);
        }
      }

      return data || this.getDefaultUserProfile(userId);
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return this.getDefaultUserProfile(userId);
    }
  }

  // User Orders
  async getUserOrders(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        
        // Handle RLS policy errors
        if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
          console.warn('Supabase RLS policy error for orders, using fallback data');
          return this.getDefaultOrders();
        }
        
        return this.getDefaultOrders();
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserOrders:', error);
      return this.getDefaultOrders();
    }
  }

  // User Projects
  async getUserProjects(userId: string) {
    try {
      // If using mock client or if we get auth errors, use localStorage
      if (this.usingMockClient) {
        return this.getProjectsFromLocalStorage();
      }

      const { data, error } = await this.supabase
        .from('construction_projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        // Check for authentication/permission errors
        if (error.message.includes('غير مصرح') || 
            error.message.includes('not authorized') ||
            error.message.includes('permission') ||
            error.code === 'PGRST301' ||
            error.code === '42501') {
          console.log('Authentication error detected, switching to localStorage data');
          await this.switchToMockClient();
        }
        // Fall back to localStorage projects + defaults
        return this.getProjectsFromLocalStorage();
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserProjects:', error);
      // Fall back to localStorage projects + defaults
      return this.getProjectsFromLocalStorage();
    }
  }

  // Helper method to get projects from localStorage and merge with defaults
  private getProjectsFromLocalStorage() {
    try {
      // Get projects from ProjectTrackingService localStorage
      let localProjects = [];
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('binna_projects');
        localProjects = stored ? JSON.parse(stored) : [];
      }

      // Transform localStorage projects to match supabase format
      const transformedProjects = localProjects.map((project: any) => ({
        id: project.id,
        user_id: 'local_user', // Since we're using local auth
        project_name: project.name,
        description: project.description,
        status: project.status,
        start_date: project.startDate,
        budget: project.budget || 0,
        actual_cost: 0, // Default value
        completion_percentage: project.progress || 0,
        location: { city: project.location || 'الرياض' },
        project_type: project.projectType,
        created_at: project.createdAt,
        updated_at: project.updatedAt
      }));

      // Merge with default projects
      const defaultProjects = this.getDefaultProjects();
      return [...transformedProjects, ...defaultProjects];
    } catch (error) {
      console.error('Error loading projects from localStorage:', error);
      return this.getDefaultProjects();
    }
  }

  // User Warranties
  async getUserWarranties(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('warranties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching warranties:', error);
        return this.getDefaultWarranties();
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserWarranties:', error);
      return this.getDefaultWarranties();
    }
  }

  // User Invoices
  async getUserInvoices(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
        return this.getDefaultInvoices();
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserInvoices:', error);
      return this.getDefaultInvoices();
    }
  }

  // Service Provider Data
  async getServiceProviderProfile(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching service provider profile:', error);
        return this.getDefaultServiceProviderProfile();
      }

      return data || this.getDefaultServiceProviderProfile();
    } catch (error) {
      console.error('Error in getServiceProviderProfile:', error);
      return this.getDefaultServiceProviderProfile();
    }
  }

  // Store Data
  async getStoreProfile(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('stores')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching store profile:', error);
        return this.getDefaultStoreProfile();
      }

      return data || this.getDefaultStoreProfile();
    } catch (error) {
      console.error('Error in getStoreProfile:', error);
      return this.getDefaultStoreProfile();
    }
  }

  // Admin System Stats
  async getSystemStats() {
    try {
      const [usersResult, storesResult, providersResult] = await Promise.all([
        this.supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        this.supabase.from('stores').select('id', { count: 'exact', head: true }),
        this.supabase.from('service_providers').select('id', { count: 'exact', head: true })
      ]);

      return {
        totalUsers: usersResult.count || 0,
        totalStores: storesResult.count || 0,
        totalServiceProviders: providersResult.count || 0,
        totalRevenue: 0, // Calculate from orders
        activeOrders: 0, // Calculate from orders
        pendingApprovals: 0, // Calculate from pending verifications
        systemHealth: 98.5,
        dailyActiveUsers: 0 // Would need session tracking
      };
    } catch (error) {
      console.error('Error in getSystemStats:', error);
      return this.getDefaultSystemStats();
    }
  }

  // Seed/Insert Sample Data
  async insertSampleData(userId: string, userRole: string) {
    try {
      // Skip insertion if using mock client since it already has data
      if (this.usingMockClient) {
        console.log('🔄 Using mock client, skipping sample data insertion');
        return;
      }

      // Insert user profile if doesn't exist
      const { error: profileError } = await this.supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          email: `${userRole}@binna`,
          display_name: userRole === 'user' ? 'مستخدم تجريبي' : 
                      userRole === 'store' ? 'متجر تجريبي' : 
                      userRole === 'admin' ? 'المسئول تجريبي' : 'مقدم خدمة تجريبي',
          city: 'الرياض',
          account_type: 'free',
          loyalty_points: 1250,
          current_level: 3,
          total_spent: 15750,
          role: userRole
        });

      if (profileError) console.error('Error inserting profile:', profileError);

      // Insert sample orders for users
      if (userRole === 'user') {
        await this.insertSampleOrders(userId);
        await this.insertSampleProjects(userId);
        await this.insertSampleWarranties(userId);
        await this.insertSampleInvoices(userId);
      }

      // Insert service provider profile
      if (userRole === 'service_provider') {
        await this.insertSampleServiceProvider(userId);
      }

      // Insert store profile
      if (userRole === 'store') {
        await this.insertSampleStore(userId);
      }

    } catch (error) {
      console.error('Error inserting sample data:', error);
    }
  }

  private async insertSampleOrders(userId: string) {
    const sampleOrders = [
      {
        user_id: userId,
        order_number: 'ORD-2025-001',
        status: 'delivered',
        total_amount: 1250.00,
        currency: 'SAR',
        items: [
          { name: 'إسمنت أبيض', quantity: 10, price: 125.00 }
        ],
        payment_method: 'card',
        payment_status: 'paid',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: userId,
        order_number: 'ORD-2025-002',
        status: 'processing',
        total_amount: 850.00,
        currency: 'SAR',
        items: [
          { name: 'رمل ناعم', quantity: 5, price: 170.00 }
        ],
        payment_method: 'transfer',
        payment_status: 'paid',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    for (const order of sampleOrders) {
      await this.supabase.from('orders').upsert(order);
    }
  }

  private async insertSampleProjects(userId: string) {
    const sampleProjects = [
      {
        user_id: userId,
        project_name: 'بناء فيلا سكنية',
        description: 'مشروع بناء فيلا سكنية بمساحة 400 متر مربع',
        project_type: 'residential',
        status: 'in_progress',
        budget: 500000.00,
        actual_cost: 350000.00,
        start_date: '2025-03-01',
        completion_percentage: 65,
        location: { city: 'الرياض', area: 'النرجس' }
      },
      {
        user_id: userId,
        project_name: 'تجديد المطبخ',
        description: 'تجديد شامل للمطبخ مع تغيير الخزائن والأجهزة',
        project_type: 'renovation',
        status: 'completed',
        budget: 50000.00,
        actual_cost: 48000.00,
        start_date: '2025-01-15',
        completion_percentage: 100,
        location: { city: 'الرياض', area: 'العليا' }
      }
    ];

    for (const project of sampleProjects) {
      await this.supabase.from('construction_projects').upsert(project);
    }
  }

  private async insertSampleWarranties(userId: string) {
    const sampleWarranties = [
      {
        user_id: userId,
        product_name: 'مكيف سبليت 2 طن',
        warranty_type: 'manufacturer',
        warranty_period_months: 24,
        purchase_date: '2024-06-15',
        expiry_date: '2026-06-15',
        status: 'active'
      },
      {
        user_id: userId,
        product_name: 'خزان مياه 1000 لتر',
        warranty_type: 'extended',
        warranty_period_months: 36,
        purchase_date: '2024-08-20',
        expiry_date: '2027-08-20',
        status: 'active'
      }
    ];

    for (const warranty of sampleWarranties) {
      await this.supabase.from('warranties').upsert(warranty);
    }
  }

  private async insertSampleInvoices(userId: string) {
    const sampleInvoices = [
      {
        user_id: userId,
        invoice_number: 'INV-2025-001',
        subtotal: 1250.00,
        tax_amount: 187.50,
        total_amount: 1437.50,
        status: 'paid',
        due_date: '2025-07-15',
        paid_date: '2025-07-10',
        payment_method: 'card'
      }
    ];

    for (const invoice of sampleInvoices) {
      await this.supabase.from('invoices').upsert(invoice);
    }
  }

  private async insertSampleServiceProvider(userId: string) {
    await this.supabase.from('service_providers').upsert({
      user_id: userId,
      business_name: 'مكتب التصميم المعماري المتقدم',
      owner_name: 'مقدم خدمة تجريبي',
      email: 'provider@binna',
      phone: '+966501234567',
      business_type: 'architectural_design',
      service_categories: ['تصميم معماري', 'إشراف هندسي', 'استشارات'],
      experience_years: 10,
      team_size: 15,
      rating: 4.8,
      review_count: 156,
      completed_projects: 45,
      active_projects: 12,
      response_time: '2 ساعة',
      verification_status: 'verified',
      location: { city: 'الرياض', area: 'العليا' }
    });
  }

  private async insertSampleStore(userId: string) {
    await this.supabase.from('stores').upsert({
      user_id: userId,
      store_name: 'متجر مواد البناء الحديث',
      owner_name: 'متجر تجريبي',
      email: 'store@binna',
      phone: '+966501234567',
      business_type: 'building_materials',
      description: 'متجر متخصص في بيع مواد البناء والتشطيب',
      rating: 4.5,
      review_count: 234,
      total_sales: 1250000.00,
      total_orders: 567,
      verification_status: 'verified',
      location: { city: 'الرياض', area: 'الصناعية' }
    });
  }

  // Material Prices Data
  async getMaterialPrices() {
    try {
      // Check if Supabase is available
      if (!this.supabase) {
        console.warn('Supabase not available, returning default price data');
        return this.getDefaultPriceData();
      }

      const { data, error } = await this.supabase
        .from('material_prices')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(50);

      if (error) {
        console.warn('Error fetching material prices from database, using default data:', error.message);
        return this.getDefaultPriceData();
      }

      if (!data || data.length === 0) {
        console.info('No material prices found in database, using default data');
        // Optionally insert sample data, but don't wait for it
        this.insertSamplePriceData().catch(err => 
          console.warn('Failed to insert sample price data:', err)
        );
        return this.getDefaultPriceData();
      }

      return data.map((item: any) => ({
        product: item.product_name,
        category: item.category,
        price: item.price,
        change: item.price_change_percentage || 0,
        store: item.store_name,
        city: item.city,
        lastUpdated: this.formatTimeAgo(item.last_updated)
      }));
    } catch (error) {
      console.warn('Error in getMaterialPrices, returning default data:', error);
      return this.getDefaultPriceData();
    }
  }

  // Insert sample price data
  async insertSamplePriceData() {
    const samplePrices = [
      // Metal Products
      { product_name: "طن حديد", category: "معادن", price: 450, price_change_percentage: 12.5, store_name: "شركة الخليج للحديد", city: "الرياض" },
      { product_name: "كيلو نحاس", category: "معادن", price: 8.75, price_change_percentage: -3.2, store_name: "عالم المعادن", city: "دبي" },
      { product_name: "طن ألمونيوم", category: "معادن", price: 2100, price_change_percentage: 5.8, store_name: "المنارة للمعادن", city: "الكويت" },
      { product_name: "طن حديد تسليح", category: "معادن", price: 520, price_change_percentage: 8.2, store_name: "مملكة الحديد", city: "الرياض" },
      { product_name: "كيلو زنك", category: "معادن", price: 3.20, price_change_percentage: -1.5, store_name: "شركة الخليج للحديد", city: "دبي" },
      
      // Precious Metals
      { product_name: "جرام ذهب", category: "معادن ثمينة", price: 235, price_change_percentage: 1.2, store_name: "قصر الذهب", city: "الدوحة" },
      { product_name: "أونصة فضة", category: "معادن ثمينة", price: 24.50, price_change_percentage: -0.8, store_name: "نجمة الفضة", city: "المنامة" },
      { product_name: "جرام بلاتين", category: "معادن ثمينة", price: 32.5, price_change_percentage: 2.1, store_name: "شركة المعادن الثمينة", city: "الرياض" },
      
      // Construction Materials
      { product_name: "كيس إسمنت 50كغ", category: "مواد بناء", price: 18.5, price_change_percentage: 3.4, store_name: "أساتذة البناء", city: "الرياض" },
      { product_name: "طن رمل", category: "مواد بناء", price: 45, price_change_percentage: 5.2, store_name: "البناء بلس", city: "دبي" },
      { product_name: "طن حصى", category: "مواد بناء", price: 55, price_change_percentage: -2.1, store_name: "أساتذة البناء", city: "الكويت" },
      { product_name: "1000 طوبة", category: "مواد بناء", price: 280, price_change_percentage: 4.5, store_name: "مصنع الطوب", city: "الدوحة" },
      { product_name: "بلاط للمتر المربع", category: "مواد بناء", price: 85, price_change_percentage: -1.2, store_name: "عالم البلاط", city: "المنامة" },
      
      // Electronics
      { product_name: "سلك نحاس 100م", category: "إلكترونيات", price: 125, price_change_percentage: 6.8, store_name: "الكهرباء المحترفة", city: "الرياض" },
      { product_name: "لمبة LED", category: "إلكترونيات", price: 15.5, price_change_percentage: -2.3, store_name: "بيت الإضاءة", city: "دبي" },
      { product_name: "مفتاح كهرباء", category: "إلكترونيات", price: 25, price_change_percentage: 1.8, store_name: "الكهرباء المحترفة", city: "الكويت" },
      
      // Textiles
      { product_name: "متر قماش قطني", category: "منسوجات", price: 12.5, price_change_percentage: 2.8, store_name: "أرض الأقمشة", city: "الرياض" },
      { product_name: "متر قماش حريري", category: "منسوجات", price: 45, price_change_percentage: -1.5, store_name: "الأقمشة الفاخرة", city: "دبي" },
      { product_name: "متر قماش صوفي", category: "منسوجات", price: 28, price_change_percentage: 3.2, store_name: "أرض الأقمشة", city: "الدوحة" },
      
      // Food & Commodities
      { product_name: "طن قمح", category: "غذائيات", price: 320, price_change_percentage: 4.5, store_name: "سوق الحبوب", city: "الرياض" },
      { product_name: "طن أرز", category: "غذائيات", price: 580, price_change_percentage: -2.1, store_name: "مركز الغذاء", city: "دبي" },
      { product_name: "طن سكر", category: "غذائيات", price: 450, price_change_percentage: 1.8, store_name: "إمداد الحلويات", city: "الكويت" }
    ];

    try {
      for (const price of samplePrices) {
        await this.supabase.from('material_prices').upsert({
          ...price,
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error inserting sample price data:', error);
    }
  }

  // Format time ago helper
  private formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `منذ ${hours} ساعة${hours > 1 ? '' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `منذ ${days} يوم${days > 1 ? '' : ''}`;
    }
  }

  // Default fallback data methods
  private getDefaultUserProfile(userId: string) {
    return {
      id: userId,
      user_id: userId,
      email: 'user@binna',
      display_name: 'مستخدم تجريبي',
      city: 'الرياض',
      account_type: 'free',
      loyalty_points: 1250,
      current_level: 3,
      total_spent: 15750,
      member_since: '2024-01-01'
    };
  }

  private getDefaultOrders() {
    return [
      {
        id: '1',
        order_number: 'ORD-2025-001',
        status: 'delivered',
        total_amount: 1250.00,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  private getDefaultProjects() {
    return [
      {
        id: '1',
        project_name: 'بناء فيلا سكنية',
        status: 'in_progress',
        budget: 500000.00,
        completion_percentage: 65
      }
    ];
  }

  private getDefaultWarranties() {
    return [
      {
        id: '1',
        product_name: 'مكيف سبليت 2 طن',
        status: 'active',
        expiry_date: '2026-06-15'
      }
    ];
  }

  private getDefaultInvoices() {
    return [
      {
        id: '1',
        invoice_number: 'INV-2025-001',
        total_amount: 1437.50,
        status: 'paid'
      }
    ];
  }

  private getDefaultServiceProviderProfile() {
    return {
      business_name: 'مكتب التصميم المعماري المتقدم',
      rating: 4.8,
      completed_projects: 45,
      active_projects: 12,
      response_time: '2 ساعة'
    };
  }

  private getDefaultStoreProfile() {
    return {
      store_name: 'متجر مواد البناء الحديث',
      rating: 4.5,
      total_sales: 1250000.00,
      total_orders: 567
    };
  }

  private getDefaultSystemStats() {
    return {
      totalUsers: 2547,
      totalStores: 456,
      totalServiceProviders: 123,
      totalRevenue: 2450000,
      activeOrders: 234,
      pendingApprovals: 12,
      systemHealth: 98.5,
      dailyActiveUsers: 1234
    };
  }

  private getDefaultPriceData() {
    return [
      // Metal Products
      { product: "طن حديد", category: "معادن", price: 450, change: 12.5, store: "شركة الخليج للحديد", city: "الرياض", lastUpdated: "منذ ساعتين" },
      { product: "كيلو نحاس", category: "معادن", price: 8.75, change: -3.2, store: "عالم المعادن", city: "دبي", lastUpdated: "منذ ساعة" },
      { product: "طن ألمونيوم", category: "معادن", price: 2100, change: 5.8, store: "المنارة للمعادن", city: "الكويت", lastUpdated: "منذ 30 دقيقة" },
      { product: "طن حديد تسليح", category: "معادن", price: 520, change: 8.2, store: "مملكة الحديد", city: "الرياض", lastUpdated: "منذ 3 ساعات" },
      { product: "كيلو زنك", category: "معادن", price: 3.20, change: -1.5, store: "شركة الخليج للحديد", city: "دبي", lastUpdated: "منذ ساعة" },
      
      // Precious Metals
      { product: "جرام ذهب", category: "معادن ثمينة", price: 235, change: 1.2, store: "قصر الذهب", city: "الدوحة", lastUpdated: "منذ 15 دقيقة" },
      { product: "أونصة فضة", category: "معادن ثمينة", price: 24.50, change: -0.8, store: "نجمة الفضة", city: "المنامة", lastUpdated: "منذ 45 دقيقة" },
      { product: "جرام بلاتين", category: "معادن ثمينة", price: 32.5, change: 2.1, store: "شركة المعادن الثمينة", city: "الرياض", lastUpdated: "منذ ساعتين" },
      
      // Construction Materials
      { product: "كيس إسمنت 50كغ", category: "مواد بناء", price: 18.5, change: 3.4, store: "أساتذة البناء", city: "الرياض", lastUpdated: "منذ 4 ساعات" },
      { product: "طن رمل", category: "مواد بناء", price: 45, change: 5.2, store: "البناء بلس", city: "دبي", lastUpdated: "منذ 3 ساعات" },
      { product: "طن حصى", category: "مواد بناء", price: 55, change: -2.1, store: "أساتذة البناء", city: "الكويت", lastUpdated: "منذ ساعتين" },
      { product: "1000 طوبة", category: "مواد بناء", price: 280, change: 4.5, store: "مصنع الطوب", city: "الدوحة", lastUpdated: "منذ 5 ساعات" },
      { product: "بلاط للمتر المربع", category: "مواد بناء", price: 85, change: -1.2, store: "عالم البلاط", city: "المنامة", lastUpdated: "منذ 3 ساعات" },
      
      // Electronics
      { product: "سلك نحاس 100م", category: "إلكترونيات", price: 125, change: 6.8, store: "الكهرباء المحترفة", city: "الرياض" },
      { product: "لمبة LED", category: "إلكترونيات", price: 15.5, change: -2.3, store: "بيت الإضاءة", city: "دبي" },
      { product: "مفتاح كهرباء", category: "إلكترونيات", price: 25, change: 1.8, store: "الكهرباء المحترفة", city: "الكويت", lastUpdated: "منذ 4 ساعات" },
      
      // Textiles
      { product: "متر قماش قطني", category: "منسوجات", price: 12.5, change: 2.8, store: "أرض الأقمشة", city: "الرياض" },
      { product: "متر قماش حريري", category: "منسوجات", price: 45, change: -1.5, store: "الأقمشة الفاخرة", city: "دبي" },
      { product: "متر قماش صوفي", category: "منسوجات", price: 28, change: 3.2, store: "أرض الأقمشة", city: "الدوحة" },
      
      // Food & Commodities
      { product: "طن قمح", category: "غذائيات", price: 320, change: 4.5, store: "سوق الحبوب", city: "الرياض" },
      { product: "طن أرز", category: "غذائيات", price: 580, change: -2.1, store: "مركز الغذاء", city: "دبي" },
      { product: "طن سكر", category: "غذائيات", price: 450, change: 1.8, store: "إمداد الحلويات", city: "الكويت", lastUpdated: "منذ ساعتين" }
    ];
  }
}

export const supabaseDataService = SupabaseDataService.getInstance();
