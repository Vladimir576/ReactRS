'use client';

import Image from 'next/image';
import { useItemDetails } from '../hooks/useItemDetails';

interface DetailsProps {
  itemId: number;
  onClose: () => void;
}

export default function Details({ itemId, onClose }: DetailsProps) {
  const { item, loading, refreshing, errorMessage, wrongId, refreshDetails } =
    useItemDetails(itemId);

  return (
    <div className="details-panel">
      <div className="details-actions">
        {!wrongId && (
          <button
            type="button"
            className="refresh-button"
            onClick={refreshDetails}
            disabled={loading || refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
        <button type="button" className="details-close" onClick={onClose}>
          Close
        </button>
      </div>
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
          <Image
            className="details-image"
            src={item.image}
            alt={item.name}
            width={200}
            height={200}
          />
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          <p>ID: {item.id}</p>
        </article>
      ) : null}
    </div>
  );
}
