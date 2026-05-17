import { Outlet } from 'react-router-dom';
import type { Item } from '../../types/types';
import Search from '../Search/Search';
import CardList from '../CardList/CardList';
import Pagination from '../Pagination/Pagination';
import StatusWrapper from '../StatusWrapper/StatusWrapper';
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
          <StatusWrapper
            errorMessage={errorMessage}
            isLoading={loading}
            onRetry={onRetry}
          >
            {hasItems ? (
              <CardList items={items} />
            ) : (
              <div className="status-panel status-empty">
                <p>No results found.</p>
                <p>Try a different search term or clear the field.</p>
              </div>
            )}
          </StatusWrapper>
          {hasItems && !loading && (
            <Pagination page={page} onPageChange={onPageChange} />
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
