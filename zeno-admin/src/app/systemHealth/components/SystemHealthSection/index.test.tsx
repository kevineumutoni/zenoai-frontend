import React from 'react';
import { render, screen } from '@testing-library/react';
import SystemHealthSection from '.';

describe('SystemHealthSection', () => {
  const mockRuns = [
    { id: 1, status: 'completed', started_at: '2025-09-10T10:00:00Z', completed_at: '2025-09-10T10:01:00Z' },
    { id: 2, status: 'completed', started_at: '2025-09-11T10:00:00Z', completed_at: '2025-09-11T10:00:00Z' },
    { id: 3, status: 'failed', started_at: '2025-09-12T10:00:00Z', completed_at: '2025-09-12T10:02:30Z' },
  ];

  test('renders all metric cards with correct titles', () => {
    render(<SystemHealthSection runs={mockRuns} />);
    expect(screen.getByText(/Avg. Response Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Error Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Database Queries/i)).toBeInTheDocument();
  });

  test('calculates average response time correctly', () => {
    render(<SystemHealthSection runs={mockRuns} />);
    expect(screen.getByText('30.00s')).toBeInTheDocument();
  });

  test('calculates error rate correctly', () => {
    render(<SystemHealthSection runs={mockRuns} />);
    const failed = mockRuns.filter(r => r.status === 'failed').length;
    const completed = mockRuns.filter(r => r.status === 'completed' && r.started_at && r.completed_at);
    const totalRelevant = completed.length + failed;
    const expectedErrorRate = totalRelevant > 0
      ? ((failed / totalRelevant) * 100).toFixed(2) + '%'
      : '0%';

    expect(screen.getByText(expectedErrorRate)).toBeInTheDocument();
    expect(screen.getByText(`${failed} failed / ${totalRelevant} total`)).toBeInTheDocument();
  });

  test('shows total number of queries formatted correctly', () => {
    render(<SystemHealthSection runs={mockRuns} />);
    const totalQueriesValue = mockRuns.length.toLocaleString();
    expect(screen.getByText(totalQueriesValue)).toBeInTheDocument();
  });
});
