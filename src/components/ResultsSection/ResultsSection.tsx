import type { Item } from '../../types/types';
import CardList from '../CardList/CardList';
import Pagination from '../Pagination/Pagination';
import StatusWrapper from '../StatusWrapper/StatusWrapper';

interface ResultsSectionProps {
  loading: boolean;
  errorMessage: string;
  items: Item[];
  page: number;
  onRetry: () => void;
  onPageChange: (page: number) => void;
}

export default function ResultsSection({
  loading,
  errorMessage,
  items,
  page,
  onRetry,
  onPageChange,
}: ResultsSectionProps) {
  const hasItems = items.length > 0;

  return (
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
  );
}
