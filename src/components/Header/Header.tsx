import { NavLink } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  onTriggerError: () => void;
}

export default function Header({ onTriggerError }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="page-title">
        <p className="subtitle">Powered by React</p>
        <h1>Character Search</h1>
        <p className="main-title">
        Use the search field to find information about the character you are interested in.
        </p>
      </div>
      <div className="header-actions">
        <nav className="main-nav" >
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <button
          type="button"
          className="error-trigger"
          onClick={onTriggerError}
        >
          Simulate App Error
        </button>
      </div>
    </header>
  );
}
