'use server';

import type { Item } from '../types/types';

function makeCsvValue(value: string | number): string {
  const stringValue = String(value);
  return `"${stringValue.replaceAll('"', '""')}"`;
}

export async function generateCsv(
  items: Item[],
  baseUrl: string
): Promise<string> {
  const csvHeader = ['id', 'name', 'description', 'detailsUrl'].join(',');
  const csvRows = items.map((item) =>
    [
      makeCsvValue(item.id),
      makeCsvValue(item.name),
      makeCsvValue(item.description),
      makeCsvValue(`${baseUrl}/details/${item.id}`),
    ].join(',')
  );

  return [csvHeader, ...csvRows].join('\n');
}
