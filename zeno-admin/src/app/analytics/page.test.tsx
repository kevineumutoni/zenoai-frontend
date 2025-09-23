import React from 'react';
import { render, screen } from '@testing-library/react';
import AnalyticsPage from './page';

jest.mock('../hooks/useFetchSteps', () => ({
  useFetchAnalytics: jest.fn(),
}));

import { useFetchAnalytics } from '../hooks/useFetchSteps';

describe('AnalyticsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (useFetchAnalytics as jest.Mock).mockReturnValue({
      steps: null,
      isLoading: true,
      error: null,
    });

    render(<AnalyticsPage />);
    expect(screen.getByText(/Loading analytics data/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useFetchAnalytics as jest.Mock).mockReturnValue({
      steps: null,
      isLoading: false,
      error: 'Failed to fetch data',
    });

    render(<AnalyticsPage />);
    expect(screen.getByText(/Failed to fetch data/i)).toBeInTheDocument();
  });

  it('renders no data message when steps is null', () => {
    (useFetchAnalytics as jest.Mock).mockReturnValue({
      steps: null,
      isLoading: false,
      error: null,
    });

    render(<AnalyticsPage />);
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  it('renders analytics components when data is present', () => {
    const mockSteps = [
      {
        step_id: 1,
        conversation: 1,
        step_order: 1,
        type: 'sub_agent_call',
        tool: null,
        agent: 1,
        created_at: '2025-09-15T10:00:00Z',
        content: { function: 'TradeForecastAgent.run()' },
      },
    ];

    (useFetchAnalytics as jest.Mock).mockReturnValue({
      steps: mockSteps,
      isLoading: false,
      error: null,
    });

    render(<AnalyticsPage />);

    expect(screen.getByText(/Usage Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Agent and Module Usage/i)).toBeInTheDocument();
    expect(screen.getByText(/Agent Usage/i)).toBeInTheDocument();

    const moduleUsageElements = screen.getAllByText(/Module Usage/i);
    expect(moduleUsageElements.length).toBeGreaterThan(0);
  });
});
