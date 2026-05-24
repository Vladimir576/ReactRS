import { useState } from 'react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import ErrorTester from '../ErrorTester/ErrorTester';
import Header from '../Header/Header';
import SelectedItemsFlyout from '../SelectedItemsFlyout/SelectedItemsFlyout';
import { useThemeContext } from '../../context/useThemeContext';
import { useApplyTheme } from '../../hooks/useApplyTheme';
import AppRoutes from '../../routes/AppRoutes';

export default function AppShell() {
  const [simulateError, setSimulateError] = useState(false);
  const { theme } = useThemeContext();

  useApplyTheme(theme);

  return (
    <div className={`app-shell theme-${theme}`}>
      <ErrorBoundary onReset={() => setSimulateError(false)}>
        <Header onTriggerError={() => setSimulateError(true)} />
        <AppRoutes />
        <SelectedItemsFlyout />
        <ErrorTester active={simulateError} />
      </ErrorBoundary>
    </div>
  );
}
