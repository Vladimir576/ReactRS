import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { fetchItemById } from '../services/itemService';
import type { Item } from '../types/types';

const DETAILS_ERROR_MESSAGE = 'Item details could not be loaded.';

export function useItemDetails() {
  const { detailsId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const page = searchParams.get('page') || '1';
  const id = Number(detailsId);
  const wrongId = !Number.isInteger(id) || id < 1;

  useEffect(() => {
    if (wrongId) {
      return;
    }

    let ignore = false;

    async function loadDetails() {
      setLoading(true);
      setErrorMessage('');

      try {
        const loadedItem = await fetchItemById(id);

        if (!ignore) {
          setItem(loadedItem);
          setLoading(false);
        }
      } catch {
        if (!ignore) {
          setItem(null);
          setErrorMessage(DETAILS_ERROR_MESSAGE);
          setLoading(false);
        }
      }
    }

    void loadDetails();

    return () => {
      ignore = true;
    };
  }, [id, wrongId]);

  function closeDetails() {
    navigate(`/?page=${page}`);
  }

  return {
    item,
    loading,
    errorMessage,
    wrongId,
    closeDetails,
  };
}
