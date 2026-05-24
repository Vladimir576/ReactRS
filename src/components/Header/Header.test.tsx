import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { ThemeProvider } from '../../context/ThemeContext';

describe('Header', () => {
  it('renders page title and error button', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header onTriggerError={vi.fn()} />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByRole('heading', { name: 'Character Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Simulate App Error' })).toBeInTheDocument();
    expect(screen.getByLabelText('Theme')).toBeInTheDocument();
  });
});
