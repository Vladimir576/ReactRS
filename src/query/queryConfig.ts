import { QueryClient } from '@tanstack/react-query';

const DEFAULT_QUERY_CACHE_TTL_MS = 5 * 60 * 1000;

export function getQueryCacheTtl(): number {
  const rawTtl = import.meta.env.VITE_QUERY_CACHE_TTL_MS;
  const ttl = Number(rawTtl);

  return Number.isFinite(ttl) && ttl >= 0 ? ttl : DEFAULT_QUERY_CACHE_TTL_MS;
}

export function createAppQueryClient(): QueryClient {
  const cacheTtl = getQueryCacheTtl();

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: cacheTtl,
        gcTime: cacheTtl,
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}
