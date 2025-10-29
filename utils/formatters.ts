export const formatCurrency = (value: number): string => {
    if (!isFinite(value) || isNaN(value)) {
        return 'N/A';
    }
    const options = { style: 'currency', currency: 'TRY' };
    const formatted = new Intl.NumberFormat('tr-TR', options).format(value);
    // Use accounting format for negative numbers (e.g., (₺123.45))
    return value < 0 ? `(${formatted.replace('-', '')})` : formatted;
};

export const formatPercent = (value: number): string => {
    if (!isFinite(value) || isNaN(value)) {
        return 'N/A';
    }
    return `${value.toFixed(2)}%`;
};