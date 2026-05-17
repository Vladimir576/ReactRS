import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { fetchItemById } from '../services/itemService';
import type { Item } from '../types/types';

export default function Details() {
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
          setErrorMessage('Item details could not be loaded.');
          setLoading(false);
        }
      }
    }

    void loadDetails();

    return () => {
      ignore = true;
    };
  }, [id, wrongId]);

  function handleClose() {
    navigate(`/?page=${page}`);
  }

  return (
    <div className="details-panel">
      <button type="button" className="details-close" onClick={handleClose}>
        Close
      </button>
      {wrongId ? (
        <p>Item was not found.</p>
      ) : loading ? (
        <div className="status-panel">
          <div className="spinner"></div>
          <p>Loading details...</p>
        </div>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : item ? (
        <article>
          <img className="details-image" src={item.image} alt={item.name} />
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          <p>ID: {item.id}</p>
        </article>
      ) : null}
    </div>
  );
}
