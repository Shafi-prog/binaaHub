import { Entity, PrimaryKey, Property, OneToMany, ManyToOne, Collection, Enum } from '@mikro-orm/core';
import { v4 } from 'uuid';

// Brand registry status
export enum BrandRegistryStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled'
}

// Brand protection level
export enum BrandProtectionLevel {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

// Intellectual property types
export enum IPType {
  TRADEMARK = 'trademark',
  COPYRIGHT = 'copyright',
  PATENT = 'patent',
  DESIGN_PATENT = 'design_patent',
  TRADE_DRESS = 'trade_dress'
}

// Verification document types
export enum DocumentType {
  TRADEMARK_CERTIFICATE = 'trademark_certificate',
  COPYRIGHT_CERTIFICATE = 'copyright_certificate',
  PATENT_CERTIFICATE = 'patent_certificate',
  BUSINESS_LICENSE = 'business_license',
  BRAND_AUTHORIZATION = 'brand_authorization',
  DISTRIBUTOR_AGREEMENT = 'distributor_agreement',
  GOVERNMENT_ID = 'government_id',
  UTILITY_BILL = 'utility_bill'
}

@Entity()
export class BrandRegistry {
  @PrimaryKey()
  id: string = v4();

  @Property()
  vendor_id: string;

  @Property()
  brand_name: string;

  @Property({ unique: true })
  brand_code: string; // Unique brand identifier

  @Enum(() => BrandRegistryStatus)
  status: BrandRegistryStatus = BrandRegistryStatus.PENDING;

  @Enum(() => BrandProtectionLevel)
  protection_level: BrandProtectionLevel = BrandProtectionLevel.BASIC;

  // Brand information
  @Property({ type: 'text', nullable: true })
  brand_description?: string;

  @Property({ nullable: true })
  website_url?: string;

  @Property({ nullable: true })
  logo_url?: string;

  @Property({ type: 'json', default: '[]' })
  product_categories: string[] = [];

  @Property({ type: 'json', default: '[]' })
  target_markets: string[] = [];

  @Property({ type: 'json', default: '[]' })
  brand_keywords: string[] = [];

  // Intellectual property information
  @Property({ type: 'json', default: '[]' })
  intellectual_property: {
    type: IPType;
    registration_number: string;
    registration_date: string;
    expiration_date?: string;
    jurisdiction: string;
    description: string;
    document_url?: string;
    verified: boolean;
  }[] = [];

  // Contact information
  @Property()
  contact_person_name: string;

  @Property()
  contact_email: string;

  @Property({ nullable: true })
  contact_phone?: string;

  @Property({ nullable: true })
  contact_address?: string;

  // Legal entity information
  @Property()
  legal_entity_name: string;

  @Property({ nullable: true })
  legal_entity_type?: string; // Corporation, LLC, Partnership, etc.

  @Property({ nullable: true })
  registration_country?: string;

  @Property({ nullable: true })
  tax_id?: string;

  @Property({ nullable: true })
  business_license_number?: string;

  // Verification documents
  @Property({ type: 'json', default: '[]' })
  verification_documents: {
    type: DocumentType;
    filename: string;
    url: string;
    upload_date: string;
    verified: boolean;
    verification_date?: string;
    verified_by?: string;
    notes?: string;
  }[] = [];

  // Brand protection settings
  @Property({ type: 'json', default: '{}' })
  protection_settings: {
    auto_detect_infringement?: boolean;
    monitor_unauthorized_sellers?: boolean;
    block_counterfeit_listings?: boolean;
    protect_brand_keywords?: boolean;
    enable_proactive_monitoring?: boolean;
    scan_external_platforms?: boolean;
  } = {};

  // Authorized sellers/distributors
  @Property({ type: 'json', default: '[]' })
  authorized_sellers: {
    vendor_id: string;
    seller_name: string;
    authorization_type: 'reseller' | 'distributor' | 'affiliate';
    authorization_date: string;
    expiration_date?: string;
    territories?: string[];
    product_lines?: string[];
    document_url?: string;
    active: boolean;
  }[] = [];

  // Brand performance metrics
  @Property({ type: 'json', default: '{}' })
  performance_metrics: {
    total_products?: number;
    total_sales?: number;
    customer_rating?: number;
    review_count?: number;
    brand_page_views?: number;
    search_ranking?: number;
    protection_alerts?: number;
    resolved_infringements?: number;
  } = {};

  // Review and approval information
  @Property({ nullable: true })
  submitted_at?: Date;

  @Property({ nullable: true })
  reviewed_at?: Date;

  @Property({ nullable: true })
  approved_at?: Date;

  @Property({ nullable: true })
  rejected_at?: Date;

  @Property({ nullable: true })
  reviewer_id?: string;

  @Property({ type: 'text', nullable: true })
  review_notes?: string;

  @Property({ type: 'text', nullable: true })
  rejection_reason?: string;

  // Compliance and verification
  @Property({ default: false })
  trademark_verified: boolean = false;

  @Property({ default: false })
  business_verified: boolean = false;

  @Property({ default: false })
  identity_verified: boolean = false;

  @Property({ default: false })
  address_verified: boolean = false;

  @Property({ nullable: true })
  verification_score?: number; // 0-100 score

  // Renewal and subscription
  @Property({ nullable: true })
  subscription_start_date?: Date;

  @Property({ nullable: true })
  subscription_end_date?: Date;

  @Property({ default: false })
  auto_renewal: boolean = false;

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  annual_fee?: number;

  @Property({ nullable: true })
  last_payment_date?: Date;

  @Property({ nullable: true })
  next_payment_date?: Date;

  // Metadata
  @Property({ type: 'json', default: '{}' })
  metadata: Record<string, any> = {};

  @Property({ type: 'text', nullable: true })
  notes?: string;

  @Property()
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date();

  @Property({ nullable: true })
  created_by?: string;

  @Property({ nullable: true })
  updated_by?: string;

  // Relationships
  @OneToMany(() => BrandProtectionAlert, (alert) => alert.brand_registry)
  protection_alerts = new Collection<BrandProtectionAlert>(this);

  @OneToMany(() => BrandInfringementCase, (case_) => case_.brand_registry)
  infringement_cases = new Collection<BrandInfringementCase>(this);

  @OneToMany(() => BrandStorefront, (storefront) => storefront.brand_registry)
  storefronts = new Collection<BrandStorefront>(this);

  // Computed properties
  get is_verified(): boolean {
    return this.trademark_verified && this.business_verified && this.identity_verified;
  }

  get days_since_submission(): number {
    if (!this.submitted_at) return 0;
    return Math.floor((new Date().getTime() - this.submitted_at.getTime()) / (1000 * 60 * 60 * 24));
  }

  get subscription_days_remaining(): number {
    if (!this.subscription_end_date) return 0;
    const diff = this.subscription_end_date.getTime() - new Date().getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  get requires_renewal(): boolean {
    return this.subscription_days_remaining <= 30;
  }

  // Helper methods
  addIntellectualProperty(ip: {
    type: IPType;
    registration_number: string;
    registration_date: string;
    expiration_date?: string;
    jurisdiction: string;
    description: string;
    document_url?: string;
  }): void {
    this.intellectual_property.push({
      ...ip,
      verified: false,
    });
  }

  addVerificationDocument(doc: {
    type: DocumentType;
    filename: string;
    url: string;
  }): void {
    this.verification_documents.push({
      ...doc,
      upload_date: new Date().toISOString(),
      verified: false,
    });
  }

  addAuthorizedSeller(seller: {
    vendor_id: string;
    seller_name: string;
    authorization_type: 'reseller' | 'distributor' | 'affiliate';
    expiration_date?: string;
    territories?: string[];
    product_lines?: string[];
    document_url?: string;
  }): void {
    this.authorized_sellers.push({
      ...seller,
      authorization_date: new Date().toISOString(),
      active: true,
    });
  }

  updateStatus(
    status: BrandRegistryStatus, 
    reviewerId?: string, 
    notes?: string
  ): void {
    this.status = status;
    this.reviewer_id = reviewerId;
    this.review_notes = notes;
    this.reviewed_at = new Date();

    switch (status) {
      case BrandRegistryStatus.APPROVED:
        this.approved_at = new Date();
        break;
      case BrandRegistryStatus.REJECTED:
        this.rejected_at = new Date();
        this.rejection_reason = notes;
        break;
    }
  }

  calculateVerificationScore(): number {
    let score = 0;
    
    // Basic information (20 points)
    if (this.brand_name) score += 5;
    if (this.brand_description) score += 5;
    if (this.website_url) score += 5;
    if (this.logo_url) score += 5;

    // Intellectual property (30 points)
    if (this.intellectual_property.length > 0) score += 15;
    if (this.intellectual_property.some(ip => ip.verified)) score += 15;

    // Verification documents (30 points)
    if (this.verification_documents.length >= 2) score += 10;
    if (this.verification_documents.some(doc => doc.verified)) score += 20;

    // Verification status (20 points)
    if (this.trademark_verified) score += 8;
    if (this.business_verified) score += 6;
    if (this.identity_verified) score += 3;
    if (this.address_verified) score += 3;

    this.verification_score = Math.min(100, score);
    return this.verification_score;
  }
}

// Brand protection alerts
export enum AlertType {
  UNAUTHORIZED_SELLER = 'unauthorized_seller',
  COUNTERFEIT_PRODUCT = 'counterfeit_product',
  TRADEMARK_INFRINGEMENT = 'trademark_infringement',
  COPYRIGHT_VIOLATION = 'copyright_violation',
  BRAND_IMPERSONATION = 'brand_impersonation',
  UNAUTHORIZED_KEYWORDS = 'unauthorized_keywords',
  POLICY_VIOLATION = 'policy_violation'
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum AlertStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
  ESCALATED = 'escalated'
}

@Entity()
export class BrandProtectionAlert {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => BrandRegistry)
  brand_registry: BrandRegistry;

  @Enum(() => AlertType)
  alert_type: AlertType;

  @Enum(() => AlertSeverity)
  severity: AlertSeverity;

  @Enum(() => AlertStatus)
  status: AlertStatus = AlertStatus.OPEN;

  @Property()
  title: string;

  @Property({ type: 'text' })
  description: string;

  // Infringing content details
  @Property({ nullable: true })
  infringing_url?: string;

  @Property({ nullable: true })
  infringing_seller_id?: string;

  @Property({ nullable: true })
  infringing_product_id?: string;

  @Property({ nullable: true })
  infringing_listing_title?: string;

  @Property({ type: 'json', nullable: true })
  infringing_images?: string[];

  @Property({ type: 'text', nullable: true })
  infringing_description?: string;

  // Evidence and documentation
  @Property({ type: 'json', default: '[]' })
  evidence_urls: string[] = [];

  @Property({ type: 'json', default: '[]' })
  screenshot_urls: string[] = [];

  @Property({ type: 'text', nullable: true })
  evidence_notes?: string;

  // Detection information
  @Property()
  detected_at: Date = new Date();

  @Property({ nullable: true })
  detection_method?: string; // 'automated', 'manual_report', 'third_party'

  @Property({ nullable: true })
  detection_confidence?: number; // 0-100 confidence score

  @Property({ type: 'json', default: '{}' })
  detection_metadata: Record<string, any> = {};

  // Resolution tracking
  @Property({ nullable: true })
  assigned_to?: string;

  @Property({ nullable: true })
  assigned_at?: Date;

  @Property({ nullable: true })
  resolved_at?: Date;

  @Property({ nullable: true })
  resolution_method?: string;

  @Property({ type: 'text', nullable: true })
  resolution_notes?: string;

  @Property({ nullable: true })
  escalated_at?: Date;

  @Property({ nullable: true })
  escalated_to?: string;

  // Impact assessment
  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimated_impact_revenue?: number;

  @Property({ type: 'integer', nullable: true })
  estimated_impact_units?: number;

  @Property({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  brand_damage_score?: number;

  // Follow-up actions
  @Property({ type: 'json', default: '[]' })
  actions_taken: {
    action: string;
    taken_at: string;
    taken_by: string;
    result: string;
    notes?: string;
  }[] = [];

  @Property({ default: false })
  requires_followup: boolean = false;

  @Property({ nullable: true })
  followup_date?: Date;

  @Property({ type: 'json', default: '{}' })
  metadata: Record<string, any> = {};

  @Property()
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date();

  // Helper methods
  addAction(action: {
    action: string;
    taken_by: string;
    result: string;
    notes?: string;
  }): void {
    this.actions_taken.push({
      ...action,
      taken_at: new Date().toISOString(),
    });
  }

  updateStatus(status: AlertStatus, userId?: string): void {
    this.status = status;
    
    switch (status) {
      case AlertStatus.IN_PROGRESS:
        this.assigned_to = userId;
        this.assigned_at = new Date();
        break;
      case AlertStatus.RESOLVED:
        this.resolved_at = new Date();
        break;
      case AlertStatus.ESCALATED:
        this.escalated_at = new Date();
        this.escalated_to = userId;
        break;
    }
  }

  calculateSeverity(): AlertSeverity {
    let score = 0;

    // Base score by alert type
    switch (this.alert_type) {
      case AlertType.COUNTERFEIT_PRODUCT:
        score += 40;
        break;
      case AlertType.TRADEMARK_INFRINGEMENT:
        score += 35;
        break;
      case AlertType.BRAND_IMPERSONATION:
        score += 30;
        break;
      case AlertType.UNAUTHORIZED_SELLER:
        score += 25;
        break;
      case AlertType.COPYRIGHT_VIOLATION:
        score += 20;
        break;
      case AlertType.UNAUTHORIZED_KEYWORDS:
        score += 15;
        break;
      case AlertType.POLICY_VIOLATION:
        score += 10;
        break;
    }

    // Add impact factors
    if (this.estimated_impact_revenue && this.estimated_impact_revenue > 1000) score += 20;
    if (this.detection_confidence && this.detection_confidence > 80) score += 15;
    if (this.brand_damage_score && this.brand_damage_score > 7) score += 15;

    // Determine severity
    if (score >= 70) return AlertSeverity.CRITICAL;
    if (score >= 50) return AlertSeverity.HIGH;
    if (score >= 30) return AlertSeverity.MEDIUM;
    return AlertSeverity.LOW;
  }
}

// Brand infringement cases
export enum CaseStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  EVIDENCE_GATHERING = 'evidence_gathering',
  LEGAL_REVIEW = 'legal_review',
  TAKEDOWN_REQUESTED = 'takedown_requested',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ESCALATED_TO_LEGAL = 'escalated_to_legal'
}

export enum CaseType {
  TRADEMARK_INFRINGEMENT = 'trademark_infringement',
  COPYRIGHT_VIOLATION = 'copyright_violation',
  COUNTERFEIT_GOODS = 'counterfeit_goods',
  UNAUTHORIZED_RESALE = 'unauthorized_resale',
  BRAND_IMPERSONATION = 'brand_impersonation',
  POLICY_VIOLATION = 'policy_violation'
}

@Entity()
export class BrandInfringementCase {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => BrandRegistry)
  brand_registry: BrandRegistry;

  @Property()
  case_number: string; // Unique case identifier

  @Enum(() => CaseType)
  case_type: CaseType;

  @Enum(() => CaseStatus)
  status: CaseStatus = CaseStatus.OPEN;

  @Property()
  title: string;

  @Property({ type: 'text' })
  description: string;

  // Infringing party information
  @Property({ nullable: true })
  infringing_party_name?: string;

  @Property({ nullable: true })
  infringing_party_contact?: string;

  @Property({ nullable: true })
  infringing_platform?: string;

  @Property({ type: 'json', default: '[]' })
  infringing_urls: string[] = [];

  // Legal basis
  @Property({ type: 'json', default: '[]' })
  legal_basis: {
    ip_type: IPType;
    registration_number: string;
    jurisdiction: string;
    description: string;
  }[] = [];

  // Evidence collection
  @Property({ type: 'json', default: '[]' })
  evidence: {
    type: 'screenshot' | 'document' | 'correspondence' | 'purchase_proof' | 'other';
    filename: string;
    url: string;
    description: string;
    collected_at: string;
    collected_by: string;
  }[] = [];

  // Case timeline and actions
  @Property({ type: 'json', default: '[]' })
  timeline: {
    date: string;
    action: string;
    description: string;
    performed_by: string;
    documents?: string[];
  }[] = [];

  // Financial impact
  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimated_damages?: number;

  @Property({ type: 'integer', nullable: true })
  lost_sales_units?: number;

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  legal_costs?: number;

  // Resolution details
  @Property({ nullable: true })
  resolution_date?: Date;

  @Property({ nullable: true })
  resolution_method?: string; // 'takedown', 'settlement', 'legal_action', 'dismissed'

  @Property({ type: 'text', nullable: true })
  resolution_summary?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  settlement_amount?: number;

  // Case management
  @Property({ nullable: true })
  assigned_attorney?: string;

  @Property({ nullable: true })
  assigned_investigator?: string;

  @Property({ nullable: true })
  priority_level?: number; // 1-5 priority scale

  @Property({ nullable: true })
  due_date?: Date;

  @Property({ type: 'json', default: '{}' })
  metadata: Record<string, any> = {};

  @Property()
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date();

  @Property({ nullable: true })
  created_by?: string;

  // Helper methods
  addEvidence(evidence: {
    type: 'screenshot' | 'document' | 'correspondence' | 'purchase_proof' | 'other';
    filename: string;
    url: string;
    description: string;
    collected_by: string;
  }): void {
    this.evidence.push({
      ...evidence,
      collected_at: new Date().toISOString(),
    });
  }

  addTimelineEntry(entry: {
    action: string;
    description: string;
    performed_by: string;
    documents?: string[];
  }): void {
    this.timeline.push({
      ...entry,
      date: new Date().toISOString(),
    });
  }

  updateStatus(status: CaseStatus, userId?: string): void {
    this.status = status;
    
    if (status === CaseStatus.RESOLVED || status === CaseStatus.CLOSED) {
      this.resolution_date = new Date();
    }

    this.addTimelineEntry({
      action: `Status changed to ${status}`,
      description: `Case status updated`,
      performed_by: userId || 'system',
    });
  }
}

// Brand custom storefronts
export enum StorefrontStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

@Entity()
export class BrandStorefront {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => BrandRegistry)
  brand_registry: BrandRegistry;

  @Property()
  storefront_name: string;

  @Property({ unique: true })
  storefront_url_slug: string; // e.g., 'apple-store'

  @Enum(() => StorefrontStatus)
  status: StorefrontStatus = StorefrontStatus.DRAFT;

  // Storefront design
  @Property({ type: 'json', default: '{}' })
  design_config: {
    header_banner_url?: string;
    logo_url?: string;
    color_scheme?: {
      primary_color?: string;
      secondary_color?: string;
      accent_color?: string;
      text_color?: string;
      background_color?: string;
    };
    typography?: {
      font_family?: string;
      heading_font?: string;
      body_font?: string;
    };
    layout?: {
      sections?: string[];
      featured_categories?: string[];
      featured_products?: string[];
    };
  } = {};

  // Content sections
  @Property({ type: 'json', default: '[]' })
  content_sections: {
    type: 'hero' | 'about' | 'products' | 'testimonials' | 'gallery' | 'contact' | 'custom';
    title?: string;
    subtitle?: string;
    content?: string;
    image_url?: string;
    video_url?: string;
    cta_text?: string;
    cta_url?: string;
    order: number;
    visible: boolean;
  }[] = [];

  // SEO settings
  @Property({ nullable: true })
  meta_title?: string;

  @Property({ type: 'text', nullable: true })
  meta_description?: string;

  @Property({ type: 'json', default: '[]' })
  meta_keywords: string[] = [];

  @Property({ nullable: true })
  canonical_url?: string;

  // Analytics and performance
  @Property({ type: 'json', default: '{}' })
  analytics: {
    page_views?: number;
    unique_visitors?: number;
    conversion_rate?: number;
    average_session_duration?: number;
    bounce_rate?: number;
    top_products?: string[];
    traffic_sources?: Record<string, number>;
  } = {};

  // Custom domain settings
  @Property({ nullable: true })
  custom_domain?: string;

  @Property({ default: false })
  ssl_enabled: boolean = false;

  @Property({ nullable: true })
  ssl_certificate_url?: string;

  // Social media integration
  @Property({ type: 'json', default: '{}' })
  social_media: {
    facebook_url?: string;
    instagram_url?: string;
    twitter_url?: string;
    youtube_url?: string;
    linkedin_url?: string;
    tiktok_url?: string;
  } = {};

  @Property({ type: 'json', default: '{}' })
  metadata: Record<string, any> = {};

  @Property()
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date();

  @Property({ nullable: true })
  published_at?: Date;

  @Property({ nullable: true })
  last_updated_by?: string;

  // Helper methods
  addContentSection(section: {
    type: 'hero' | 'about' | 'products' | 'testimonials' | 'gallery' | 'contact' | 'custom';
    title?: string;
    subtitle?: string;
    content?: string;
    image_url?: string;
    video_url?: string;
    cta_text?: string;
    cta_url?: string;
    visible?: boolean;
  }): void {
    const order = this.content_sections.length + 1;
    this.content_sections.push({
      ...section,
      order,
      visible: section.visible !== false,
    });
  }

  reorderContentSections(sectionOrders: { id: number; order: number }[]): void {
    sectionOrders.forEach(({ id, order }) => {
      if (this.content_sections[id]) {
        this.content_sections[id].order = order;
      }
    });
    
    this.content_sections.sort((a, b) => a.order - b.order);
  }

  updateAnalytics(data: {
    page_views?: number;
    unique_visitors?: number;
    conversion_rate?: number;
    average_session_duration?: number;
    bounce_rate?: number;
  }): void {
    this.analytics = { ...this.analytics, ...data };
  }

  publish(userId?: string): void {
    this.status = StorefrontStatus.ACTIVE;
    this.published_at = new Date();
    this.last_updated_by = userId;
  }

  unpublish(userId?: string): void {
    this.status = StorefrontStatus.INACTIVE;
    this.last_updated_by = userId;
  }
}
