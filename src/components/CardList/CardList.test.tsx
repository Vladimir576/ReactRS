import { render, screen } from '@testing-library/react';
import CardList from './CardList';
import { items } from '../../test-utils/items';

describe('CardList', () => {
  it('renders all provided items', () => {
    render(<CardList items={items} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });
});
