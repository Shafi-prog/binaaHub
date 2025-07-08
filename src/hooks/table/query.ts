// Table query hook
import { useState, useMemo } from "react";

export interface QueryConfig {
  searchKey?: string;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
}

export function useTableQuery<T>(data: T[], config: QueryConfig = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchQuery && config.searchKey) {
      result = result.filter((item) => {
        const searchValue = (item as any)[config.searchKey!];
        return searchValue?.toString().toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortConfig.key];
        const bValue = (b as any)[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortConfig, config.searchKey]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearSort = () => {
    setSortConfig(null);
  };

  return {
    data: processedData,
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
    clearSearch,
    clearSort,
  };
}

// Export the hook with the expected name
export const useCollectionTableQuery = useTableQuery;
