import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

describe('Header', () => {
  it('renders page title and error button', () => {
    render(
      <MemoryRouter>
        <Header onTriggerError={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Character Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Simulate App Error' })).toBeInTheDocument();
  });
});
