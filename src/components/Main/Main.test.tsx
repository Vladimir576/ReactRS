import { render, screen } from '@testing-library/react';
import Main from './Main';
import { items } from '../../test-utils/items';

const defaultProps = {
  searchTerm: '',
  loading: false,
  errorMessage: '',
  items,
  onSearch: vi.fn(),
  onRetry: vi.fn(),
};

describe('Main', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search controls and results', () => {
    render(<Main {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Top controls' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument();
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });
  it('shows error message', () => {
    render(
      <Main
        {...defaultProps}
        items={[]}
        errorMessage="Server is not available"
      />
    );

    expect(screen.getByText('Server is not available')).toBeInTheDocument();
  });
});
