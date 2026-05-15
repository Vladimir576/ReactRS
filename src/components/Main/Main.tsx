import { Component } from 'react';
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
}

export default class Main extends Component<MainProps> {
  render() {
    const { searchTerm, loading, errorMessage, items, onSearch } = this.props;
    const hasItems = items.length > 0;

    return (
      <main className="main-content">
        <section className="search-section">
          <div className="search-header">
            <h2>Top controls</h2>
          </div>
          <Search value={searchTerm} loading={loading} onSearch={onSearch} />
        </section>
        <section className="results-section">
          <div className="results-header">
            <h2>Results</h2>
          </div>
          {loading ? (
            <div className="status-panel">
              <div className="spinner" aria-hidden="true"></div>
              <p>Loading results... please wait.</p>
            </div>
          ) : errorMessage ? (
            <div className="status-panel status-error">
              <div className="status-error-icon">!</div>
              <div>
                <h3>Something went wrong</h3>
                <p>{errorMessage}</p>
              </div>
              <button
                type="button"
                className="retry-button"
                onClick={this.props.onRetry}
              >
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
        </section>
      </main>
    );
  }
}
