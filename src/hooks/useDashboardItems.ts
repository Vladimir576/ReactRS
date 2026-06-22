'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { LOAD_ERROR_MESSAGE, STORAGE_KEY } from '../constants/appConstants';
import { itemQueryKeys } from '../query/queryKeys';
import { fetchItems } from '../services/itemService';
import { useLocalStorage } from './useLocalStorage';

interface DashboardItemsProps {
  initialPage?: number;
  initialSearchTerm?: string;
}

export function useDashboardItems({
  initialPage = 1,
  initialSearchTerm = '',
}: DashboardItemsProps = {}) {
  const [page, setPage] = useState(initialPage);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [searchTerm, setSearchTermLocal] = useLocalStorage(STORAGE_KEY, initialSearchTerm);
  const queryClient = useQueryClient();
  const itemsQueryKey = itemQueryKeys.list(searchTerm, page);

  const {
    data: items = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: itemsQueryKey,
    queryFn: () => fetchItems({ query: searchTerm, page }),
  });

  function handleSearch(value: string) {
    const trimmedValue = value.trim();
    setSearchTermLocal(trimmedValue);
    setPage(1);
    setSelectedItemId(null);
  }

  function handleRetry() {
    void queryClient
      .invalidateQueries({ queryKey: itemsQueryKey, refetchType: 'none' })
      .then(() => {
        void refetch();
      });
  }

  function handlePageChange(newPage: number) {
    if (newPage < 1) {
      return;
    }
    setPage(newPage);
  }

  function handleSelectItem(itemId: number) {
    setSelectedItemId(itemId);
  }

  function handleCloseDetails() {
    setSelectedItemId(null);
  }

  return {
    searchTerm,
    loading: isLoading,
    refreshing: isFetching && !isLoading,
    errorMessage: isError ? LOAD_ERROR_MESSAGE : '',
    items,
    page,
    selectedItemId,
    onSearch: handleSearch,
    onRetry: handleRetry,
    onPageChange: handlePageChange,
    onSelectItem: handleSelectItem,
    onCloseDetails: handleCloseDetails,
  };
}
