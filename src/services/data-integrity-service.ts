// خدمة ضمان ترابط البيانات بين النطاقات المختلفة
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

interface DataSyncResult {
  success: boolean;
  synced_domains: string[];
  errors: string[];
  timestamp: string;
}

interface CrossDomainTransaction {
  id: string;
  user_id: string;
  transaction_type: 'order' | 'project' | 'payment' | 'inventory';
  source_domain: 'marketplace' | 'erp' | 'projects' | 'pos';
  target_domains: string[];
  data: any;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export class DataIntegrityService {
  private supabase = createClientComponentClient<Database>();
  
  /**
   * ضمان تزامن البيانات عبر جميع النطاقات عند إنشاء طلب
   */
  async syncOrderAcrossDomains(orderData: {
    order_id: string;
    user_id: string;
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
      store_id: string;
    }>;
    project_id?: string;
    total_amount: number;
    payment_method: string;
  }): Promise<DataSyncResult> {
    const syncedDomains: string[] = [];
    const errors: string[] = [];
    
    try {
      // 1. تحديث المخزون في نطاق المتاجر
      try {
        await this.updateInventoryFromOrder(orderData);
        syncedDomains.push('store_inventory');
      } catch (error) {
        errors.push(`Store inventory sync failed: ${error}`);
      }

      // 2. إنشاء قيود محاسبية في نظام ERP
      try {
        await this.createAccountingEntries(orderData);
        syncedDomains.push('erp_accounting');
      } catch (error) {
        errors.push(`ERP accounting sync failed: ${error}`);
      }

      // 3. ربط الطلب بالمشروع إذا كان محدد
      if (orderData.project_id) {
        try {
          await this.linkOrderToProject(orderData.order_id, orderData.project_id);
          syncedDomains.push('project_management');
        } catch (error) {
          errors.push(`Project linking failed: ${error}`);
        }
      }

      // 4. تحديث إحصائيات مقدمي الخدمة
      try {
        await this.updateServiceProviderStats(orderData);
        syncedDomains.push('service_provider_stats');
      } catch (error) {
        errors.push(`Service provider stats sync failed: ${error}`);
      }

      // 5. إنشاء فاتورة في النظام المالي
      try {
        await this.generateInvoice(orderData);
        syncedDomains.push('financial_invoicing');
      } catch (error) {
        errors.push(`Invoice generation failed: ${error}`);
      }

      // 6. تحديث نقاط الولاء للمستخدم
      try {
        await this.updateLoyaltyPoints(orderData.user_id, orderData.total_amount);
        syncedDomains.push('loyalty_system');
      } catch (error) {
        errors.push(`Loyalty points sync failed: ${error}`);
      }

      return {
        success: errors.length === 0,
        synced_domains: syncedDomains,
        errors,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        synced_domains: syncedDomains,
        errors: [`General sync error: ${error}`],
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * تحديث المخزون عند إنشاء طلب
   */
  private async updateInventoryFromOrder(orderData: any): Promise<void> {
    for (const item of orderData.items) {
      // قراءة الكمية الحالية وتحديثها يدويًا
      const { data: prod } = await this.supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', item.product_id)
        .single();

      const newQty = Math.max(0, (prod?.stock_quantity ?? 0) - (item.quantity ?? 0));
      const { error: updErr } = await this.supabase
        .from('products')
        .update({ stock_quantity: newQty, updated_at: new Date().toISOString() })
        .eq('id', item.product_id);
      if (updErr) throw updErr;

      // تسجيل حركة المخزون
      await this.supabase
        .from('inventory_movements')
        .insert({
          product_id: item.product_id,
          movement_type: 'out',
          quantity: item.quantity,
          reference_type: 'order',
          reference_id: orderData.order_id,
          notes: `Order ${orderData.order_id}`,
          created_at: new Date().toISOString()
        });
    }
  }

  /**
   * إنشاء قيود محاسبية في نظام ERP
   */
  private async createAccountingEntries(orderData: any): Promise<void> {
    const entries = [
      // مدين: حسابات القبض
      {
        account_code: '1120',
        account_name: 'حسابات القبض',
        debit_amount: orderData.total_amount,
        credit_amount: 0,
        transaction_type: 'sale',
        reference_id: orderData.order_id,
        description: `بيع بموجب الطلب ${orderData.order_id}`
      },
      // دائن: المبيعات
      {
        account_code: '4010',
        account_name: 'المبيعات',
        debit_amount: 0,
        credit_amount: orderData.total_amount * 0.85, // بدون الضريبة
        transaction_type: 'sale',
        reference_id: orderData.order_id,
        description: `بيع بموجب الطلب ${orderData.order_id}`
      },
      // دائن: ضريبة القيمة المضافة
      {
        account_code: '2140',
        account_name: 'ضريبة القيمة المضافة',
        debit_amount: 0,
        credit_amount: orderData.total_amount * 0.15,
        transaction_type: 'tax',
        reference_id: orderData.order_id,
        description: `ضريبة قيمة مضافة - الطلب ${orderData.order_id}`
      }
    ];

    for (const entry of entries) {
      await this.supabase
        .from('accounting_entries')
        .insert({
          ...entry,
          user_id: orderData.user_id,
          created_at: new Date().toISOString()
        });
    }
  }

  /**
   * ربط الطلب بالمشروع
   */
  private async linkOrderToProject(orderId: string, projectId: string): Promise<void> {
    // تحديث الطلب بمعرف المشروع
    await this.supabase
      .from('orders')
      .update({
        project_id: projectId,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    // إضافة الطلب إلى سجل مشتريات المشروع
    await this.supabase
      .from('project_purchases')
      .insert({
        project_id: projectId,
        order_id: orderId,
        purchase_type: 'material',
        status: 'ordered',
        created_at: new Date().toISOString()
      });

    // تحديث ميزانية المشروع المستخدمة
    const { data: order } = await this.supabase
      .from('orders')
      .select('total_amount')
      .eq('id', orderId)
      .single();

    if (order) {
      // قراءة المبلغ الحالي وتحديثه
      const { data: project } = await this.supabase
        .from('construction_projects')
        .select('spent_cost')
        .eq('id', projectId)
        .single();
      const newSpent = (project?.spent_cost ?? 0) + (order.total_amount ?? 0);
      await this.supabase
        .from('construction_projects')
        .update({ spent_cost: newSpent, updated_at: new Date().toISOString() })
        .eq('id', projectId);
    }
  }

  /**
   * تحديث إحصائيات مقدمي الخدمة
   */
  private async updateServiceProviderStats(orderData: any): Promise<void> {
    for (const item of orderData.items) {
      // الحصول على معلومات المتجر/مقدم الخدمة
      const { data: store } = await this.supabase
        .from('stores')
        .select('user_id, total_sales, total_orders')
        .eq('id', item.store_id)
        .single();

      if (store) {
        const saleDelta = (item.price ?? 0) * (item.quantity ?? 0);

        // تحديث المتجر: قراءة ثم تحديث
        const { data: storeRow } = await this.supabase
          .from('stores')
          .select('total_sales, total_orders')
          .eq('id', item.store_id)
          .single();
        const newStoreTotals = {
          total_sales: (storeRow?.total_sales ?? 0) + saleDelta,
          total_orders: (storeRow?.total_orders ?? 0) + 1,
        };
        await this.supabase
          .from('stores')
          .update({ ...newStoreTotals, updated_at: new Date().toISOString() })
          .eq('id', item.store_id);

        // تحديث مقدم الخدمة
        const { data: sp } = await this.supabase
          .from('service_providers')
          .select('total_revenue, completed_orders')
          .eq('user_id', store.user_id)
          .single();
        if (sp) {
          await this.supabase
            .from('service_providers')
            .update({
              total_revenue: (sp.total_revenue ?? 0) + saleDelta,
              completed_orders: (sp.completed_orders ?? 0) + 1,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', store.user_id);
        }
      }
    }
  }

  /**
   * إنشاء فاتورة في النظام المالي
   */
  private async generateInvoice(orderData: any): Promise<void> {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    // إنشاء الفاتورة الرئيسية
    const { data: invoice, error: invoiceError } = await this.supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        user_id: orderData.user_id,
        order_id: orderData.order_id,
        subtotal: orderData.total_amount * 0.85,
        tax_amount: orderData.total_amount * 0.15,
        total_amount: orderData.total_amount,
        currency: 'SAR',
        status: 'issued',
        payment_method: orderData.payment_method,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 يوم
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // إضافة تفاصيل الفاتورة
    for (const item of orderData.items) {
      await this.supabase
        .from('invoice_items')
        .insert({
          invoice_id: invoice.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          created_at: new Date().toISOString()
        });
    }
  }

  /**
   * تحديث نقاط الولاء للمستخدم
   */
  private async updateLoyaltyPoints(userId: string, totalAmount: number, orderId?: string): Promise<void> {
    // حساب النقاط: 1 نقطة لكل 10 ريال
    const pointsEarned = Math.floor(totalAmount / 10);
    // قراءة القيم الحالية وتحديثها
    const { data: profile } = await this.supabase
      .from('user_profiles')
      .select('loyalty_points, total_spent')
      .eq('user_id', userId)
      .single();
    await this.supabase
      .from('user_profiles')
      .update({
        loyalty_points: (profile?.loyalty_points ?? 0) + pointsEarned,
        total_spent: (profile?.total_spent ?? 0) + (totalAmount ?? 0),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    // تسجيل حركة النقاط
    await this.supabase
      .from('loyalty_transactions')
      .insert({
        user_id: userId,
        transaction_type: 'earn',
        points: pointsEarned,
        reference_type: 'order',
        reference_id: orderId ?? null,
        description: `نقاط من الطلب`,
        created_at: new Date().toISOString()
      });
  }

  /**
   * تزامن بيانات المشروع عبر النطاقات
   */
  async syncProjectAcrossDomains(projectData: {
    project_id: string;
    user_id: string;
    project_name: string;
    budget: number;
    project_type: string;
    status: string;
  }): Promise<DataSyncResult> {
    const syncedDomains: string[] = [];
    const errors: string[] = [];

    try {
      // 1. إنشاء ملف مالي للمشروع في ERP
      try {
        await this.createProjectFinancialProfile(projectData);
        syncedDomains.push('erp_project_accounting');
      } catch (error) {
        errors.push(`Project financial profile creation failed: ${error}`);
      }

      // 2. إعداد تتبع المخزون للمشروع
      try {
        await this.setupProjectInventoryTracking(projectData.project_id);
        syncedDomains.push('inventory_tracking');
      } catch (error) {
        errors.push(`Project inventory tracking setup failed: ${error}`);
      }

      // 3. إنشاء مهام المشروع الأساسية
      try {
        await this.createProjectBaseTasks(projectData);
        syncedDomains.push('project_management');
      } catch (error) {
        errors.push(`Project base tasks creation failed: ${error}`);
      }

      return {
        success: errors.length === 0,
        synced_domains: syncedDomains,
        errors,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        synced_domains: syncedDomains,
        errors: [`General project sync error: ${error}`],
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * إنشاء ملف مالي للمشروع
   */
  private async createProjectFinancialProfile(projectData: any): Promise<void> {
    await this.supabase
      .from('project_financials')
      .insert({
        project_id: projectData.project_id,
        user_id: projectData.user_id,
        budget_allocated: projectData.budget,
        budget_spent: 0,
        budget_remaining: projectData.budget,
        currency: 'SAR',
        status: 'active',
        created_at: new Date().toISOString()
      });
  }

  /**
   * إعداد تتبع المخزون للمشروع
   */
  private async setupProjectInventoryTracking(projectId: string): Promise<void> {
    await this.supabase
      .from('project_inventory')
      .insert({
        project_id: projectId,
        total_materials_ordered: 0,
        total_materials_received: 0,
        total_materials_used: 0,
        status: 'active',
        created_at: new Date().toISOString()
      });
  }

  /**
   * إنشاء مهام المشروع الأساسية
   */
  private async createProjectBaseTasks(projectData: any): Promise<void> {
    const baseTasks = [
      { name: 'التخطيط والتصميم', phase: 'planning', order: 1 },
      { name: 'الحصول على التراخيص', phase: 'permits', order: 2 },
      { name: 'إعداد الموقع', phase: 'site_prep', order: 3 },
      { name: 'الأساسات', phase: 'foundation', order: 4 },
      { name: 'الهيكل الإنشائي', phase: 'structure', order: 5 },
      { name: 'التشطيبات', phase: 'finishing', order: 6 },
      { name: 'التسليم النهائي', phase: 'delivery', order: 7 }
    ];

    for (const task of baseTasks) {
      await this.supabase
        .from('project_tasks')
        .insert({
          project_id: projectData.project_id,
          task_name: task.name,
          phase: task.phase,
          status: 'pending',
          order_sequence: task.order,
          created_at: new Date().toISOString()
        });
    }
  }

  /**
   * التحقق من تكامل البيانات عبر النطاقات
   */
  async validateDataIntegrity(userId: string): Promise<{
    is_consistent: boolean;
    inconsistencies: string[];
    recommendations: string[];
  }> {
    const inconsistencies: string[] = [];
    const recommendations: string[] = [];

    try {
      // 1. التحقق من تطابق إجمالي المبيعات مع الطلبات
      const { data: userOrders } = await this.supabase
        .from('orders')
        .select('total_amount')
        .eq('user_id', userId);

      const { data: userProfile } = await this.supabase
        .from('user_profiles')
        .select('total_spent')
        .eq('user_id', userId)
        .single();

      if (userOrders && userProfile) {
        const ordersTotal = userOrders.reduce((sum, order) => sum + order.total_amount, 0);
        if (Math.abs(ordersTotal - userProfile.total_spent) > 1) { // هامش خطأ 1 ريال
          inconsistencies.push(`تضارب في إجمالي المبلغ المنفق: الطلبات = ${ordersTotal}, الملف الشخصي = ${userProfile.total_spent}`);
          recommendations.push('تحديث إجمالي المبلغ المنفق في الملف الشخصي');
        }
      }

      // 2. التحقق من تطابق ميزانية المشاريع مع المصروفات
      const { data: projects } = await this.supabase
        .from('construction_projects')
        .select('id, estimated_cost, spent_cost')
        .eq('user_id', userId);

      if (projects) {
        for (const project of projects) {
          const { data: projectOrders } = await this.supabase
            .from('orders')
            .select('total_amount')
            .eq('project_id', project.id);

          if (projectOrders) {
            const actualSpent = projectOrders.reduce((sum, order) => sum + order.total_amount, 0);
            if (Math.abs(actualSpent - project.spent_cost) > 1) {
              inconsistencies.push(`تضارب في المبلغ المنفق للمشروع ${project.id}: الطلبات = ${actualSpent}, المشروع = ${project.spent_cost}`);
              recommendations.push(`تحديث المبلغ المنفق للمشروع ${project.id}`);
            }
          }
        }
      }

      // 3. التحقق من المخزون والحركات
      const { data: inventoryMovements } = await this.supabase
        .from('inventory_movements')
        .select('product_id, quantity, movement_type')
        .eq('reference_type', 'order');

      if (inventoryMovements) {
        // تجميع الحركات حسب المنتج
        const movementsByProduct = inventoryMovements.reduce((acc, movement) => {
          if (!acc[movement.product_id]) {
            acc[movement.product_id] = { in: 0, out: 0 };
          }
          const mt = (movement.movement_type === 'in' ? 'in' : 'out') as 'in' | 'out';
          acc[movement.product_id][mt] += movement.quantity as number;
          return acc;
        }, {} as Record<string, { in: number; out: number }>);

        // التحقق من كل منتج
        for (const productId in movementsByProduct) {
          const { data: product } = await this.supabase
            .from('products')
            .select('stock_quantity, name')
            .eq('id', productId)
            .single();

          if (product) {
            const movements = movementsByProduct[productId];
            const calculatedStock = movements.in - movements.out;
            
            if (Math.abs(calculatedStock - product.stock_quantity) > 0) {
              inconsistencies.push(`تضارب في مخزون المنتج ${product.name}: المحسوب = ${calculatedStock}, المسجل = ${product.stock_quantity}`);
              recommendations.push(`تحديث مخزون المنتج ${product.name}`);
            }
          }
        }
      }

      return {
        is_consistent: inconsistencies.length === 0,
        inconsistencies,
        recommendations
      };

    } catch (error) {
      return {
        is_consistent: false,
        inconsistencies: [`خطأ في التحقق من تكامل البيانات: ${error}`],
        recommendations: ['إعادة تشغيل عملية التحقق من تكامل البيانات']
      };
    }
  }

  /**
   * إصلاح التضارب في البيانات
   */
  async fixDataInconsistencies(userId: string): Promise<{
    fixed_issues: string[];
    remaining_issues: string[];
  }> {
    const fixedIssues: string[] = [];
    const remainingIssues: string[] = [];

    try {
      // إصلاح إجمالي المبلغ المنفق
      const { data: userOrders } = await this.supabase
        .from('orders')
        .select('total_amount')
        .eq('user_id', userId);

      if (userOrders) {
        const correctTotal = userOrders.reduce((sum, order) => sum + order.total_amount, 0);
        
        const { error } = await this.supabase
          .from('user_profiles')
          .update({
            total_spent: correctTotal,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) {
          remainingIssues.push(`فشل في إصلاح إجمالي المبلغ المنفق: ${error.message}`);
        } else {
          fixedIssues.push('تم إصلاح إجمالي المبلغ المنفق في الملف الشخصي');
        }
      }

      // إصلاح ميزانية المشاريع
      const { data: projects } = await this.supabase
        .from('construction_projects')
        .select('id')
        .eq('user_id', userId);

      if (projects) {
        for (const project of projects) {
          const { data: projectOrders } = await this.supabase
            .from('orders')
            .select('total_amount')
            .eq('project_id', project.id);

          if (projectOrders) {
            const correctSpent = projectOrders.reduce((sum, order) => sum + order.total_amount, 0);
            
            const { error } = await this.supabase
              .from('construction_projects')
              .update({
                spent_cost: correctSpent,
                updated_at: new Date().toISOString()
              })
              .eq('id', project.id);

            if (error) {
              remainingIssues.push(`فشل في إصلاح ميزانية المشروع ${project.id}: ${error.message}`);
            } else {
              fixedIssues.push(`تم إصلاح ميزانية المشروع ${project.id}`);
            }
          }
        }
      }

      return { fixed_issues: fixedIssues, remaining_issues: remainingIssues };

    } catch (error) {
      return {
        fixed_issues: fixedIssues,
        remaining_issues: [`خطأ عام في إصلاح البيانات: ${error}`]
      };
    }
  }
}

// تصدير المثيل الوحيد للخدمة
export const dataIntegrityService = new DataIntegrityService();
export default dataIntegrityService;
