// @ts-nocheck
// MikroORM Type Declarations
declare module "@mikro-orm/migrations" {
  export class Migration {
    async up(): Promise<void>;
    async down(): Promise<void>;
  }
}

declare module "@mikro-orm/core" {
  export * from "@mikro-orm/core/dist";
  export function Entity(options?: any): ClassDecorator;
  export function Property(options?: any): PropertyDecorator;
  export function PrimaryKey(options?: any): PropertyDecorator;
  export function ManyToOne(options?: any): PropertyDecorator;
  export function OneToMany(options?: any): PropertyDecorator;
}


