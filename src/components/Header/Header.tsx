'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useThemeContext } from '@/src/context/useThemeContext';
import './Header.css';

interface HeaderProps {
  onTriggerError: () => void;
}

export default function Header({ onTriggerError }: HeaderProps) {
  const { theme, changeTheme } = useThemeContext();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale !== locale) {
      const newPathname = pathname.replace(/^\/[a-z]{2}/, '');
      router.push(newPathname || '/', { locale: newLocale });
    }
  };

  return (
    <header className="app-header">
      <div className="page-title">
        <p className="subtitle">{t('header.subtitle')}</p>
        <h1>{t('header.title')}</h1>
        <p className="main-title">{t('header.description')}</p>
      </div>
      <div className="header-actions">
        <nav className="main-nav">
          <a href={`/${locale}`}>{t('nav.home')}</a>
          <a href={`/${locale}/about`}>{t('nav.about')}</a>
        </nav>
        <div className="locale-select">
          <label htmlFor="locale-picker">Language</label>
          <select
            id="locale-picker"
            value={locale}
            onChange={(event) => handleLocaleChange(event.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <label className="theme-select-label">
          {t('theme.label')}
          <select
            value={theme}
            onChange={(event) =>
              changeTheme(event.target.value as typeof theme)
            }
          >
            <option value="light">{t('theme.light')}</option>
            <option value="dark">{t('theme.dark')}</option>
          </select>
        </label>
        <button
          type="button"
          className="error-trigger"
          onClick={onTriggerError}
        >
          {t('errors.trigger')}
        </button>
      </div>
    </header>
  );
}
