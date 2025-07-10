// @ts-nocheck
import { useMemo } from "react";

// Hook for order table filters
export const useOrderTableFilters = () => {
  return useMemo(() => ({
    filters: [
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Completed", value: "completed" },
          { label: "Cancelled", value: "cancelled" },
        ],
      },
      {
        key: "customer",
        label: "Customer",
        type: "text",
      },
    ],
    defaultFilters: {},
  }), []);
};


