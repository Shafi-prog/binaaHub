// @ts-nocheck
// Type declarations for Medusa modules
declare module "@medusajs/framework/types" {
  export interface ModuleJoinerConfig {
    serviceName?: string;
    primaryKeys?: string[];
    linkableKeys?: any;
    alias?: any;
    models?: any[];
  }
  
  export interface Module {
    service?: any;
    loaders?: any[];
  }
  
  export interface ServiceContext {
    manager: any;
    container: any;
    logger: any;
  }
  
  export interface ModuleOptions {
    database_url?: string;
    database_schema?: string;
    [key: string]: any;
  }
}

// Simplified base module interfaces
interface BaseModuleOptions {
  [key: string]: any;
}

type InitializeModuleInjectableDependencies = {
  [key: string]: any;
};

interface BaseRepository<T> {
  find(where?: any, options?: any): Promise<T[]>;
  findOne(where?: any, options?: any): Promise<T | null>;
  create(data: any): T;
  persist(entity: T): void;
  flush(): Promise<void>;
}

interface BaseService<T> {
  retrieve(id: string, config?: any): Promise<T>;
  list(selector?: any, config?: any): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<void>;
}

