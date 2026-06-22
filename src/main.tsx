import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const root: HTMLElement | null = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found ');
}

createRoot(root).render(<App />);
