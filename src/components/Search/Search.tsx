import {
  memo,
  useCallback,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react';
import './Search.css';

interface SearchProps {
  value: string;
  loading: boolean;
  onSearch: (searchTerm: string) => void;
}

function Search({ value, loading, onSearch }: SearchProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);

  const handleSubmit = useCallback((event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(inputValue);
  }, [inputValue, onSearch]);

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

export default memo(Search);
