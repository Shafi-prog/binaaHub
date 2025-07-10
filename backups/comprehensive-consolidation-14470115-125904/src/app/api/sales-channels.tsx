// @ts-nocheck
import { useQuery } from "@tanstack/react-query";

interface SalesChannelsResult {
  sales_channels: any[];
  count: number;
  offset: number;
  limit: number;
}

export const useSalesChannels = (query?: any, options?: any) => {
  const queryResult = useQuery<SalesChannelsResult>({
    queryKey: ["sales-channels", query],
    queryFn: async (): Promise<SalesChannelsResult> => {
      return {
        sales_channels: [],
        count: 0,
        offset: 0,
        limit: 10,
      };
    },
    ...options,
  });

  return {
    ...queryResult,
    sales_channels: queryResult.data?.sales_channels || [],
    count: queryResult.data?.count || 0,
  };
};


