import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  it('renders in a portal and closes with Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal title="Portal form" onClose={onClose}>
        <button type="button">First action</button>
      </Modal>
    );

    expect(screen.getByRole('dialog', { name: 'Portal form' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close modal' })).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on outside click and keeps inside clicks open', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal title="Click test" onClose={onClose}>
        <button type="button">Inside</button>
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: 'Inside' }));
    expect(onClose).not.toHaveBeenCalled();

    const backdrop = document.querySelector('.modal-backdrop');

    if (!(backdrop instanceof HTMLElement)) {
      throw new Error('Backdrop was not found');
    }

    await user.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
