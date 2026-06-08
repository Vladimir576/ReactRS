import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileFormsPanel from './ProfileFormsPanel';
import { useProfileFormStore } from '../../store/profileFormStore';

const image = new File(['avatar'], 'avatar.png', { type: 'image/png' });

async function fillProfileForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Alice');
  await user.type(screen.getByLabelText('Age'), '30');
  await user.type(screen.getByLabelText('Email'), 'alice@example.com');
  await user.selectOptions(screen.getByLabelText('Gender'), 'female');
  await user.type(screen.getByLabelText('Country'), 'Kazakhstan');
  await user.upload(screen.getByLabelText('Profile image'), image);
  await user.type(screen.getByLabelText('Password'), 'Aa1!');
  await user.type(screen.getByLabelText('Confirm password'), 'Aa1!');
  await user.click(screen.getByLabelText('Accept Terms and Conditions'));
}

describe('ProfileFormsPanel', () => {
  beforeEach(() => {
    useProfileFormStore.getState().clearSubmissions();
  });

  it('submits uncontrolled form, closes modal and displays the tile', async () => {
    const user = userEvent.setup();

    render(<ProfileFormsPanel />);

    await user.click(screen.getByRole('button', { name: 'Open uncontrolled form' }));
    expect(
      screen.getByRole('dialog', { name: 'Uncontrolled profile form' })
    ).toBeInTheDocument();

    await fillProfileForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Uncontrolled profile form' })
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Uncontrolled')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Alice profile' })).toBeInTheDocument();
  });

  it('disables React Hook Form submit while invalid and submits valid data', async () => {
    const user = userEvent.setup();

    render(<ProfileFormsPanel />);

    await user.click(screen.getByRole('button', { name: 'Open React Hook Form' }));

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText('Name'), 'alice');

    expect(
      await screen.findByText('First letter must be uppercase')
    ).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await user.clear(screen.getByLabelText('Name'));
    await fillProfileForm(user);

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'React Hook Form profile' })).toBeNull();
    });

    expect(screen.getByText('React Hook Form')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});
