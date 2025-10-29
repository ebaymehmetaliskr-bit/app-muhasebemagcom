import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercent } from './formatters';

describe('formatCurrency', () => {
  it('should format a positive number correctly', () => {
    // Non-breaking space is used by Intl.NumberFormat
    expect(formatCurrency(12345.67)).toMatch(/₺12.345,67/);
  });

  it('should format a negative number with parentheses', () => {
    expect(formatCurrency(-9876.54)).toMatch(/\(₺9.876,54\)/);
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toMatch(/₺0,00/);
  });

  it('should format a large number correctly', () => {
    expect(formatCurrency(123456789.12)).toMatch(/₺123.456.789,12/);
  });
  
  it('should handle infinite values gracefully', () => {
    expect(formatCurrency(Infinity)).toBe('N/A');
    expect(formatCurrency(-Infinity)).toBe('N/A');
  });

  it('should handle NaN values gracefully', () => {
    expect(formatCurrency(NaN)).toBe('N/A');
  });
});

describe('formatPercent', () => {
  it('should format a positive percentage correctly', () => {
    expect(formatPercent(25.12345)).toBe('25.12%');
  });

  it('should format a negative percentage correctly', () => {
    expect(formatPercent(-50.5)).toBe('-50.50%');
  });

  it('should format zero percent correctly', () => {
    expect(formatPercent(0)).toBe('0.00%');
  });

  it('should handle infinite values', () => {
    expect(formatPercent(Infinity)).toBe('N/A');
    expect(formatPercent(-Infinity)).toBe('N/A');
  });

  it('should handle NaN values', () => {
    expect(formatPercent(NaN)).toBe('N/A');
  });
});