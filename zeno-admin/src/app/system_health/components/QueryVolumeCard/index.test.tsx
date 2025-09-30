import React from 'react';
import { render, screen } from '@testing-library/react';
import QueryVolumeCard from '.';
import { Run } from '../../../utils/types/runs';

const mockRuns = [
  { id: 1, started_at: '2025-09-14T10:00:00Z' },
  { id: 2, started_at: '2025-09-15T10:00:00Z' },
  { id: 3, started_at: '2025-09-15T11:00:00Z' },
  { id: 4, started_at: '2025-09-17T10:00:00Z' },
] as unknown as Run[];
  

describe('QueryVolumeCard', () => {
  it('renders title, subtitle, chart and weekday labels when data exists', () => {
    render(
      <QueryVolumeCard
        runs={mockRuns}
        dateRange={{ start: new Date('2025-09-13'), end: new Date('2025-09-19') }}
      />
    );

    expect(screen.getByText('Database Query Volume')).toBeInTheDocument();
    expect(screen.getByText('Weekly database queries')).toBeInTheDocument();

    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => {
      expect(screen.getAllByText(day).length).toBeGreaterThan(0);
    });

    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('renders no data message when no runs in range', () => {
    render(
      <QueryVolumeCard
        runs={mockRuns}
        dateRange={{ start: new Date('2000-01-01'), end: new Date('2000-01-02') }}
      />
    );

    expect(screen.getByText('No data for selected range')).toBeInTheDocument();
  });
});
