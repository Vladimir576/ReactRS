import { Outlet } from 'react-router-dom';
import type { Item } from '../../types/types';
import ProfileFormsPanel from '../ProfileForms/ProfileFormsPanel';
import ResultsSection from '../ResultsSection/ResultsSection';
import SearchSection from '../SearchSection/SearchSection';
import './Main.css';

interface MainProps {
  searchTerm: string;
  loading: boolean;
  refreshing: boolean;
  errorMessage: string;
  items: Item[];
  page: number;
  hasDetails: boolean;
  onSearch: (searchTerm: string) => void;
  onRetry: () => void;
  onPageChange: (page: number) => void;
}

export default function Main({
  searchTerm,
  loading,
  refreshing,
  errorMessage,
  items,
  page,
  hasDetails,
  onSearch,
  onRetry,
  onPageChange,
}: MainProps) {
  return (
    <main className={`main-content ${hasDetails ? 'main-content-split' : ''}`}>
      <div className="main-left">
        <ProfileFormsPanel />
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
        />
      </div>
      {hasDetails && (
        <section className="details-section">
          <Outlet />
        </section>
      )}
    </main>
  );
}
