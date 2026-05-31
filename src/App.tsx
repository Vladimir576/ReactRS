import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import './App.css';
import AppShell from './components/AppShell/AppShell';
import { ThemeProvider } from './context/ThemeContext';
import { createAppQueryClient } from './query/queryConfig';

export default function App() {
  const [queryClient] = useState(createAppQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <HashRouter>
          <AppShell />
        </HashRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
