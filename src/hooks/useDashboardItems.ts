import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import {
  useLocation,
  useMatch,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { LOAD_ERROR_MESSAGE, STORAGE_KEY } from '../constants/appConstants';
import { itemQueryKeys } from '../query/queryKeys';
import { fetchItems } from '../services/itemService';
import { getPage } from '../utils/getPage';
import { useLocalStorage } from './useLocalStorage';

export function useDashboardItems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const detailsMatch = useMatch('/details/:detailsId');
  const page = getPage(searchParams.get('page'));
  const [searchTerm, setSearchTerm] = useLocalStorage(STORAGE_KEY, '');
  const itemsQueryKey = useMemo(
    () => itemQueryKeys.list(searchTerm, page),
    [page, searchTerm]
  );
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

  useEffect(() => {
    if (searchParams.get('page') !== String(page)) {
      setSearchParams({ page: String(page) }, { replace: true });
    }
  }, [page, searchParams, setSearchParams]);

  const handleSearch = useCallback((value: string) => {
    const trimmedValue = value.trim();

    setSearchTerm(trimmedValue);
    navigate('/?page=1');
  }, [navigate, setSearchTerm]);

  const handleRetry = useCallback(() => {
    void queryClient
      .invalidateQueries({ queryKey: itemsQueryKey, refetchType: 'none' })
      .then(() => {
        void refetch();
      });
  }, [itemsQueryKey, queryClient, refetch]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage < 1) {
      return;
    }

    navigate(`${location.pathname}?page=${newPage}`);
  }, [location.pathname, navigate]);

  return {
    searchTerm,
    loading: isLoading,
    refreshing: isFetching && !isLoading,
    errorMessage: isError ? LOAD_ERROR_MESSAGE : '',
    items,
    page,
    hasDetails: Boolean(detailsMatch),
    onSearch: handleSearch,
    onRetry: handleRetry,
    onPageChange: handlePageChange,
  };
}
