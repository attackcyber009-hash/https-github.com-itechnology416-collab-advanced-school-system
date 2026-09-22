/**
 * Browser file download and export utility.
 * Triggers genuine file downloads without third-party dependencies or mock alerts.
 */

export function downloadFile(content: string, filename: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 150);
}

export function exportToCsv(rows: Record<string, any>[], filename: string) {
  if (!rows || rows.length === 0) {
    downloadFile('No data available to export', filename, 'text/csv');
    return;
  }

  const headers = Object.keys(rows[0]);
  const csvLines: string[] = [];

  // Header line
  csvLines.push(headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','));

  // Data lines
  for (const row of rows) {
    const line = headers.map((header) => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvLines.push(line.join(','));
  }

  downloadFile(csvLines.join('\r\n'), filename.endsWith('.csv') ? filename : `${filename}.csv`, 'text/csv;charset=utf-8');
}
