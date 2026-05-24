import { render, screen } from '@testing-library/react';
import Card from './Card';
import { items } from '../../test-utils/items';

describe('Card', () => {
  it('shows item name and description', () => {
    render(
      <Card item={items[0]} checked={false} onSelectChange={vi.fn()} />
    );

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByText('Human - Alive - Male')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Select Rick Sanchez' })).toBeInTheDocument();
  });
});
