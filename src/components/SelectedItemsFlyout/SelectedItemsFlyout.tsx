import {
  selectClearItems,
  selectItems,
  useSelectedItemsStore,
} from '../../store/selectedItemsStore';
import { downloadCsvFile } from '../../utils/downloadCsvFile';
import { makeSelectedItemsCsv } from '../../utils/selectedItemsCsv';
import './SelectedItemsFlyout.css';

export default function SelectedItemsFlyout() {
  const selectedItems = useSelectedItemsStore(selectItems);
  const clearSelectedItems = useSelectedItemsStore(selectClearItems);
  const items = Object.values(selectedItems);
  const count = items.length;

  if (count === 0) {
    return null;
  }

  function handleDownloadClick() {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const csvText = makeSelectedItemsCsv(items, baseUrl);

    downloadCsvFile(csvText, `${count}_items.csv`);
  }

  return (
    <aside className="selected-flyout" aria-label="Selected items actions">
      <p>{count} selected</p>
      <div className="selected-flyout-actions">
        <button type="button" onClick={clearSelectedItems}>
          Unselect all
        </button>
        <button type="button" onClick={handleDownloadClick}>
          Download
        </button>
      </div>
    </aside>
  );
}
