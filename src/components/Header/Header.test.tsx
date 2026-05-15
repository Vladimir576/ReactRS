import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders page title and error button', () => {
    render(<Header onTriggerError={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Search for products' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Simulate App Error' })).toBeInTheDocument();
  });
});
