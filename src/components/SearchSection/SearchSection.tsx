'use client';

import { useTranslations } from 'next-intl';
import Search from '../Search/Search';

interface SearchSectionProps {
  searchTerm: string;
  loading: boolean;
  onSearch: (searchTerm: string) => void;
}

export default function SearchSection({
  searchTerm,
  loading,
  onSearch,
}: SearchSectionProps) {
  useTranslations();

  return (
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
  );
}
