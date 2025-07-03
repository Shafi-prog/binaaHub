// Project-specific customization types
export interface ProjectOrderSettings {
  id: string;
  project_id: string;
  user_id: string;
  
  // Order Preferences
  preferred_stores: string[]; // Store IDs
  preferred_categories: string[]; // Product categories
  preferred_payment_method: string;
  preferred_delivery_type: string;
  
  // Budget Controls
  budget_limit_enabled: boolean;
  max_order_amount: number;
  require_approval_above: number;
  approval_user_ids: string[];
  
  // Workflow Settings
  auto_approve_orders: boolean;
  require_manager_approval: boolean;
  notification_preferences: {
    order_created: boolean;
    order_approved: boolean;
    order_delivered: boolean;
    budget_exceeded: boolean;
  };
  
  // Product Filtering
  allowed_categories: string[];
  blocked_categories: string[];
  preferred_vendors: string[];
  
  // Template Settings
  default_order_notes: string;
  order_template_id?: string;
  custom_fields: Record<string, any>;
  
  created_at: string;
  updated_at: string;
}

export interface ProjectOrderTemplate {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  description: string;
  
  // Template Configuration
  template_type: 'quick_order' | 'bulk_order' | 'recurring_order' | 'custom';
  project_phase: string; // planning, construction, finishing, etc.
  
  // Pre-defined Items
  template_items: ProjectOrderTemplateItem[];
  
  // Settings
  auto_quantities: boolean; // Auto-calculate quantities based on project size
  quantity_multiplier: number;
  price_adjustment: number; // Percentage adjustment
  
  // Approval Workflow
  requires_approval: boolean;
  approval_workflow: string;
  
  // Usage Tracking
  usage_count: number;
  last_used: string;
  
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectOrderTemplateItem {
  id: string;
  template_id: string;
  product_id: string;
  product_name: string;
  category: string;
  quantity: number;
  unit: string;
  estimated_price: number;
  is_required: boolean;
  notes?: string;
  
  // Dynamic Calculation
  quantity_formula?: string; // e.g., "project_size * 0.5"
  price_formula?: string;
}

export interface ProjectOrderCustomization {
  id: string;
  project_id: string;
  
  // Project-specific Categories
  custom_categories: ProjectCustomCategory[];
  
  // Workflow Rules
  order_rules: ProjectOrderRule[];
  
  // Integration Settings
  integrations: {
    expense_tracking: boolean;
    warranty_management: boolean;
    inventory_tracking: boolean;
    vendor_management: boolean;
  };
  
  created_at: string;
  updated_at: string;
}

export interface ProjectCustomCategory {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  project_phase: string[];
  priority: number;
  color: string;
  icon: string;
  parent_category_id?: string;
  is_active: boolean;
}

export interface ProjectOrderRule {
  id: string;
  name: string;
  description: string;
  condition: string; // JSON condition
  action: string; // JSON action
  priority: number;
  is_active: boolean;
}

// Project Type Configurations
export interface ProjectTypeOrderConfig {
  project_type: string;
  name: string;
  name_ar: string;
  
  // Default Categories for this project type
  default_categories: string[];
  
  // Phase-specific Requirements
  phase_requirements: Record<string, ProjectPhaseRequirement>;
  
  // Default Settings
  default_settings: Partial<ProjectOrderSettings>;
  
  // Template Library
  available_templates: string[];
}

export interface ProjectPhaseRequirement {
  phase: string;
  required_categories: string[];
  recommended_products: string[];
  estimated_budget_percentage: number;
  typical_order_frequency: string;
}

// User Order Preferences (across all projects)
export interface UserOrderPreferences {
  id: string;
  user_id: string;
  
  // Global Preferences
  default_payment_method: string;
  default_delivery_type: string;
  preferred_currency: string;
  
  // Notification Settings
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  
  // UI Preferences
  default_view: 'grid' | 'list';
  products_per_page: number;
  show_prices_with_tax: boolean;
  
  // Quick Access
  favorite_stores: string[];
  recent_categories: string[];
  
  created_at: string;
  updated_at: string;
}

// Order Approval Workflow
export interface OrderApprovalWorkflow {
  id: string;
  project_id: string;
  name: string;
  description: string;
  
  // Workflow Steps
  steps: OrderApprovalStep[];
  
  // Conditions
  trigger_conditions: {
    min_amount: number;
    categories: string[];
    stores: string[];
    user_roles: string[];
  };
  
  // Settings
  is_active: boolean;
  auto_approve_below_amount: number;
  escalation_timeout_hours: number;
  
  created_at: string;
  updated_at: string;
}

export interface OrderApprovalStep {
  step_number: number;
  name: string;
  approver_type: 'user' | 'role' | 'any_manager';
  approver_ids: string[];
  required_approvals: number;
  can_reject: boolean;
  timeout_hours: number;
  escalation_step?: number;
}

// Order Analytics and Insights
export interface ProjectOrderAnalytics {
  project_id: string;
  period: string;
  
  // Order Statistics
  total_orders: number;
  total_amount: number;
  average_order_value: number;
  
  // Category Breakdown
  category_spending: Record<string, number>;
  category_frequency: Record<string, number>;
  
  // Vendor Analysis
  vendor_spending: Record<string, number>;
  vendor_ratings: Record<string, number>;
  
  // Budget Analysis
  budget_utilization: number;
  budget_remaining: number;
  projected_overspend: number;
  
  // Trend Analysis
  monthly_trends: Record<string, number>;
  seasonal_patterns: Record<string, number>;
  
  // Recommendations
  cost_saving_opportunities: CostSavingOpportunity[];
  vendor_recommendations: VendorRecommendation[];
}

export interface CostSavingOpportunity {
  type: 'bulk_discount' | 'alternative_vendor' | 'timing_optimization';
  description: string;
  potential_savings: number;
  action_required: string;
  confidence_score: number;
}

export interface VendorRecommendation {
  vendor_id: string;
  vendor_name: string;
  reason: string;
  potential_savings: number;
  rating_improvement: number;
  delivery_improvement: number;
}
