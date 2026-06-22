'use client';

import { createContext } from 'react';

export type AppTheme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: AppTheme;
  changeTheme: (theme: AppTheme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
