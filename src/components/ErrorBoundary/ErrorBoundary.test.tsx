import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

function BrokenChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Broken child');
  }

  return null;
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('catches an error and shows fallback UI', () => {
    render(
      <ErrorBoundary>
        <BrokenChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('heading', { name: 'Something went wrong.' })).toBeInTheDocument();
    expect(screen.getByText('Broken child')).toBeInTheDocument();
  });

  it('calls reset handler from fallback UI', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(
      <ErrorBoundary onReset={onReset}>
        <BrokenChild shouldThrow={true} />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
