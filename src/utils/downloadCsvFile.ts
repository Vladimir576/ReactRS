export function downloadCsvFile(csvText: string, fileName: string) {
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = url;
  downloadLink.download = fileName;
  downloadLink.click();
  URL.revokeObjectURL(url);
}
