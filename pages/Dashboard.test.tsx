import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Dashboard } from './Dashboard';
import { mockAnalysisData } from '../data/mockAnalysisData';

describe('Dashboard Component', () => {
  it('should render all summary cards with correct data', () => {
    render(<Dashboard data={mockAnalysisData} />);

    // Check for summary card titles and values
    expect(screen.getByText('Mizan')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();

    expect(screen.getByText('Bilanço')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    expect(screen.getByText('Gelir-Gider')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    expect(screen.getByText('Vergi Analizi')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    
    expect(screen.getByText('KKEG')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should render all chart cards with correct titles', () => {
    render(<Dashboard data={mockAnalysisData} />);
    
    // Check for chart titles
    expect(screen.getByText('Aktif-Pasif Yapısı')).toBeInTheDocument();
    expect(screen.getByText('Gelir-Gider Analizi')).toBeInTheDocument();
    expect(screen.getByText('Kârlılık Trend Analizi')).toBeInTheDocument();
  });
});