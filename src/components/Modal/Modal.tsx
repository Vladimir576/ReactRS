import { type ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

const focusableSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
].join(',');

export default function Modal({ title, children, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousActiveElement.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusableElements =
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
    focusableElements?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return;
      }

      const elements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      );

      if (elements.length === 0) {
        return;
      }

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('modal-open');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
      previousActiveElement.current?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        aria-modal="true"
        aria-labelledby="profile-form-modal-title"
        className="modal-panel"
        ref={dialogRef}
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="profile-form-modal-title">{title}</h2>
          <button
            aria-label="Close modal"
            className="modal-close"
            type="button"
            onClick={onClose}
          >
            x
          </button>
        </header>
        {children}
      </div>
    </div>,
    document.body
  );
}
