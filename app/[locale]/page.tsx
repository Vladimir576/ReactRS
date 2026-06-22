'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { createAppQueryClient } from '@/src/query/queryConfig';
import HomePage from './home';

export default function Page() {
  const queryClient = createAppQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>
  );
}
