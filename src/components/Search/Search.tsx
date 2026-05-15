import { Component, type SyntheticEvent, type ChangeEvent } from 'react';
import './Search.css';

interface SearchProps {
  value: string;
  loading: boolean;
  onSearch: (searchTerm: string) => void;
}

interface SearchState {
  inputValue: string;
}

export default class Search extends Component<SearchProps, SearchState> {
  state: SearchState = {
    inputValue: this.props.value,
  };

  componentDidUpdate(prevProps: SearchProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ inputValue: this.props.value });
    }
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: event.target.value });
  };

  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.onSearch(this.state.inputValue);
  };

  render() {
    return (
      <form className="search-form" onSubmit={this.handleSubmit} noValidate>
        <label className="visually-hidden" htmlFor="search-input">
          Search items
        </label>
        <input
          id="search-input"
          className="search-input"
          type="search"
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          placeholder="Search for items..."
          disabled={this.props.loading}
          aria-label="Search items"
        />
        <button
          className="search-button"
          type="submit"
          disabled={this.props.loading}
        >
          Search
        </button>
      </form>
    );
  }
}
