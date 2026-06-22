'use client';

import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="status-panel status-error">
      <div className="status-error-icon">!</div>
      <div>
        <h3>Something went wrong</h3>
        <p>{message}</p>
      </div>
      <button type="button" className="retry-button" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}
