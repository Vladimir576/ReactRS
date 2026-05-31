import { useItemDetails } from '../hooks/useItemDetails';

export default function Details() {
  const { item, loading, refreshing, errorMessage, wrongId, closeDetails, refreshDetails } =
    useItemDetails();

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
        <button type="button" className="details-close" onClick={closeDetails}>
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
          <img className="details-image" src={item.image} alt={item.name} />
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          <p>ID: {item.id}</p>
        </article>
      ) : null}
    </div>
  );
}
