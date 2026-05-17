import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Main from './Main';
import { items } from '../../test-utils/items';

const defaultProps = {
  searchTerm: '',
  loading: false,
  errorMessage: '',
  items,
  onSearch: vi.fn(),
  onRetry: vi.fn(),
  page: 1,
  onPageChange: vi.fn(),
  hasDetails: false,
};

function renderMain(props = defaultProps) {
  return render(
    <MemoryRouter>
      <Main {...props} />
    </MemoryRouter>
  );
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

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });
});
