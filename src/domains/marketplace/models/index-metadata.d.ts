// @ts-nocheck
import { IndexMetadataStatus } from "@/domains/shared/utils/index-metadata-status";
declare const IndexMetadata: import("@platform/framework/utils").DmlEntity<import("@platform/framework/utils").DMLEntitySchemaBuilder<{
    id: import("@platform/framework/utils").PrimaryKeyModifier<string, import("@platform/framework/utils").IdProperty>;
    entity: import("@platform/framework/utils").TextProperty;
    fields: import("@platform/framework/utils").TextProperty;
    fields_hash: import("@platform/framework/utils").TextProperty;
    status: import("@platform/framework/utils").EnumProperty<typeof IndexMetadataStatus>;
}>, "IndexMetadata">;
export default IndexMetadata;
//# sourceMappingURL=index-metadata.d.ts.map




