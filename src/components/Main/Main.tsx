import { Outlet } from 'react-router-dom';
import type { Item } from '../../types/types';
import Search from '../Search/Search';
import CardList from '../CardList/CardList';
import './Main.css';

interface MainProps {
  searchTerm: string;
  loading: boolean;
  errorMessage: string;
  items: Item[];
  onSearch: (searchTerm: string) => void;
  onRetry: () => void;
  page: number;
  onPageChange: (page: number) => void;
  hasDetails: boolean;
}

export default function Main({
  searchTerm,
  loading,
  errorMessage,
  items,
  onSearch,
  onRetry,
  page,
  onPageChange,
  hasDetails,
}: MainProps) {
  const hasItems = items.length > 0;

  return (
    <main className={`main-content ${hasDetails ? 'main-content-split' : ''}`}>
      <div className="main-left">
        <section className="search-section">
          <div className="search-header">
            <h2>Who are you interested in?</h2>
          </div>
          <Search
            key={searchTerm}
            value={searchTerm}
            loading={loading}
            onSearch={onSearch}
          />
        </section>
        <section className="results-section">
          <div className="results-header">
            <h2>Results</h2>
          </div>
          {loading ? (
            <div className="status-panel">
              <div className="spinner"></div>
              <p>Loading results... please wait.</p>
            </div>
          ) : errorMessage ? (
            <div className="status-panel status-error">
              <div className="status-error-icon">!</div>
              <div>
                <h3>Something went wrong</h3>
                <p>{errorMessage}</p>
              </div>
              <button type="button" className="retry-button" onClick={onRetry}>
                Try Again
              </button>
            </div>
          ) : hasItems ? (
            <CardList items={items} />
          ) : (
            <div className="status-panel status-empty">
              <p>No results found.</p>
              <p>Try a different search term or clear the field.</p>
            </div>
          )}
          {hasItems && !loading && (
            <div className="pagination">
              <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button type="button" onClick={() => onPageChange(page + 1)}>
                Next
              </button>
            </div>
          )}
        </section>
      </div>
      {hasDetails && (
        <section className="details-section">
          <Outlet />
        </section>
      )}
    </main>
  );
}
