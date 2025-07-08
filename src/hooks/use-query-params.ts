import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const useQueryParams = () => {
  const router = useRouter();

  const setQueryParams = useCallback((params: Record<string, string>) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, ...params },
    });
  }, [router]);

  return {
    queryParams: router.query,
    setQueryParams,
  };
};


