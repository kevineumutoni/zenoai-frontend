import React from 'react';
import { render, screen } from '@testing-library/react';
import AccuracyRateCard from '.'; 

const mockRuns = [
  {
    id: 1,
    started_at: '2025-09-10T10:00:00Z',
    final_output: 'Error: null value constraint violated',
  },
  {
    id: 2,
    started_at: '2025-09-12T12:00:00Z',
    final_output: 'Error: API limit exceeded',
  },
  {
    id: 3,
    started_at: '2025-09-15T15:00:00Z',
    final_output: 'Internal server error occurred',
  },
];

const dateRange = {
  start: new Date('2025-09-01'),
  end: new Date('2025-09-30'),
};

describe('AccuracyRateCard', () => {
  it('renders without crashing', () => {
    render(<AccuracyRateCard runs={[]} dateRange={dateRange} />);
    expect(screen.getByText(/Accuracy Rate/i)).toBeInTheDocument();
  });

  it('shows "No errors" when no error runs exist', () => {
    const cleanRuns = [{ id: 1, started_at: '2025-09-10T10:00:00Z', final_output: 'Success!' }];
    render(<AccuracyRateCard runs={cleanRuns} dateRange={dateRange} />);
    expect(screen.getByText(/No errors in selected range/i)).toBeInTheDocument();
  });

  it('shows 3 donut charts when errors exist', () => {
    render(<AccuracyRateCard runs={mockRuns} dateRange={dateRange} />);
    
    expect(screen.getByText(/Internal Server Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Database Error/i)).toBeInTheDocument();
    expect(screen.getByText(/API limit Error/i)).toBeInTheDocument();

    expect(screen.getAllByText(/\d+\.?\d*%/)).toHaveLength(3);
  });

  it('calculates percentages correctly', () => {
    render(<AccuracyRateCard runs={mockRuns} dateRange={dateRange} />);

    const percentages = screen.getAllByText(/\d+\.?\d*%/);
    percentages.forEach(pct => {
      expect(pct.textContent).toBe('33.3%');
    });
  });

  it('filters runs by date range', () => {
    const runs = [
      { id: 1, started_at: '2025-08-01T10:00:00Z', final_output: 'Error: internal' }, // ❌ outside range
      { id: 2, started_at: '2025-09-15T12:00:00Z', final_output: 'Error: internal' }, // ✅ inside range → classified as "internal"
    ];

    const range = {
      start: new Date('2025-09-01'),
      end: new Date('2025-09-30'),
    };

    render(<AccuracyRateCard runs={runs} dateRange={range} />);

    const percents = screen.getAllByText(/\d+\.?\d*%/);

    expect(percents[0].textContent).toBe('100%');

    expect(percents[1].textContent).toBe('0%');

    expect(percents[2].textContent).toBe('0%');

    expect(screen.getByText(/Internal Server Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Database Error/i)).toBeInTheDocument();
    expect(screen.getByText(/API limit Error/i)).toBeInTheDocument();
  });
});