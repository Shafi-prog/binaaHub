import { Module, Modules } from "@medusajs/framework/utils"
import { FulfillmentCenterService } from "./services/fulfillment-center"

export default Module(Modules.FULFILLMENT, {
  service: FulfillmentCenterService,
})

// Module options types
export type { FulfillmentModuleOptions } from "./types"

// Export new Amazon FBA-inspired models
export {
  FulfillmentCenter,
  FulfillmentCenterStatus,
  FulfillmentCenterType,
  ServiceCapability,
  FulfillmentInventory,
  FulfillmentOrder,
  FulfillmentOrderStatus,
  FulfillmentOrderPriority,
  FulfillmentShipment,
  ShipmentStatus,
} from "./models/fulfillment-center"

// Export new fulfillment center service
export { FulfillmentCenterService } from "./services/fulfillment-center"
