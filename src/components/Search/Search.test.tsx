import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';

describe('Search', () => {
  it('renders input and button with the given value', () => {
    render(<Search value="rick" loading={false} onSearch={vi.fn()} />);

    expect(screen.getByRole('searchbox', { name: 'Search items' })).toHaveValue('rick');
    expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled();
  });

  it('updates the input and submits the typed value', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<Search value="" loading={false} onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: 'Search items' });
    await user.type(input, 'morty');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(input).toHaveValue('morty');
    expect(onSearch).toHaveBeenCalledWith('morty');
  });
});
