import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

const viCompat = Object.assign(jest, {
  unstubAllGlobals: () => jest.restoreAllMocks(),
});

Object.assign(globalThis, { vi: viCompat });

Object.defineProperty(globalThis, 'fetch', {
  value: jest.fn(),
  writable: true,
  configurable: true,
});

jest.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
  useLocale: () => 'en',
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      'header.subtitle': 'Character search dashboard',
      'header.title': 'Character Search',
      'header.description': 'Find and manage characters',
      'nav.home': 'Home',
      'nav.about': 'About',
      'theme.label': 'Theme',
      'theme.light': 'Light',
      'theme.dark': 'Dark',
      'errors.trigger': 'Simulate App Error',
      'search.label': 'Search items',
      'search.placeholder': 'Search items',
      'search.button': 'Search',
    };

    return messages[key] ?? key;
  },
}));

jest.mock('@/i18n/navigation', () => ({
  Link: 'a',
  redirect: jest.fn(),
  usePathname: () => '/en',
  useRouter: () => ({ push: jest.fn() }),
}));

const storage = new Map<string, string>();

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => {
      storage.clear();
    },
  },
  configurable: true,
});
