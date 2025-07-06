export * from "./data-table"

// Re-export types from Medusa UI for convenience
export type {
  DataTableFilter as Filter,
  DataTableColumnDef as ColumnDef,
  DataTableRow as Row,
  DataTableFilteringState,
  DataTablePaginationState,
  DataTableRowSelectionState,
  DataTableSortingState,
} from "@medusajs/ui"
