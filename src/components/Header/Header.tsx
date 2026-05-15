import { Component } from 'react';
import './Header.css';

interface HeaderProps {
  onTriggerError: () => void;
}

export default class Header extends Component<HeaderProps> {
  render() {
    return (
      <header className="app-header">
        <div className="page-title">
          <p className="eyebrow">Search App</p>
          <h1>Search for products</h1>
          <p className="subtitle">
            Use the search field to filter the catalog. Results are saved and
            restored on reload.
          </p>
        </div>
        <button
          type="button"
          className="error-trigger"
          onClick={this.props.onTriggerError}
        >
          Simulate App Error
        </button>
      </header>
    );
  }
}
