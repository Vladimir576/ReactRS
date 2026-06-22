import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Main from './Main';
import { items } from '../../test-utils/items';

const defaultProps = {
  searchTerm: '',
  loading: false,
  refreshing: false,
  errorMessage: '',
  items,
  page: 1,
  selectedItemId: null,
  onSearch: vi.fn(),
  onRetry: vi.fn(),
  onPageChange: vi.fn(),
  onSelectItem: vi.fn(),
  onCloseDetails: vi.fn(),
};

function renderMain(props = defaultProps) {
  return render(<Main {...props} />);
}

describe('Main', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search controls and results', () => {
    renderMain();

    expect(
      screen.getByRole('heading', { name: 'Who are you interested in?' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument();
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });
  it('shows error message', () => {
    renderMain({
      ...defaultProps,
      items: [],
      errorMessage: 'Server is not available',
    });

    expect(screen.getByText('Server is not available')).toBeInTheDocument();
  });

  it('calls page change from pagination', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    renderMain({
      ...defaultProps,
      onPageChange,
    });

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  });
});
