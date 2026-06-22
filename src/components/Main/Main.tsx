'use client';

import type { Item } from '../../types/types';
import ResultsSection from '../ResultsSection/ResultsSection';
import SearchSection from '../SearchSection/SearchSection';
import Details from '../../pages/Details';
import './Main.css';

interface MainProps {
  searchTerm: string;
  loading: boolean;
  refreshing: boolean;
  errorMessage: string;
  items: Item[];
  page: number;
  selectedItemId: number | null;
  onSearch: (searchTerm: string) => void;
  onRetry: () => void;
  onPageChange: (page: number) => void;
  onSelectItem: (itemId: number) => void;
  onCloseDetails: () => void;
}

export default function Main({
  searchTerm,
  loading,
  refreshing,
  errorMessage,
  items,
  page,
  selectedItemId,
  onSearch,
  onRetry,
  onPageChange,
  onSelectItem,
  onCloseDetails,
}: MainProps) {
  return (
    <main className={`main-content ${selectedItemId ? 'main-content-split' : ''}`}>
      <div className="main-left">
        <SearchSection
          searchTerm={searchTerm}
          loading={loading}
          onSearch={onSearch}
        />
        <ResultsSection
          loading={loading}
          errorMessage={errorMessage}
          items={items}
          page={page}
          refreshing={refreshing}
          onRetry={onRetry}
          onPageChange={onPageChange}
          selectedItemId={selectedItemId}
          onSelectItem={onSelectItem}
        />
      </div>
      {selectedItemId && (
        <section className="details-section">
          <Details
            itemId={selectedItemId}
            onClose={onCloseDetails}
          />
        </section>
      )}
    </main>
  );
}
