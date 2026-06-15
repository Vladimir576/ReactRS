import { memo, useCallback, useMemo, useRef, useState } from 'react';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
};

const ITEM_HEIGHT = 220;
const OVERSCAN = 5;

export const CountryList = memo(({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const filteredCountries = useMemo(
    () =>
      countries
        .filter((c) => {
          const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
          return matchesSearch && matchesRegion;
        })
        .sort((a, b) => {
          if (sortField === 'name') {
            return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
          }

          const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;
          const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;
          return sortOrder === 'asc' ? popA - popB : popB - popA;
        }),
    [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]
  );

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const totalCount = filteredCountries.length;
  const containerHeight = containerRef.current?.clientHeight || 720;
  const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT);

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(totalCount, startIndex + visibleCount + OVERSCAN * 2);
  const visibleCountries = filteredCountries.slice(startIndex, endIndex);
  const topOffset = startIndex * ITEM_HEIGHT;

  return (
    <div ref={containerRef} className={styles.countryList} onScroll={handleScroll}>
      <div
        style={{
          height: totalCount * ITEM_HEIGHT,
          position: 'relative',
        }}
      >
        <div style={{ transform: `translateY(${topOffset}px)` }}>
          {visibleCountries.map((country) => (
            <CountryCard
              key={country.id}
              country={country}
              selectedYear={selectedYear}
              selectedColumns={selectedColumns}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
