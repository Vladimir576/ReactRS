import { useEffect, useState } from 'react';
import {
  useLocation,
  useMatch,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { LOAD_ERROR_MESSAGE, STORAGE_KEY } from '../constants/appConstants';
import { fetchItems } from '../services/itemService';
import type { Item } from '../types/types';
import { getPage } from '../utils/getPage';
import { useLocalStorage } from './useLocalStorage';

export function useDashboardItems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const detailsMatch = useMatch('/details/:detailsId');
  const page = getPage(searchParams.get('page'));
  const [searchTerm, setSearchTerm] = useLocalStorage(STORAGE_KEY, '');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (searchParams.get('page') !== String(page)) {
      setSearchParams({ page: String(page) }, { replace: true });
    }
  }, [page, searchParams, setSearchParams]);

  useEffect(() => {
    let ignore = false;

    async function loadItems() {
      setLoading(true);
      setErrorMessage('');

      try {
        const loadedItems = await fetchItems({ query: searchTerm, page });

        if (!ignore) {
          setItems(loadedItems);
          setLoading(false);
        }
      } catch {
        if (!ignore) {
          setItems([]);
          setErrorMessage(LOAD_ERROR_MESSAGE);
          setLoading(false);
        }
      }
    }

    void loadItems();

    return () => {
      ignore = true;
    };
  }, [searchTerm, page]);

  function handleSearch(value: string) {
    const trimmedValue = value.trim();

    setSearchTerm(trimmedValue);
    navigate('/?page=1');
  }

  function handleRetry() {
    setLoading(true);
    setErrorMessage('');

    fetchItems({ query: searchTerm, page })
      .then((loadedItems) => {
        setItems(loadedItems);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setErrorMessage(LOAD_ERROR_MESSAGE);
        setLoading(false);
      });
  }

  function handlePageChange(newPage: number) {
    if (newPage < 1) {
      return;
    }

    navigate(`${location.pathname}?page=${newPage}`);
  }

  return {
    searchTerm,
    loading,
    errorMessage,
    items,
    page,
    hasDetails: Boolean(detailsMatch),
    onSearch: handleSearch,
    onRetry: handleRetry,
    onPageChange: handlePageChange,
  };
}
