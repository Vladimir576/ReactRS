'use client';

import type { ReactNode } from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loading from '../Loading/Loading';

interface StatusWrapperProps {
  children: ReactNode;
  errorMessage: string;
  isLoading: boolean;
  onRetry: () => void;
}

export default function StatusWrapper({
  children,
  errorMessage,
  isLoading,
  onRetry,
}: StatusWrapperProps) {
  if (isLoading) {
    return <Loading />;
  }

  if (errorMessage) {
    return <ErrorMessage message={errorMessage} onRetry={onRetry} />;
  }

  return children;
}
