'use client';

import './Loading.css';

export default function Loading() {
  return (
    <div className="status-panel">
      <div className="spinner"></div>
      <p>Loading results... please wait.</p>
    </div>
  );
}
