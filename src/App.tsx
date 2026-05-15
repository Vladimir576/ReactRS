import { Component } from 'react';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import { fetchItems } from './services/itemService';
import type { Item } from './types/types';

interface AppState {
  searchTerm: string;
  items: Item[];
  loading: boolean;
  errorMessage: string;
  simulateError: boolean;
}

const STORAGE_KEY = 'searchTerm';

class ErrorTester extends Component<{ active: boolean }> {
  render() {
    if (this.props.active) {
      throw new Error('Simulated application error');
    }

    return null;
  }
}

export default class App extends Component<object, AppState> {
  state: AppState = {
    searchTerm: '',
    items: [],
    loading: false,
    errorMessage: '',
    simulateError: false,
  };

  componentDidMount() {
    const savedTerm = localStorage.getItem(STORAGE_KEY) || '';

    this.setState({ searchTerm: savedTerm }, () => {
      this.fetchData(savedTerm);
    });
  }

  fetchData(query: string) {
    const trimmedQuery = query.trim();

    this.setState({ loading: true, errorMessage: '' });

    fetchItems({ query: trimmedQuery, page: 1 })
      .then((items) => {
        this.setState({ items, loading: false });
      })
      .catch(() => {
        this.setState({
          items: [],
          errorMessage:
            'Something went wrong. We couldn’t process your request. Please try again later.',
          loading: false,
        });
      });
  }

  handleSearch = (searchTerm: string) => {
    const trimmedValue = searchTerm.trim();

    if (trimmedValue === this.state.searchTerm) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, trimmedValue);
    this.setState({ searchTerm: trimmedValue }, () => {
      this.fetchData(trimmedValue);
    });
  };

  handleRetry = () => {
    this.fetchData(this.state.searchTerm);
  };

  handleTriggerError = () => {
    this.setState({ simulateError: true });
  };

  handleResetError = () => {
    this.setState({ simulateError: false });
  };

  render() {
    return (
      <ErrorBoundary onReset={this.handleResetError}>
        <div className="app-shell">
          <Header onTriggerError={this.handleTriggerError} />
          <Main
            searchTerm={this.state.searchTerm}
            loading={this.state.loading}
            errorMessage={this.state.errorMessage}
            items={this.state.items}
            onSearch={this.handleSearch}
            onRetry={this.handleRetry}
          />
          <ErrorTester active={this.state.simulateError} />
        </div>
      </ErrorBoundary>
    );
  }
}
