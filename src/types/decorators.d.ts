// @ts-nocheck
// Medusa Decorator Type Declarations
declare module "@medusajs/medusa" {
  export function InjectManager(repository?: string): MethodDecorator;
  export function EmitEvents(eventName?: string): MethodDecorator;
  export function InjectSharedContext(contextName?: string): ParameterDecorator;
  export function Service(options?: { identifier?: string }): ClassDecorator;
}

// Service injection types
declare global {
  interface ServiceContext {
    manager: any;
    repository: any;
    eventBus: any;
  }
}


