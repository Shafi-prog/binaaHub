// @ts-nocheck
declare const IndexRelation: import("@platform/framework/utils").DmlEntity<import("@platform/framework/utils").DMLEntitySchemaBuilder<{
    id: import("@platform/framework/utils").PrimaryKeyModifier<number, import("@platform/framework/utils").AutoIncrementProperty>;
    pivot: import("@platform/framework/utils").TextProperty;
    parent_name: import("@platform/framework/utils").TextProperty;
    parent_id: import("@platform/framework/utils").TextProperty;
    child_name: import("@platform/framework/utils").TextProperty;
    child_id: import("@platform/framework/utils").TextProperty;
    staled_at: import("@platform/framework/utils").NullableModifier<Date, import("@platform/framework/utils").DateTimeProperty>;
}>, "IndexRelation">;
export default IndexRelation;
//# sourceMappingURL=index-relation.d.ts.map




