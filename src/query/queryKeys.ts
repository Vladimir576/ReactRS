export const itemQueryKeys = {
  all: ['items'] as const,
  list: (query: string, page: number) => [...itemQueryKeys.all, 'list', query, page] as const,
  details: (id: number) => [...itemQueryKeys.all, 'details', id] as const,
};
