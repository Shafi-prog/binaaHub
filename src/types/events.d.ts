// @ts-nocheck
// Event System Type Declarations
declare module "@medusajs/medusa" {
  export function EventListener(eventName?: string): MethodDecorator;
}

// Event types
interface EventPayload {
  id?: string;
  type: string;
  data: any;
  timestamp?: Date;
}

interface EventHandler {
  handle(event: EventPayload): Promise<void>;
}

// Common event patterns
type UserEvents = 
  | 'user.created'
  | 'user.updated'
  | 'user.deleted';

type OrderEvents = 
  | 'order.created'
  | 'order.updated'
  | 'order.cancelled';

type ProductEvents = 
  | 'product.created'
  | 'product.updated'
  | 'product.deleted';


