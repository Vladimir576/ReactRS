import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Header from './Header';
import { ThemeProvider } from '../../context/ThemeContext';

const messages = {
  nav: {
    home: 'Home',
    about: 'About',
  },
  header: {
    subtitle: 'Powered by React',
    title: 'Character Search',
    description: 'Use the search field to find information about the character you are interested in.',
  },
  theme: {
    label: 'Theme',
    light: 'Light',
    dark: 'Dark',
  },
  errors: {
    trigger: 'Simulate App Error',
  },
};

describe('Header', () => {
  it('renders page title and error button', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <ThemeProvider>
          <Header onTriggerError={() => {}} />
        </ThemeProvider>
      </NextIntlClientProvider>
    );

    expect(screen.getByRole('heading', { name: 'Character Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Simulate App Error' })).toBeInTheDocument();
    expect(screen.getByLabelText('Theme')).toBeInTheDocument();
  });
});
