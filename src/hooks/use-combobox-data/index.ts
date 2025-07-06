import { useState, useMemo } from "react";

// Hook for combobox data management
export const useComboboxData = (items: any[] = []) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    if (!searchValue) return items;
    return items.filter((item) =>
      item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.label?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [items, searchValue]);

  return {
    searchValue,
    setSearchValue,
    selectedValue,
    setSelectedValue,
    filteredItems,
    items,
  };
};

export default useComboboxData;
