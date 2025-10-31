const convertToCSV = (data: any[], headers: { key: string; label: string }[]): string => {
    const headerRow = headers.map(h => `"${h.label}"`).join(',');
    const rows = data.map(row => {
        return headers.map(header => {
            let cell = row[header.key] === null || row[header.key] === undefined ? '' : row[header.key];
            if (typeof cell === 'string') {
                cell = cell.replace(/"/g, '""'); // Escape double quotes
            }
            return `"${cell}"`;
        }).join(',');
    });
    return [headerRow, ...rows].join('\n');
};

export const exportToCsv = (filename: string, data: any[], headers: { key: string; label: string }[]) => {
    if (!data || data.length === 0) {
        console.error("No data available to export.");
        return;
    }

    // \uFEFF for BOM to ensure Excel opens UTF-8 CSVs correctly
    const csvString = convertToCSV(data, headers);
    const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' }); 

    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
