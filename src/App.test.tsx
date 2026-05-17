import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { fetchItemById, fetchItems } from './services/itemService';
import { items } from './test-utils/items';

vi.mock('./services/itemService', () => ({
  fetchItems: vi.fn(),
  fetchItemById: vi.fn(),
}));

const fetchItemsMock = vi.mocked(fetchItems);
const fetchItemByIdMock = vi.mocked(fetchItemById);

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/#/');
    localStorage.clear();
    fetchItemsMock.mockReset();
    fetchItemByIdMock.mockReset();
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

  it('changes page and writes it to the URL', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/#/?page=2');
    fetchItemsMock.mockResolvedValue(items);

    render(<App />);

    expect(await screen.findByText('Page 2')).toBeInTheDocument();
    expect(fetchItemsMock).toHaveBeenCalledWith({ query: '', page: 2 });

    await user.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(fetchItemsMock).toHaveBeenLastCalledWith({ query: '', page: 3 });
    });

    expect(window.location.hash).toBe('#/?page=3');
  });

  it('opens and closes details panel', async () => {
    const user = userEvent.setup();
    let finishDetails: (item: (typeof items)[number]) => void = () => {};

    fetchItemsMock.mockResolvedValue(items);
    fetchItemByIdMock.mockReturnValue(
      new Promise((resolve) => {
        finishDetails = resolve;
      })
    );

    render(<App />);

    await user.click(await screen.findByRole('link', { name: /Rick Sanchez/i }));

    expect(window.location.hash).toBe('#/details/1?page=1');
    expect(screen.getByText('Loading details...')).toBeInTheDocument();

    await act(async () => {
      finishDetails(items[0]);
    });

    expect(await screen.findByRole('img', { name: 'Rick Sanchez' })).toHaveAttribute(
      'src',
      items[0].image
    );
    expect(await screen.findByText('ID: 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(window.location.hash).toBe('#/?page=1');
  });

  it('shows about page from navigation', async () => {
    const user = userEvent.setup();
    fetchItemsMock.mockResolvedValue(items);

    render(<App />);

    await user.click(screen.getByRole('link', { name: 'About' }));

    expect(screen.getByRole('heading', { name: 'About this app' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'RS School React course' })).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
  });

  it('shows not found page', () => {
    window.history.pushState({}, '', '/#/unknown-page');
    fetchItemsMock.mockResolvedValue(items);

    render(<App />);

    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
    expect(screen.getByText('Page was not found.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the app' })).toBeInTheDocument();
  });
});
