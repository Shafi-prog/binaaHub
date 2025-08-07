// @ts-nocheck
import { useQuery } from "@tanstack/react-query";

interface Store {
  id: string;
  name: string;
  default_location_id?: string;
  default_currency_code: string;
  created_at: string;
  updated_at: string;
}

export const useStore = (options?: any) => {
  const queryResult = useQuery<Store>({
    queryKey: ["store"],
    queryFn: async (): Promise<Store> => {
      // Mock store data - in a real app this would fetch from your API
      return {
        id: "store-1",
        name: "Binna Store",
        default_location_id: "loc-1",
        default_currency_code: "USD",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    },
    ...options,
  });

  return {
    ...queryResult,
    store: queryResult.data,
    isPending: queryResult.isPending,
    isError: queryResult.isError,
    error: queryResult.error,
  };
};


