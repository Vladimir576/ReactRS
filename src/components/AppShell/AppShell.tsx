'use client';

import { useState, type ReactNode } from 'react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import ErrorTester from '../ErrorTester/ErrorTester';
import Header from '../Header/Header';
import SelectedItemsFlyout from '../SelectedItemsFlyout/SelectedItemsFlyout';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [simulateError, setSimulateError] = useState(false);

  return (
    <>
      <ErrorBoundary onReset={() => setSimulateError(false)}>
        <Header onTriggerError={() => setSimulateError(true)} />
        {children}
        <SelectedItemsFlyout />
        <ErrorTester active={simulateError} />
      </ErrorBoundary>
    </>
  );
}
