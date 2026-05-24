import { useEffect } from 'react';
import type { AppTheme } from '../context/themeContextData';

export function useApplyTheme(theme: AppTheme) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);
}
