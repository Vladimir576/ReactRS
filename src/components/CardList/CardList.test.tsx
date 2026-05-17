import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CardList from './CardList';
import { items } from '../../test-utils/items';

describe('CardList', () => {
  it('renders all provided items', () => {
    render(
      <MemoryRouter>
        <CardList items={items} />
      </MemoryRouter>
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });
});
