'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { itemQueryKeys } from '../query/queryKeys';
import { fetchItemById } from '../services/itemService';

const DETAILS_ERROR_MESSAGE = 'Item details could not be loaded.';

export function useItemDetails(itemId: number) {
  const queryClient = useQueryClient();
  const wrongId = !Number.isInteger(itemId) || itemId < 1;
  const detailsQueryKey = itemQueryKeys.details(itemId);
  const {
    data: item = null,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: detailsQueryKey,
    queryFn: () => fetchItemById(itemId),
    enabled: !wrongId,
  });

  function refreshDetails() {
    void queryClient
      .invalidateQueries({
        queryKey: detailsQueryKey,
        refetchType: 'none',
      })
      .then(() => {
        void refetch();
      });
  }

  return {
    item,
    loading: isLoading,
    refreshing: isFetching && !isLoading,
    errorMessage: isError ? DETAILS_ERROR_MESSAGE : '',
    wrongId,
    refreshDetails,
  };
}
