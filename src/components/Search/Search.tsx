import { useState, type ChangeEvent, type FormEvent } from 'react';
import './Search.css';

interface SearchProps {
  value: string;
  loading: boolean;
  onSearch: (searchTerm: string) => void;
}

export default function Search({ value, loading, onSearch }: SearchProps) {
  const [inputValue, setInputValue] = useState(value);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(inputValue);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit} noValidate>
      <label className="visually-hidden" htmlFor="search-input">
        Search items
      </label>
      <input
        id="search-input"
        className="search-input"
        type="search"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search for items..."
        disabled={loading}
      />
      <button className="search-button" type="submit" disabled={loading}>
        Search
      </button>
    </form>
  );
}
