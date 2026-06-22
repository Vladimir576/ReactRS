'use client';

import { useTranslations } from 'next-intl';
import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import './Search.css';

interface SearchProps {
  value: string;
  loading: boolean;
  onSearch: (searchTerm: string) => void;
}

export default function Search({ value, loading, onSearch }: SearchProps) {
  const [inputValue, setInputValue] = useState(value);
  const t = useTranslations();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(inputValue);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit} noValidate>
      <label className="visually-hidden" htmlFor="search-input">
        {t('search.placeholder')}
      </label>
      <input
        id="search-input"
        className="search-input"
        type="search"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={t('search.placeholder')}
        disabled={loading}
      />
      <button className="search-button" type="submit" disabled={loading}>
        {t('search.button')}
      </button>
    </form>
  );
}
