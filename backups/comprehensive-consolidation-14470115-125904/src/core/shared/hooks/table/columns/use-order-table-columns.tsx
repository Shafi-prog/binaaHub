// @ts-nocheck
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

// Hook for order table columns
export const useOrderTableColumns = () => {
  return useMemo<ColumnDef<any>[]>(() => [
    {
      id: "id",
      header: "Order ID",
      accessorKey: "id",
    },
    {
      id: "customer",
      header: "Customer",
      accessorKey: "customer.email",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
    },
    {
      id: "total",
      header: "Total",
      accessorKey: "total",
    },
    {
      id: "created_at",
      header: "Created",
      accessorKey: "created_at",
    },
  ], []);
};


