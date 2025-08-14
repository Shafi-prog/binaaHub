// @ts-nocheck
import { ILockingProvider } from "@platform/framework/types";
import { EntityManager } from "@mikro-orm/core";
type InjectedDependencies = {
    manager: EntityManager;
};
declare const PostgresAdvisoryLockProvider_base: import("@platform/framework/utils").MedusaServiceReturnType<import("@platform/framework/utils").ModelConfigurationsToConfigTemplate<{
    readonly Locking: import("@platform/framework/utils").DmlEntity<import("@platform/framework/utils").DMLEntitySchemaBuilder<{
        id: import("@platform/framework/utils").PrimaryKeyModifier<string, import("@platform/framework/utils").IdProperty>;
        owner_id: import("@platform/framework/utils").NullableModifier<string, import("@platform/framework/utils").TextProperty>;
        expiration: import("@platform/framework/utils").NullableModifier<Date, import("@platform/framework/utils").DateTimeProperty>;
    }>, "Locking">;
}>>;
export declare class PostgresAdvisoryLockProvider extends PostgresAdvisoryLockProvider_base implements ILockingProvider {
    static identifier: string;
    protected manager: EntityManager;
    constructor(container: InjectedDependencies);
    private getManager;
    execute<T>(keys: string | string[], job: () => Promise<T>, args?: {
        timeout?: number;
    }): Promise<T>;
    private loadLock;
    acquire(keys: string | string[], args?: {
        ownerId?: string | null;
        expire?: number;
    }): Promise<void>;
    release(keys: string | string[], args?: {
        ownerId?: string | null;
    }): Promise<boolean>;
    releaseAll(args?: {
        ownerId?: string | null;
    }): Promise<void>;
    private hashStringToInt;
    private getTimeout;
}
export {};
//# sourceMappingURL=advisory-lock.d.ts.map




