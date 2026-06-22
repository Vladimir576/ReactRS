import type { Item } from '../types/types';

function makeCsvValue(value: string | number) {
  const stringValue = String(value);

  return `"${stringValue.replaceAll('"', '""')}"`;
}

export function makeSelectedItemsCsv(items: Item[], baseUrl: string) {
  const csvHeader = ['id', 'name', 'description', 'detailsUrl'].join(',');
  const csvRows = items.map((item) =>
    [
      makeCsvValue(item.id),
      makeCsvValue(item.name),
      makeCsvValue(item.description),
      makeCsvValue(`${baseUrl}#/details/${item.id}`),
    ].join(',')
  );

  return [csvHeader, ...csvRows].join('\n');
}
