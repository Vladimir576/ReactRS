import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { fetchItems } from './services/itemService';
import { items } from './test-utils/items';

vi.mock('./services/itemService', () => ({
  fetchItems: vi.fn(),
}));

const fetchItemsMock = vi.mocked(fetchItems);

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    fetchItemsMock.mockReset();
  });

  it('loads saved search term from localStorage and fetches data', async () => {
    localStorage.setItem('searchTerm', 'rick');
    fetchItemsMock.mockResolvedValue(items);

    render(<App />);

    expect(await screen.findByDisplayValue('rick')).toBeInTheDocument();
    expect(fetchItemsMock).toHaveBeenCalledWith({ query: 'rick', page: 1 });
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('searches, trims value, saves it to localStorage and renders results', async () => {
    const user = userEvent.setup();
    fetchItemsMock.mockResolvedValueOnce([]).mockResolvedValueOnce(items);

    render(<App />);

    const input = await screen.findByRole('searchbox', { name: 'Search items' });
    await user.clear(input);
    await user.type(input, '  morty  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(fetchItemsMock).toHaveBeenLastCalledWith({ query: 'morty', page: 1 });
    });

    expect(localStorage.getItem('searchTerm')).toBe('morty');
    expect(await screen.findByText('Morty Smith')).toBeInTheDocument();
  });
});
