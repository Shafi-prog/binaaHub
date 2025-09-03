// @ts-nocheck
import { TransactionState } from "@platform/framework/orchestration";
export declare const WorkflowExecution: import("@platform/framework/utils").DmlEntity<import("@platform/framework/utils").DMLEntitySchemaBuilder<{
    id: import("@platform/framework/utils").IdProperty;
    workflow_id: import("@platform/framework/utils").PrimaryKeyModifier<string, import("@platform/framework/utils").TextProperty>;
    transaction_id: import("@platform/framework/utils").PrimaryKeyModifier<string, import("@platform/framework/utils").TextProperty>;
    run_id: import("@platform/framework/utils").PrimaryKeyModifier<string, import("@platform/framework/utils").TextProperty>;
    execution: import("@platform/framework/utils").NullableModifier<Record<string, unknown>, import("@platform/framework/utils").JSONProperty>;
    context: import("@platform/framework/utils").NullableModifier<Record<string, unknown>, import("@platform/framework/utils").JSONProperty>;
    state: import("@platform/framework/utils").EnumProperty<typeof TransactionState>;
    retention_time: import("@platform/framework/utils").NullableModifier<number, import("@platform/framework/utils").NumberProperty>;
}>, "workflow_execution">;
//# sourceMappingURL=workflow-execution.d.ts.map




