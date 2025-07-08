// @ts-nocheck
// Service Injection Type Declarations
declare module "@medusajs/medusa" {
  export function InjectRepository(target?: string): ParameterDecorator;
  export function Inject(token: string): ParameterDecorator;
}

// Common service types
interface BaseRepository {
  find(options?: any): Promise<any[]>;
  findOne(options?: any): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
}

interface EventBusService {
  emit(event: string, data: any): Promise<void>;
  subscribe(event: string, handler: Function): void;
}


