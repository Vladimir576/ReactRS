import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { fetchItemById, fetchItems } from './services/itemService';
import { useSelectedItemsStore } from './store/selectedItemsStore';
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
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    useSelectedItemsStore.setState({ selectedItems: {} });
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
    await waitFor(() => {
      expect(input).toBeEnabled();
    });
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

  it('reuses cached list data when returning to a previously loaded page', async () => {
    const user = userEvent.setup();
    fetchItemsMock.mockResolvedValue(items);

    render(<App />);

    expect(await screen.findByText('Page 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(fetchItemsMock).toHaveBeenCalledWith({ query: '', page: 2 });
    });

    await user.click(screen.getByRole('button', { name: 'Previous' }));

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });
    expect(fetchItemsMock).toHaveBeenCalledTimes(2);
  });

  it('reuses cached search query pages when returning to them', async () => {
    const user = userEvent.setup();
    fetchItemsMock.mockResolvedValue(items);

    render(<App />);

    const input = await screen.findByRole('searchbox', { name: 'Search items' });
    await waitFor(() => {
      expect(input).toBeEnabled();
    });

    await user.clear(input);
    await user.type(input, 'rick');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(fetchItemsMock).toHaveBeenCalledWith({ query: 'rick', page: 1 });
    });

    await user.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(fetchItemsMock).toHaveBeenCalledWith({ query: 'rick', page: 2 });
    });

    await user.click(screen.getByRole('button', { name: 'Previous' }));

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });
    expect(fetchItemsMock).toHaveBeenCalledTimes(3);
  });

  it('manually refreshes list data by invalidating the active query', async () => {
    const user = userEvent.setup();
    fetchItemsMock.mockResolvedValue(items);

    render(<App />);

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    await waitFor(() => {
      expect(fetchItemsMock).toHaveBeenCalledTimes(2);
    });
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

    await user.click(await screen.findByRole('button', { name: /Rick Sanchez/i }));

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

  it('reuses cached details data when reopening the same item', async () => {
    const user = userEvent.setup();
    fetchItemsMock.mockResolvedValue(items);
    fetchItemByIdMock.mockResolvedValue(items[0]);

    render(<App />);

    await user.click(await screen.findByRole('button', { name: /Rick Sanchez/i }));
    expect(await screen.findByText('ID: 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    await user.click(await screen.findByRole('button', { name: /Rick Sanchez/i }));

    expect(await screen.findByText('ID: 1')).toBeInTheDocument();
    expect(fetchItemByIdMock).toHaveBeenCalledTimes(1);
  });

  it('manually refreshes details data by invalidating the active details query', async () => {
    const user = userEvent.setup();
    fetchItemsMock.mockResolvedValue(items);
    fetchItemByIdMock.mockResolvedValue(items[0]);

    render(<App />);

    await user.click(await screen.findByRole('button', { name: /Rick Sanchez/i }));
    expect(await screen.findByText('ID: 1')).toBeInTheDocument();

    const detailsRefreshButton = screen.getAllByRole('button', { name: 'Refresh' })[1];

    if (!detailsRefreshButton) {
      throw new Error('Details refresh button was not found');
    }

    await user.click(detailsRefreshButton);

    await waitFor(() => {
      expect(fetchItemByIdMock).toHaveBeenCalledTimes(2);
    });
  });

  it('shows invalid details message for a wrong item id', async () => {
    window.history.pushState({}, '', '/#/details/wrong-id?page=2');
    fetchItemsMock.mockResolvedValue(items);

    render(<App />);

    expect(await screen.findByText('Item was not found.')).toBeInTheDocument();
    expect(fetchItemByIdMock).not.toHaveBeenCalled();
  });

  it('shows details loading error when item details request fails', async () => {
    const user = userEvent.setup();
    fetchItemsMock.mockResolvedValue(items);
    fetchItemByIdMock.mockRejectedValue(new Error('Details request failed'));

    render(<App />);

    await user.click(await screen.findByRole('button', { name: /Rick Sanchez/i }));

    expect(await screen.findByText('Item details could not be loaded.')).toBeInTheDocument();
  });

  it('shows dashboard loading error and retries the request', async () => {
    const user = userEvent.setup();
    fetchItemsMock
      .mockRejectedValueOnce(new Error('Dashboard request failed'))
      .mockResolvedValueOnce(items);

    render(<App />);

    expect(await screen.findByText("Something went wrong. We couldn't process your request. Please try again later.")).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try Again' }));

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(fetchItemsMock).toHaveBeenCalledTimes(2);
  });

  it('selects with checkbox without opening details', async () => {
    const user = userEvent.setup();
    fetchItemsMock.mockResolvedValue(items);

    render(<App />);

    await user.click(await screen.findByRole('checkbox', { name: 'Select Rick Sanchez' }));

    expect(screen.getByRole('checkbox', { name: 'Select Rick Sanchez' })).toBeChecked();
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    expect(fetchItemByIdMock).not.toHaveBeenCalled();
    expect(window.location.hash).not.toContain('/details/');
  });

  it('opens details from card click without changing selection', async () => {
    const user = userEvent.setup();
    fetchItemsMock.mockResolvedValue(items);
    fetchItemByIdMock.mockResolvedValue(items[0]);

    render(<App />);

    await user.click(await screen.findByRole('button', { name: /Rick Sanchez/i }));

    expect(window.location.hash).toBe('#/details/1?page=1');
    expect(screen.getByRole('checkbox', { name: 'Select Rick Sanchez' })).not.toBeChecked();
    expect(screen.queryByText('1 selected')).not.toBeInTheDocument();
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

  it('keeps selected item after navigation and unselects it', async () => {
    const user = userEvent.setup();
    fetchItemsMock.mockResolvedValue(items);

    render(<App />);

    await user.click(await screen.findByRole('checkbox', { name: 'Select Rick Sanchez' }));

    expect(screen.getByText('1 selected')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'About' }));

    expect(screen.getByText('1 selected')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Unselect all' }));

    expect(screen.queryByText('1 selected')).not.toBeInTheDocument();
  });

  it('switches theme with context control', async () => {
    const user = userEvent.setup();
    fetchItemsMock.mockResolvedValue(items);

    render(<App />);

    await user.selectOptions(screen.getByLabelText('Theme'), 'dark');

    expect(document.querySelector('.app-shell')).toHaveClass('theme-dark');
  });

  it('downloads selected items as csv', async () => {
    const user = userEvent.setup();
    const createdCsvBlobs: Blob[] = [];
    const createdLinks: HTMLAnchorElement[] = [];
    const createObjectURLMock = vi.fn((blob: Blob) => {
      createdCsvBlobs.push(blob);

      return 'blob:test';
    });
    const revokeObjectURLMock = vi.fn();
    const clickMock = vi.fn();
    const realCreateElement = document.createElement.bind(document);

    fetchItemsMock.mockResolvedValue(items);
    Object.defineProperty(URL, 'createObjectURL', {
      value: createObjectURLMock,
      configurable: true,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: revokeObjectURLMock,
      configurable: true,
    });
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = realCreateElement(tagName);

      if (tagName === 'a') {
        const anchorElement = element as HTMLAnchorElement;

        createdLinks.push(anchorElement);
        anchorElement.click = clickMock;
      }

      return element;
    });

    render(<App />);

    await user.click(await screen.findByRole('checkbox', { name: 'Select Rick Sanchez' }));
    await user.click(screen.getByRole('button', { name: 'Download' }));

    expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob));
    const csvDownloadLink = createdLinks.find((link) => link.href === 'blob:test');

    expect(csvDownloadLink?.download).toBe('1_items.csv');
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:test');

    const csvBlob = createdCsvBlobs[0];

    if (!csvBlob) {
      throw new Error('CSV Blob was not created');
    }

    const csvText = await csvBlob.text();

    expect(csvText).toContain('id,name,description,detailsUrl');
    expect(csvText).toContain('"Rick Sanchez"');
    expect(csvText).toContain('"Human - Alive - Male"');
    expect(csvText).toContain('#/details/1');
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
