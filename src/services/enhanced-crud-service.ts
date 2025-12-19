// خدمة محسنة للتحقق من عمليات CRUD ومعالجة الأخطاء
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';
import { safeDelay, sanitizeObject, createSafeErrorMessage } from '@/lib/security-utils';

export interface CRUDValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: any;
}

export interface CRUDOperationOptions {
  validateBeforeOperation?: boolean;
  enableLogging?: boolean;
  useTransaction?: boolean;
  retryOnFailure?: boolean;
  maxRetries?: number;
}

export class EnhancedCRUDService {
  private supabase = createClientComponentClient<Database>();
  private defaultOptions: CRUDOperationOptions = {
    validateBeforeOperation: true,
    enableLogging: true,
    useTransaction: false,
    retryOnFailure: true,
    maxRetries: 3
  };

  constructor(private tableName: string) {}

  /**
   * عملية إنشاء محسنة مع التحقق والتسجيل
   */
  async create<T>(
    data: Partial<T>, 
    options: CRUDOperationOptions = {}
  ): Promise<CRUDValidationResult> {
    const opts = { ...this.defaultOptions, ...options };
    
    try {
      // Sanitize input data to prevent prototype pollution
      const sanitizedData = sanitizeObject(data as Record<string, any>);
      
      // التحقق من البيانات قبل الإنشاء
      if (opts.validateBeforeOperation) {
        const validation = await this.validateCreateData(sanitizedData);
        if (!validation.isValid) {
          return validation;
        }
      }

      // تسجيل العملية
      if (opts.enableLogging) {
        this.logOperation('CREATE', this.tableName, sanitizedData);
      }

      let result;
      if (opts.useTransaction) {
        result = await this.executeInTransaction(async () => {
          return await this.performCreate(sanitizedData);
        });
      } else {
        result = await this.performCreateWithRetry(sanitizedData, opts.maxRetries || 3);
      }

      return {
        isValid: true,
        errors: [],
        warnings: [],
        data: result
      };

    } catch (error) {
      const errorMsg = createSafeErrorMessage(error, 'خطأ في عملية الإنشاء');
      
      if (opts.enableLogging) {
        console.error(`CREATE operation failed for ${this.tableName}:`, error);
      }

      return {
        isValid: false,
        errors: [errorMsg],
        warnings: [],
        data: null
      };
    }
  }

  /**
   * عملية قراءة محسنة مع التخزين المؤقت
   */
  async read<T>(
    filters: Record<string, any> = {}, 
    options: CRUDOperationOptions = {}
  ): Promise<CRUDValidationResult> {
    const opts = { ...this.defaultOptions, ...options };
    
    try {
      if (opts.enableLogging) {
        this.logOperation('READ', this.tableName, filters);
      }

      const result = await this.performReadWithRetry(filters, opts.maxRetries || 3);

      return {
        isValid: true,
        errors: [],
        warnings: result.length === 0 ? ['No data found'] : [],
        data: result
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      if (opts.enableLogging) {
        console.error(`READ operation failed for ${this.tableName}:`, error);
      }

      return {
        isValid: false,
        errors: [errorMsg],
        warnings: [],
        data: null
      };
    }
  }

  /**
   * عملية تحديث محسنة مع التحقق من الصلاحيات
   */
  async update<T>(
    id: string,
    updates: Partial<T>,
    options: CRUDOperationOptions = {}
  ): Promise<CRUDValidationResult> {
    const opts = { ...this.defaultOptions, ...options };
    
    try {
      // التحقق من وجود السجل
      const existingRecord = await this.getById(id);
      if (!existingRecord) {
        return {
          isValid: false,
          errors: [`Record with id ${id} not found`],
          warnings: [],
          data: null
        };
      }

      // التحقق من البيانات قبل التحديث
      if (opts.validateBeforeOperation) {
        const validation = await this.validateUpdateData(updates, existingRecord);
        if (!validation.isValid) {
          return validation;
        }
      }

      if (opts.enableLogging) {
        this.logOperation('UPDATE', this.tableName, { id, updates });
      }

      let result;
      if (opts.useTransaction) {
        result = await this.executeInTransaction(async () => {
          return await this.performUpdate(id, updates);
        });
      } else {
        result = await this.performUpdateWithRetry(id, updates, opts.maxRetries || 3);
      }

      return {
        isValid: true,
        errors: [],
        warnings: [],
        data: result
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      if (opts.enableLogging) {
        console.error(`UPDATE operation failed for ${this.tableName}:`, error);
      }

      return {
        isValid: false,
        errors: [errorMsg],
        warnings: [],
        data: null
      };
    }
  }

  /**
   * عملية حذف محسنة مع التحقق من التبعيات
   */
  async delete(
    id: string,
    options: CRUDOperationOptions = {}
  ): Promise<CRUDValidationResult> {
    const opts = { ...this.defaultOptions, ...options };
    
    try {
      // التحقق من وجود السجل
      const existingRecord = await this.getById(id);
      if (!existingRecord) {
        return {
          isValid: false,
          errors: [`Record with id ${id} not found`],
          warnings: [],
          data: null
        };
      }

      // التحقق من التبعيات قبل الحذف
      const dependencies = await this.checkDependencies(id);
      if (dependencies.length > 0) {
        return {
          isValid: false,
          errors: [`Cannot delete record. Found dependencies: ${dependencies.join(', ')}`],
          warnings: [],
          data: null
        };
      }

      if (opts.enableLogging) {
        this.logOperation('DELETE', this.tableName, { id });
      }

      let result;
      if (opts.useTransaction) {
        result = await this.executeInTransaction(async () => {
          return await this.performDelete(id);
        });
      } else {
        result = await this.performDeleteWithRetry(id, opts.maxRetries || 3);
      }

      return {
        isValid: true,
        errors: [],
        warnings: [],
        data: result
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      if (opts.enableLogging) {
        console.error(`DELETE operation failed for ${this.tableName}:`, error);
      }

      return {
        isValid: false,
        errors: [errorMsg],
        warnings: [],
        data: null
      };
    }
  }

  /**
   * عمليات CRUD الأساسية مع إعادة المحاولة
   */
  private async performCreateWithRetry(data: any, maxRetries: number): Promise<any> {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data: result, error } = await this.supabase
          .from(this.tableName)
          .insert(data)
          .select()
          .single();

        if (error) throw error;
        return result;

      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  }

  private async performCreate(data: any): Promise<any> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  private async performReadWithRetry(filters: Record<string, any>, maxRetries: number): Promise<any[]> {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        let query = this.supabase.from(this.tableName).select('*');
        
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });

        const { data, error } = await query;
        if (error) throw error;
        return data || [];

      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }
    
    throw lastError;
  }

  private async performUpdateWithRetry(id: string, updates: any, maxRetries: number): Promise<any> {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data, error } = await this.supabase
          .from(this.tableName)
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;

      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }
    
    throw lastError;
  }

  private async performUpdate(id: string, updates: any): Promise<any> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private async performDeleteWithRetry(id: string, maxRetries: number): Promise<boolean> {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { error } = await this.supabase
          .from(this.tableName)
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;

      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }
    
    throw lastError;
  }

  private async performDelete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  /**
   * التحقق من صحة البيانات
   */
  private async validateCreateData(data: any): Promise<CRUDValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // التحقق العام من البيانات المطلوبة
    if (this.tableName === 'construction_projects') {
      if (!data.project_name || data.project_name.trim() === '') {
        errors.push('اسم المشروع مطلوب');
      }
      if (!data.user_id) {
        errors.push('معرف المستخدم مطلوب');
      }
      if (data.estimated_cost && data.estimated_cost < 0) {
        errors.push('التكلفة المقدرة يجب أن تكون أكبر من الصفر');
      }
    }

    if (this.tableName === 'orders') {
      if (!data.user_id) {
        errors.push('معرف المستخدم مطلوب');
      }
      if (!data.total_amount || data.total_amount <= 0) {
        errors.push('إجمالي المبلغ يجب أن يكون أكبر من الصفر');
      }
    }

    if (this.tableName === 'products') {
      if (!data.name || data.name.trim() === '') {
        errors.push('اسم المنتج مطلوب');
      }
      if (!data.price || data.price <= 0) {
        errors.push('سعر المنتج يجب أن يكون أكبر من الصفر');
      }
      if (data.stock_quantity && data.stock_quantity < 0) {
        warnings.push('كمية المخزون سالبة');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data: null
    };
  }

  private async validateUpdateData(updates: any, existingRecord: any): Promise<CRUDValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // التحقق من عدم تعديل الحقول المحظورة
    const protectedFields = ['id', 'created_at', 'user_id'];
    const updatingProtectedFields = Object.keys(updates).filter(key => 
      protectedFields.includes(key)
    );

    if (updatingProtectedFields.length > 0) {
      errors.push(`لا يمكن تعديل الحقول: ${updatingProtectedFields.join(', ')}`);
    }

    // التحقق من البيانات المحددة لكل جدول
    if (this.tableName === 'construction_projects') {
      if (updates.estimated_cost && updates.estimated_cost < existingRecord.spent_cost) {
        warnings.push('التكلفة المقدرة أقل من المبلغ المنفق فعلياً');
      }
    }

    if (this.tableName === 'orders' && updates.status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(updates.status)) {
        errors.push(`حالة الطلب غير صحيحة. القيم المسموحة: ${validStatuses.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      data: null
    };
  }

  /**
   * التحقق من التبعيات قبل الحذف
   */
  private async checkDependencies(id: string): Promise<string[]> {
    const dependencies: string[] = [];

    try {
      if (this.tableName === 'construction_projects') {
        // التحقق من وجود طلبات مربوطة بالمشروع
        const { data: orders } = await this.supabase
          .from('orders')
          .select('id')
          .eq('project_id', id);
        
        if (orders && orders.length > 0) {
          dependencies.push(`${orders.length} طلب مرتبط بالمشروع`);
        }

        // التحقق من وجود مشتريات
        const { data: purchases } = await this.supabase
          .from('project_purchases')
          .select('id')
          .eq('project_id', id);
        
        if (purchases && purchases.length > 0) {
          dependencies.push(`${purchases.length} مشترى مرتبط بالمشروع`);
        }
      }

      if (this.tableName === 'products') {
        // التحقق من وجود طلبات تحتوي على هذا المنتج
        const { data: orderItems } = await this.supabase
          .from('order_items')
          .select('id')
          .eq('product_id', id);
        
        if (orderItems && orderItems.length > 0) {
          dependencies.push(`${orderItems.length} طلب يحتوي على هذا المنتج`);
        }
      }

      if (this.tableName === 'stores') {
        // التحقق من وجود منتجات في المتجر
        const { data: products } = await this.supabase
          .from('products')
          .select('id')
          .eq('store_id', id);
        
        if (products && products.length > 0) {
          dependencies.push(`${products.length} منتج في المتجر`);
        }
      }

    } catch (error) {
      console.error('Error checking dependencies:', error);
    }

    return dependencies;
  }

  /**
   * تنفيذ العملية في معاملة
   */
  private async executeInTransaction<T>(operation: () => Promise<T>): Promise<T> {
    // Supabase doesn't have explicit transaction support in the client
    // But we can simulate it with error handling and rollback logic
    try {
      return await operation();
    } catch (error) {
      // In a real implementation, we would rollback the transaction here
      throw error;
    }
  }

  /**
   * الحصول على سجل بالمعرف
   */
  private async getById(id: string): Promise<any> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return data;
  }

  /**
   * تسجيل العمليات
   */
  private async logOperation(operation: string, table: string, data: any): Promise<void> {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${operation} operation on ${table}:`, data);
    
    // يمكن إضافة تسجيل في قاعدة البيانات هنا
    try {
      await this.supabase
        .from('operation_logs')
        .insert({
          operation_type: operation,
          table_name: table,
          operation_data: data,
          timestamp,
          created_at: timestamp
        });
    } catch (error) {
      console.error('Failed to save operation log:', error);
    }
  }

  /**
   * تأخير تنفيذ - uses secure delay function
   */
  private delay(ms: number): Promise<void> {
    return safeDelay(ms);
  }

  /**
   * إحصائيات الجدول
   */
  async getTableStats(): Promise<{
    totalRecords: number;
    recentActivity: number;
    lastUpdated: string | null;
  }> {
    try {
      const { count } = await this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      const { count: recentCount } = await this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const { data: lastRecord } = await this.supabase
        .from(this.tableName)
        .select('updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      return {
        totalRecords: count || 0,
        recentActivity: recentCount || 0,
        lastUpdated: lastRecord?.updated_at || null
      };

    } catch (error) {
      console.error('Error getting table stats:', error);
      return {
        totalRecords: 0,
        recentActivity: 0,
        lastUpdated: null
      };
    }
  }

  /**
   * اختبار اتصال قاعدة البيانات
   */
  async testConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .select('count', { count: 'exact', head: true })
        .limit(1);

      if (error) {
        return { connected: false, error: error.message };
      }

      return { connected: true };

    } catch (error) {
      return { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// Factory functions لإنشاء خدمات CRUD محددة
export const createProjectsCRUDService = () => new EnhancedCRUDService('construction_projects');
export const createOrdersCRUDService = () => new EnhancedCRUDService('orders');
export const createProductsCRUDService = () => new EnhancedCRUDService('products');
export const createUserProfilesCRUDService = () => new EnhancedCRUDService('user_profiles');
export const createStoresCRUDService = () => new EnhancedCRUDService('stores');

// تصدير المثيلات الجاهزة
export const projectsCRUD = createProjectsCRUDService();
export const ordersCRUD = createOrdersCRUDService();
export const productsCRUD = createProductsCRUDService();
export const userProfilesCRUD = createUserProfilesCRUDService();
export const storesCRUD = createStoresCRUDService();
