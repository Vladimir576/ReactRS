'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import {
  selectClearItems,
  selectItems,
  useSelectedItemsStore,
} from '../../store/selectedItemsStore';
import { downloadCsvFile } from '../../utils/downloadCsvFile';
import { generateCsv } from '../../actions/csv';
import './SelectedItemsFlyout.css';

export default function SelectedItemsFlyout() {
  const t = useTranslations();
  const selectedItems = useSelectedItemsStore(selectItems);
  const clearSelectedItems = useSelectedItemsStore(selectClearItems);
  const items = Object.values(selectedItems);
  const count = items.length;

  const [, formAction, isPending] = useActionState(
    async () => {
      try {
        const baseUrl = `${window.location.origin}${window.location.pathname}`;
        const csvText = await generateCsv(items, baseUrl);
        downloadCsvFile(csvText, `${count}_items.csv`);
        return null;
      } catch (error) {
        console.error('Failed to generate CSV:', error);
        return 'Failed to generate CSV';
      }
    },
    null
  );

  if (count === 0) {
    return null;
  }

  return (
    <aside className="selected-flyout" aria-label="Selected items actions">
      <p>
        {count} {t('nav.about')}
      </p>
      <div className="selected-flyout-actions">
        <button type="button" onClick={clearSelectedItems}>
          Unselect all
        </button>
        <form action={formAction}>
          <button type="submit" disabled={isPending}>
            {isPending ? t('export.exporting') : t('export.csv')}
          </button>
        </form>
      </div>
      {state && <p className="error">{state}</p>}
    </aside>
  );
}
