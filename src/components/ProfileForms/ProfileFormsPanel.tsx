import { useCallback, useState } from 'react';
import Modal from '../Modal/Modal';
import HookProfileForm from './HookProfileForm';
import './ProfileForms.css';
import UncontrolledProfileForm from './UncontrolledProfileForm';
import ProfileSubmissions from './ProfileSubmissions';

type ActiveForm = 'uncontrolled' | 'hook' | null;

export default function ProfileFormsPanel() {
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const closeModal = useCallback(() => setActiveForm(null), []);
  const openUncontrolledForm = useCallback(
    () => setActiveForm('uncontrolled'),
    []
  );
  const openHookForm = useCallback(() => setActiveForm('hook'), []);

  return (
    <section className="forms-section" aria-labelledby="forms-section-title">
      <div className="forms-header">
        <div>
          <h2 id="forms-section-title">Profile submissions</h2>
          <p>Open either implementation and submit a complete profile.</p>
        </div>
        <div className="forms-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={openUncontrolledForm}
          >
            Open uncontrolled form
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={openHookForm}
          >
            Open React Hook Form
          </button>
        </div>
      </div>

      <ProfileSubmissions />

      {activeForm === 'uncontrolled' && (
        <Modal title="Uncontrolled profile form" onClose={closeModal}>
          <UncontrolledProfileForm onCancel={closeModal} onSuccess={closeModal} />
        </Modal>
      )}

      {activeForm === 'hook' && (
        <Modal title="React Hook Form profile" onClose={closeModal}>
          <HookProfileForm onCancel={closeModal} onSuccess={closeModal} />
        </Modal>
      )}
    </section>
  );
}
