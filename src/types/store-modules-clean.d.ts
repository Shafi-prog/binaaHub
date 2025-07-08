// @ts-nocheck
// Clean Module Type Declarations
declare module "@medusajs/framework/types" {
  interface ModuleJoinerConfig {
    serviceName?: string;
    primaryKeys?: string[];
    linkableKeys?: any;
    alias?: any;
    models?: any[];
  }
  interface Module {
    service?: any;
    loaders?: any[];
  }
}

// Fix for store modules
interface BaseModuleOptions {
  [key: string]: any;
}

type InitializeModuleInjectableDependencies = {
  [key: string]: any;
};


