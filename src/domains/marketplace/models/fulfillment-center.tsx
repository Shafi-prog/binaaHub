// @ts-nocheck
import { Entity, PrimaryKey, Property, OneToMany, ManyToOne, Collection, Enum } from '@mikro-orm/core';
import { v4 } from 'uuid';

// Fulfillment center status
export enum FulfillmentCenterStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  SUSPENDED = 'suspended'
}

// Fulfillment center types
export enum FulfillmentCenterType {
  DISTRIBUTION = 'distribution',
  SORTATION = 'sortation',
  DELIVERY_STATION = 'delivery_station',
  RETURNS = 'returns',
  CROSS_DOCK = 'cross_dock'
}

// Service capabilities
export enum ServiceCapability {
  STANDARD_SHIPPING = 'standard_shipping',
  EXPRESS_SHIPPING = 'express_shipping',
  SAME_DAY_DELIVERY = 'same_day_delivery',
  RETURNS_PROCESSING = 'returns_processing',
  GIFT_WRAPPING = 'gift_wrapping',
  FRAGILE_HANDLING = 'fragile_handling',
  COLD_STORAGE = 'cold_storage',
  HAZMAT_HANDLING = 'hazmat_handling'
}

@Entity()
export class FulfillmentCenter {
  @PrimaryKey()
  id: string = v4();

  @Property()
  name: string;

  @Property()
  code: string; // Unique center code (e.g., 'RUH01', 'JED02')

  @Enum(() => FulfillmentCenterType)
  type: FulfillmentCenterType;

  @Enum(() => FulfillmentCenterStatus)
  status: FulfillmentCenterStatus = FulfillmentCenterStatus.ACTIVE;

  // Location information
  @Property()
  address: string;

  @Property()
  city: string;

  @Property()
  region: string;

  @Property()
  postal_code: string;

  @Property()
  country_code: string;

  @Property({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude?: number;

  @Property({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude?: number;

  // Capacity information
  @Property({ type: 'integer' })
  total_capacity_cubic_meters: number;

  @Property({ type: 'integer' })
  used_capacity_cubic_meters: number = 0;

  @Property({ type: 'integer' })
  total_storage_units: number;

  @Property({ type: 'integer' })
  available_storage_units: number;

  @Property({ type: 'integer', nullable: true })
  max_daily_orders?: number;

  // Service capabilities
  @Property({ type: 'json', default: '[]' })
  service_capabilities: ServiceCapability[] = [];

  @Property({ type: 'json', default: '{}' })
  service_areas: {
    same_day?: string[];
    next_day?: string[];
    standard?: string[];
  } = {};

  // Operating hours
  @Property({ type: 'json', default: '{}' })
  operating_hours: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  } = {};

  // Contact information
  @Property({ nullable: true })
  manager_name?: string;

  @Property({ nullable: true })
  manager_email?: string;

  @Property({ nullable: true })
  manager_phone?: string;

  @Property({ nullable: true })
  contact_email?: string;

  @Property({ nullable: true })
  contact_phone?: string;

  // Cost and billing
  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  storage_cost_per_cubic_meter?: number;

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  handling_cost_per_unit?: number;

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  shipping_cost_base?: number;

  @Property({ type: 'json', default: '{}' })
  cost_structure: {
    receiving?: number;
    storage?: number;
    picking?: number;
    packing?: number;
    shipping?: number;
    returns?: number;
  } = {};

  // Performance metrics
  @Property({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  capacity_utilization_percent: number = 0;

  @Property({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  order_accuracy_percent: number = 0;

  @Property({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  on_time_shipment_percent: number = 0;

  @Property({ type: 'integer', default: 0 })
  orders_processed_today: number = 0;

  @Property({ type: 'integer', default: 0 })
  orders_processed_this_month: number = 0;

  // Integration settings
  @Property({ type: 'json', default: '{}' })
  wms_integration: {
    system?: string;
    endpoint?: string;
    credentials?: Record<string, any>;
    sync_enabled?: boolean;
  } = {};

  @Property({ type: 'json', default: '{}' })
  carrier_integrations: {
    carrier_code?: string;
    account_number?: string;
    api_credentials?: Record<string, any>;
    service_types?: string[];
  }[] = [];

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
  @OneToMany(() => FulfillmentInventory, (inventory) => inventory.fulfillment_center)
  inventory_items = new Collection<FulfillmentInventory>(this);

  @OneToMany(() => FulfillmentOrder, (order) => order.fulfillment_center)
  fulfillment_orders = new Collection<FulfillmentOrder>(this);

  @OneToMany(() => FulfillmentShipment, (shipment) => shipment.fulfillment_center)
  shipments = new Collection<FulfillmentShipment>(this);

  // Computed properties
  get available_capacity_cubic_meters(): number {
    return this.total_capacity_cubic_meters - this.used_capacity_cubic_meters;
  }

  get capacity_utilization(): number {
    return (this.used_capacity_cubic_meters / this.total_capacity_cubic_meters) * 100;
  }

  get is_at_capacity(): boolean {
    return this.capacity_utilization >= 95;
  }

  get can_handle_same_day(): boolean {
    return this.service_capabilities.includes(ServiceCapability.SAME_DAY_DELIVERY);
  }

  get can_handle_express(): boolean {
    return this.service_capabilities.includes(ServiceCapability.EXPRESS_SHIPPING);
  }

  get can_handle_returns(): boolean {
    return this.service_capabilities.includes(ServiceCapability.RETURNS_PROCESSING);
  }

  // Helper methods
  updateCapacityUtilization(): void {
    this.capacity_utilization_percent = this.capacity_utilization;
  }

  addServiceCapability(capability: ServiceCapability): void {
    if (!this.service_capabilities.includes(capability)) {
      this.service_capabilities.push(capability);
    }
  }

  removeServiceCapability(capability: ServiceCapability): void {
    this.service_capabilities = this.service_capabilities.filter(c => c !== capability);
  }

  updatePerformanceMetrics(metrics: {
    order_accuracy?: number;
    on_time_shipment?: number;
    orders_processed_today?: number;
    orders_processed_this_month?: number;
  }): void {
    if (metrics.order_accuracy !== undefined) {
      this.order_accuracy_percent = metrics.order_accuracy;
    }
    if (metrics.on_time_shipment !== undefined) {
      this.on_time_shipment_percent = metrics.on_time_shipment;
    }
    if (metrics.orders_processed_today !== undefined) {
      this.orders_processed_today = metrics.orders_processed_today;
    }
    if (metrics.orders_processed_this_month !== undefined) {
      this.orders_processed_this_month = metrics.orders_processed_this_month;
    }
  }
}

// Fulfillment inventory tracking
@Entity()
export class FulfillmentInventory {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => FulfillmentCenter)
  fulfillment_center: FulfillmentCenter;

  @Property()
  product_id: string;

  @Property()
  variant_id: string;

  @Property()
  sku: string;

  @Property({ type: 'integer' })
  quantity_available: number = 0;

  @Property({ type: 'integer' })
  quantity_reserved: number = 0;

  @Property({ type: 'integer' })
  quantity_damaged: number = 0;

  @Property({ type: 'integer' })
  quantity_quarantine: number = 0;

  @Property({ nullable: true })
  location_code?: string; // Specific location within fulfillment center

  @Property({ nullable: true })
  aisle?: string;

  @Property({ nullable: true })
  shelf?: string;

  @Property({ nullable: true })
  bin?: string;

  @Property({ type: 'decimal', precision: 8, scale: 3, nullable: true })
  unit_weight_kg?: number;

  @Property({ type: 'decimal', precision: 8, scale: 3, nullable: true })
  unit_volume_cubic_meters?: number;

  @Property({ nullable: true })
  expiration_date?: Date;

  @Property({ nullable: true })
  batch_number?: string;

  @Property({ nullable: true })
  lot_number?: string;

  @Property()
  last_counted_at: Date = new Date();

  @Property({ type: 'json', default: '{}' })
  metadata: Record<string, any> = {};

  @Property()
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date();

  // Computed properties
  get total_quantity(): number {
    return this.quantity_available + this.quantity_reserved + this.quantity_damaged + this.quantity_quarantine;
  }

  get effective_quantity(): number {
    return this.quantity_available;
  }

  get needs_restock(): boolean {
    return this.quantity_available <= 5; // Configurable threshold
  }
}

// Fulfillment orders (FBA-like orders)
export enum FulfillmentOrderStatus {
  RECEIVED = 'received',
  PROCESSING = 'processing',
  PICKING = 'picking',
  PACKING = 'packing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  CANCELLED = 'cancelled'
}

export enum FulfillmentOrderPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Entity()
export class FulfillmentOrder {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => FulfillmentCenter)
  fulfillment_center: FulfillmentCenter;

  @Property()
  order_id: string; // Reference to main order

  @Property()
  vendor_id: string;

  @Property()
  customer_id: string;

  @Enum(() => FulfillmentOrderStatus)
  status: FulfillmentOrderStatus = FulfillmentOrderStatus.RECEIVED;

  @Enum(() => FulfillmentOrderPriority)
  priority: FulfillmentOrderPriority = FulfillmentOrderPriority.NORMAL;

  @Property({ type: 'json' })
  shipping_address: {
    name: string;
    company?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    region: string;
    postal_code: string;
    country_code: string;
    phone?: string;
    email?: string;
  };

  @Property({ type: 'json' })
  items: {
    product_id: string;
    variant_id: string;
    sku: string;
    quantity: number;
    title: string;
    unit_price: number;
    total_price: number;
    weight_kg?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
  }[];

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Property({ type: 'decimal', precision: 8, scale: 3, nullable: true })
  total_weight_kg?: number;

  @Property({ nullable: true })
  requested_ship_date?: Date;

  @Property({ nullable: true })
  promised_delivery_date?: Date;

  @Property({ nullable: true })
  carrier_code?: string;

  @Property({ nullable: true })
  service_type?: string;

  @Property({ nullable: true })
  tracking_number?: string;

  @Property({ nullable: true })
  picked_at?: Date;

  @Property({ nullable: true })
  packed_at?: Date;

  @Property({ nullable: true })
  shipped_at?: Date;

  @Property({ nullable: true })
  delivered_at?: Date;

  @Property({ nullable: true })
  picker_id?: string;

  @Property({ nullable: true })
  packer_id?: string;

  @Property({ type: 'json', default: '{}' })
  fulfillment_costs: {
    picking?: number;
    packing?: number;
    shipping?: number;
    handling?: number;
    total?: number;
  } = {};

  @Property({ type: 'json', default: '{}' })
  special_instructions: {
    gift_wrap?: boolean;
    gift_message?: string;
    fragile?: boolean;
    signature_required?: boolean;
    delivery_instructions?: string;
  } = {};

  @Property({ type: 'json', default: '{}' })
  metadata: Record<string, any> = {};

  @Property({ type: 'text', nullable: true })
  notes?: string;

  @Property()
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date();

  // Relationships
  @OneToMany(() => FulfillmentShipment, (shipment) => shipment.fulfillment_order)
  shipments = new Collection<FulfillmentShipment>(this);

  // Helper methods
  updateStatus(status: FulfillmentOrderStatus, userId?: string): void {
    this.status = status;
    
    switch (status) {
      case FulfillmentOrderStatus.PICKING:
        this.picker_id = userId;
        break;
      case FulfillmentOrderStatus.PACKING:
        this.picked_at = new Date();
        this.packer_id = userId;
        break;
      case FulfillmentOrderStatus.SHIPPED:
        this.packed_at = new Date();
        this.shipped_at = new Date();
        break;
      case FulfillmentOrderStatus.DELIVERED:
        this.delivered_at = new Date();
        break;
    }
  }

  calculateFulfillmentCosts(center: FulfillmentCenter): void {
    this.fulfillment_costs = {
      picking: center.cost_structure.picking || 0,
      packing: center.cost_structure.packing || 0,
      handling: center.cost_structure.receiving || 0,
      shipping: center.cost_structure.shipping || 0,
    };
    
    this.fulfillment_costs.total = 
      (this.fulfillment_costs.picking || 0) +
      (this.fulfillment_costs.packing || 0) +
      (this.fulfillment_costs.handling || 0) +
      (this.fulfillment_costs.shipping || 0);
  }
}

// Fulfillment shipments
export enum ShipmentStatus {
  PREPARING = 'preparing',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  DELIVERY_ATTEMPTED = 'delivery_attempted',
  RETURNED_TO_SENDER = 'returned_to_sender',
  LOST = 'lost',
  DAMAGED = 'damaged'
}

@Entity()
export class FulfillmentShipment {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => FulfillmentCenter)
  fulfillment_center: FulfillmentCenter;

  @ManyToOne(() => FulfillmentOrder)
  fulfillment_order: FulfillmentOrder;

  @Property()
  tracking_number: string;

  @Property()
  carrier_code: string;

  @Property()
  service_type: string;

  @Enum(() => ShipmentStatus)
  status: ShipmentStatus = ShipmentStatus.PREPARING;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  shipping_cost: number;

  @Property({ type: 'decimal', precision: 8, scale: 3, nullable: true })
  weight_kg?: number;

  @Property({ type: 'json', nullable: true })
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @Property({ nullable: true })
  shipped_at?: Date;

  @Property({ nullable: true })
  estimated_delivery_at?: Date;

  @Property({ nullable: true })
  actual_delivery_at?: Date;

  @Property({ type: 'json', default: '[]' })
  tracking_events: {
    timestamp: string;
    status: string;
    location?: string;
    description: string;
  }[] = [];

  @Property({ type: 'json', default: '{}' })
  delivery_confirmation: {
    signature?: string;
    delivery_location?: string;
    recipient_name?: string;
    photo_url?: string;
  } = {};

  @Property({ type: 'json', default: '{}' })
  metadata: Record<string, any> = {};

  @Property()
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date();

  // Helper methods
  addTrackingEvent(status: string, description: string, location?: string): void {
    this.tracking_events.push({
      timestamp: new Date().toISOString(),
      status,
      location,
      description
    });
  }

  updateStatus(status: ShipmentStatus): void {
    this.status = status;
    
    switch (status) {
      case ShipmentStatus.PICKED_UP:
        this.shipped_at = new Date();
        break;
      case ShipmentStatus.DELIVERED:
        this.actual_delivery_at = new Date();
        break;
    }
  }
}


