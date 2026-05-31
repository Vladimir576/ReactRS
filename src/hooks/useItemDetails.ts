import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { itemQueryKeys } from '../query/queryKeys';
import { fetchItemById } from '../services/itemService';

const DETAILS_ERROR_MESSAGE = 'Item details could not be loaded.';

export function useItemDetails() {
  const { detailsId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const page = searchParams.get('page') || '1';
  const id = Number(detailsId);
  const wrongId = !Number.isInteger(id) || id < 1;
  const detailsQueryKey = itemQueryKeys.details(id);
  const {
    data: item = null,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: detailsQueryKey,
    queryFn: () => fetchItemById(id),
    enabled: !wrongId,
  });

  function closeDetails() {
    navigate(`/?page=${page}`);
  }

  function refreshDetails() {
    void queryClient
      .invalidateQueries({ queryKey: detailsQueryKey, refetchType: 'none' })
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
    closeDetails,
    refreshDetails,
  };
}
