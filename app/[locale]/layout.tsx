'use client';

import type { ReactNode } from 'react';
import AppShell from '@/src/components/AppShell/AppShell';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { useThemeContext } from '@/src/context/useThemeContext';
import { useApplyTheme } from '@/src/hooks/useApplyTheme';

function LayoutContent({ children }: { children: ReactNode }) {
  const { theme } = useThemeContext();
  useApplyTheme(theme);

  return (
    <div className={`app-shell theme-${theme}`}>
      <AppShell>{children}</AppShell>
    </div>
  );
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  await params;

  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
}
