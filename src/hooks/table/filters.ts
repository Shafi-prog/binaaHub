// Table filters hook
import { useState, useMemo } from "react";

export interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select" | "date";
  options?: { value: string; label: string }[];
}

export interface FilterValue {
  key: string;
  value: any;
}

export function useTableFilters(data: any[], filterConfigs: FilterConfig[]) {
  const [filters, setFilters] = useState<FilterValue[]>([]);

  const filteredData = useMemo(() => {
    if (!filters.length) return data;

    return data.filter((item) => {
      return filters.every((filter) => {
        if (!filter.value) return true;
        
        const itemValue = item[filter.key];
        
        if (typeof itemValue === "string") {
          return itemValue.toLowerCase().includes(filter.value.toLowerCase());
        }
        
        return itemValue === filter.value;
      });
    });
  }, [data, filters]);

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => {
      const existing = prev.find((f) => f.key === key);
      if (existing) {
        return prev.map((f) => (f.key === key ? { ...f, value } : f));
      }
      return [...prev, { key, value }];
    });
  };

  const removeFilter = (key: string) => {
    setFilters((prev) => prev.filter((f) => f.key !== key));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  return {
    filteredData,
    filters,
    updateFilter,
    removeFilter,
    clearFilters,
  };
}

// Export the hook with the expected name
export const useCollectionTableFilters = useTableFilters;
