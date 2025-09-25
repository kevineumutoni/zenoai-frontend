import React from 'react';
import { render, screen } from '@testing-library/react';
import UsageAnalyticsCard from './index';

jest.mock('../../hooks/useFetchSteps', () => ({
  useFetchAnalytics: jest.fn(),
}));

import { useFetchAnalytics } from '../../hooks/useFetchSteps';

describe('UsageAnalyticsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (useFetchAnalytics as jest.Mock).mockReturnValue({
      steps: null,
      isLoading: true,
      error: null,
    });

    render(<UsageAnalyticsCard />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useFetchAnalytics as jest.Mock).mockReturnValue({
      steps: null,
      isLoading: false,
      error: 'Failed to fetch data',
    });

    render(<UsageAnalyticsCard />);
    expect(screen.getByText(/Failed to fetch data/i)).toBeInTheDocument();
  });

  it('renders correct percentages when data is present', () => {
    const mockSteps = [
      { step_id: 1, agent: 28 }, 
      { step_id: 2, agent: 22 }, 
      { step_id: 3, agent: 27 },
      { step_id: 4, agent: 28 }, 
      { step_id: 5, agent: 28 }, 
    ];
    (useFetchAnalytics as jest.Mock).mockReturnValue({
      steps: mockSteps,
      isLoading: false,
      error: null,
    });

    render(<UsageAnalyticsCard />);
    expect(screen.getByText(/Comparative Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Scenario Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/Trade Forecast/i)).toBeInTheDocument();

    expect(screen.getByText(/60%/i)).toBeInTheDocument(); 
    const percent20s = screen.getAllByText(/20%/i);
    expect(percent20s).toHaveLength(2); 
  });

  it('renders 0% if total is zero', () => {
    (useFetchAnalytics as jest.Mock).mockReturnValue({
      steps: [],
      isLoading: false,
      error: null,
    });

    render(<UsageAnalyticsCard />);
    expect(screen.getAllByText(/0%/i)).toHaveLength(3);
  });
});