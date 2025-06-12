import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  ProjectOrderSettings, 
  ProjectOrderTemplate, 
  ProjectOrderCustomization,
  UserOrderPreferences,
  OrderApprovalWorkflow,
  ProjectOrderAnalytics,
  ProjectTypeOrderConfig 
} from '@/types/project-settings';

const supabase = createClientComponentClient();

// Project Order Settings API
export class ProjectOrderSettingsAPI {
  static async getProjectSettings(projectId: string): Promise<ProjectOrderSettings | null> {
    try {
      const { data, error } = await supabase
        .from('project_order_settings')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching project order settings:', error);
      throw error;
    }
  }

  static async createProjectSettings(settings: Omit<ProjectOrderSettings, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectOrderSettings> {
    try {
      const { data, error } = await supabase
        .from('project_order_settings')
        .insert(settings)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating project order settings:', error);
      throw error;
    }
  }

  static async updateProjectSettings(projectId: string, updates: Partial<ProjectOrderSettings>): Promise<ProjectOrderSettings> {
    try {
      const { data, error } = await supabase
        .from('project_order_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('project_id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating project order settings:', error);
      throw error;
    }
  }

  static async deleteProjectSettings(projectId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('project_order_settings')
        .delete()
        .eq('project_id', projectId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting project order settings:', error);
      throw error;
    }
  }
}

// Project Order Templates API
export class ProjectOrderTemplatesAPI {
  static async getProjectTemplates(projectId: string): Promise<ProjectOrderTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('project_order_templates')
        .select(`
          *,
          template_items:project_order_template_items(*)
        `)
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching project templates:', error);
      throw error;
    }
  }

  static async getTemplateById(templateId: string): Promise<ProjectOrderTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('project_order_templates')
        .select(`
          *,
          template_items:project_order_template_items(*)
        `)
        .eq('id', templateId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  }

  static async createTemplate(template: Omit<ProjectOrderTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectOrderTemplate> {
    try {
      const { data, error } = await supabase
        .from('project_order_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  static async updateTemplate(templateId: string, updates: Partial<ProjectOrderTemplate>): Promise<ProjectOrderTemplate> {
    try {
      const { data, error } = await supabase
        .from('project_order_templates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', templateId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  static async incrementTemplateUsage(templateId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_template_usage', {
        template_id: templateId
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing template usage:', error);
      throw error;
    }
  }

  static async deleteTemplate(templateId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('project_order_templates')
        .update({ is_active: false })
        .eq('id', templateId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
}

// User Order Preferences API
export class UserOrderPreferencesAPI {
  static async getUserPreferences(userId: string): Promise<UserOrderPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_order_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  static async createUserPreferences(preferences: Omit<UserOrderPreferences, 'id' | 'created_at' | 'updated_at'>): Promise<UserOrderPreferences> {
    try {
      const { data, error } = await supabase
        .from('user_order_preferences')
        .insert(preferences)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user preferences:', error);
      throw error;
    }
  }

  static async updateUserPreferences(userId: string, updates: Partial<UserOrderPreferences>): Promise<UserOrderPreferences> {
    try {
      const { data, error } = await supabase
        .from('user_order_preferences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }
}

// Order Approval Workflow API
export class OrderApprovalWorkflowAPI {
  static async getProjectWorkflows(projectId: string): Promise<OrderApprovalWorkflow[]> {
    try {
      const { data, error } = await supabase
        .from('order_approval_workflows')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching approval workflows:', error);
      throw error;
    }
  }

  static async createWorkflow(workflow: Omit<OrderApprovalWorkflow, 'id' | 'created_at' | 'updated_at'>): Promise<OrderApprovalWorkflow> {
    try {
      const { data, error } = await supabase
        .from('order_approval_workflows')
        .insert(workflow)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating approval workflow:', error);
      throw error;
    }
  }

  static async updateWorkflow(workflowId: string, updates: Partial<OrderApprovalWorkflow>): Promise<OrderApprovalWorkflow> {
    try {
      const { data, error } = await supabase
        .from('order_approval_workflows')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', workflowId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating approval workflow:', error);
      throw error;
    }
  }
}

// Project Order Analytics API
export class ProjectOrderAnalyticsAPI {
  static async getProjectAnalytics(projectId: string, period: string = '30d'): Promise<ProjectOrderAnalytics> {
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      // Fetch orders data
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          created_at,
          status,
          payment_status,
          order_items (
            id,
            product_id,
            quantity,
            price,
            products (
              category,
              name
            )
          ),
          stores (
            id,
            store_name,
            rating
          )
        `)
        .eq('project_id', projectId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (ordersError) throw ordersError;

      // Process analytics data
      const analytics = this.processOrderAnalytics(orders || [], projectId, period);
      return analytics;
    } catch (error) {
      console.error('Error fetching project analytics:', error);
      throw error;
    }
  }

  private static processOrderAnalytics(orders: any[], projectId: string, period: string): ProjectOrderAnalytics {
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;

    // Category analysis
    const categorySpending: Record<string, number> = {};
    const categoryFrequency: Record<string, number> = {};
    
    orders.forEach(order => {
      order.order_items?.forEach((item: any) => {
        const category = item.products?.category || 'أخرى';
        const itemTotal = item.quantity * item.price;
        
        categorySpending[category] = (categorySpending[category] || 0) + itemTotal;
        categoryFrequency[category] = (categoryFrequency[category] || 0) + 1;
      });
    });

    // Vendor analysis
    const vendorSpending: Record<string, number> = {};
    const vendorRatings: Record<string, number> = {};
    
    orders.forEach(order => {
      if (order.stores) {
        const vendorName = order.stores.store_name;
        vendorSpending[vendorName] = (vendorSpending[vendorName] || 0) + order.total_amount;
        vendorRatings[vendorName] = order.stores.rating || 0;
      }
    });

    // Monthly trends (simplified)
    const monthlyTrends: Record<string, number> = {};
    orders.forEach(order => {
      const month = new Date(order.created_at).toISOString().substring(0, 7);
      monthlyTrends[month] = (monthlyTrends[month] || 0) + order.total_amount;
    });

    return {
      project_id: projectId,
      period,
      total_orders: totalOrders,
      total_amount: totalAmount,
      average_order_value: averageOrderValue,
      category_spending: categorySpending,
      category_frequency: categoryFrequency,
      vendor_spending: vendorSpending,
      vendor_ratings: vendorRatings,
      budget_utilization: 0, // Would need project budget data
      budget_remaining: 0,
      projected_overspend: 0,
      monthly_trends: monthlyTrends,
      seasonal_patterns: {},
      cost_saving_opportunities: [],
      vendor_recommendations: []
    };
  }
}

// Project Type Configuration API
export class ProjectTypeConfigAPI {
  static async getProjectTypeConfig(projectType: string): Promise<ProjectTypeOrderConfig | null> {
    try {
      const { data, error } = await supabase
        .from('project_type_order_configs')
        .select('*')
        .eq('project_type', projectType)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching project type config:', error);
      throw error;
    }
  }

  static async getAllProjectTypeConfigs(): Promise<ProjectTypeOrderConfig[]> {
    try {
      const { data, error } = await supabase
        .from('project_type_order_configs')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching project type configs:', error);
      throw error;
    }
  }
}

// Enhanced Order Creation with Customization
export class EnhancedOrderAPI {
  static async createOrderWithCustomization(
    orderData: any,
    projectSettings?: ProjectOrderSettings,
    template?: ProjectOrderTemplate
  ): Promise<any> {
    try {
      // Apply project-specific customizations
      if (projectSettings) {
        // Apply budget limits
        if (projectSettings.budget_limit_enabled && orderData.total_amount > projectSettings.max_order_amount) {
          throw new Error(`Order amount exceeds project limit of ${projectSettings.max_order_amount}`);
        }

        // Apply preferred settings
        if (projectSettings.preferred_payment_method) {
          orderData.payment_method = projectSettings.preferred_payment_method;
        }
        if (projectSettings.preferred_delivery_type) {
          orderData.delivery_type = projectSettings.preferred_delivery_type;
        }

        // Add default notes
        if (projectSettings.default_order_notes) {
          orderData.notes = `${orderData.notes || ''}\n${projectSettings.default_order_notes}`.trim();
        }
      }

      // Apply template customizations
      if (template) {
        // Apply price adjustments
        if (template.price_adjustment !== 0) {
          orderData.items = orderData.items.map((item: any) => ({
            ...item,
            price: item.price * (1 + template.price_adjustment / 100)
          }));
        }

        // Increment template usage
        await ProjectOrderTemplatesAPI.incrementTemplateUsage(template.id);
      }

      // Check approval requirements
      const requiresApproval = await this.checkApprovalRequirements(orderData, projectSettings);
      
      if (requiresApproval) {
        orderData.status = 'pending_approval';
        orderData.requires_approval = true;
      }

      // Create the order
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      // If requires approval, create approval request
      if (requiresApproval) {
        await this.createApprovalRequest(data.id, projectSettings);
      }

      return data;
    } catch (error) {
      console.error('Error creating customized order:', error);
      throw error;
    }
  }

  private static async checkApprovalRequirements(
    orderData: any, 
    projectSettings?: ProjectOrderSettings
  ): Promise<boolean> {
    if (!projectSettings) return false;

    // Check amount threshold
    if (projectSettings.require_approval_above > 0 && 
        orderData.total_amount > projectSettings.require_approval_above) {
      return true;
    }

    // Check if manual approval is required
    if (projectSettings.require_manager_approval && !projectSettings.auto_approve_orders) {
      return true;
    }

    return false;
  }

  private static async createApprovalRequest(orderId: string, projectSettings?: ProjectOrderSettings): Promise<void> {
    if (!projectSettings?.approval_user_ids?.length) return;

    try {
      const approvalRequest = {
        order_id: orderId,
        project_id: projectSettings.project_id,
        approver_ids: projectSettings.approval_user_ids,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('order_approval_requests')
        .insert(approvalRequest);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating approval request:', error);
      throw error;
    }
  }
}

// Utility Functions
export const ProjectCustomizationUtils = {
  // Get recommended products for project phase
  getRecommendedProductsForPhase: async (projectType: string, phase: string): Promise<any[]> => {
    try {
      const config = await ProjectTypeConfigAPI.getProjectTypeConfig(projectType);
      if (!config?.phase_requirements[phase]) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', config.phase_requirements[phase].recommended_products);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recommended products:', error);
      return [];
    }
  },

  // Calculate project-specific pricing
  calculateProjectPricing: (basePrice: number, projectSettings?: ProjectOrderSettings): number => {
    // Apply any project-specific discounts or markups
    return basePrice;
  },

  // Validate order against project constraints
  validateOrderConstraints: (orderData: any, projectSettings?: ProjectOrderSettings): string[] => {
    const errors: string[] = [];

    if (projectSettings) {
      // Check budget limits
      if (projectSettings.budget_limit_enabled && 
          orderData.total_amount > projectSettings.max_order_amount) {
        errors.push(`Order amount exceeds project limit of ${projectSettings.max_order_amount}`);
      }

      // Check allowed categories
      if (projectSettings.allowed_categories.length > 0) {
        const orderCategories = orderData.items.map((item: any) => item.category);
        const invalidCategories = orderCategories.filter(
          (cat: string) => !projectSettings.allowed_categories.includes(cat)
        );
        if (invalidCategories.length > 0) {
          errors.push(`Order contains restricted categories: ${invalidCategories.join(', ')}`);
        }
      }

      // Check blocked categories
      if (projectSettings.blocked_categories.length > 0) {
        const orderCategories = orderData.items.map((item: any) => item.category);
        const blockedCategories = orderCategories.filter(
          (cat: string) => projectSettings.blocked_categories.includes(cat)
        );
        if (blockedCategories.length > 0) {
          errors.push(`Order contains blocked categories: ${blockedCategories.join(', ')}`);
        }
      }
    }

    return errors;
  }
};
