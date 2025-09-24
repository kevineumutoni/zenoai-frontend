import React from 'react';
import { render, screen } from '@testing-library/react';
import WeeklyAnalyticsLineChart from '.';

jest.mock('../../hooks/useFetchSteps', () => ({
  useFetchAnalytics: jest.fn(),
}));

import { useFetchAnalytics } from '../../hooks/useFetchSteps';

describe('WeeklyAnalyticsLineChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useFetchAnalytics as jest.Mock).mockReturnValue({
      steps: null,
      isLoading: true,
      error: null,
    });

    render(<WeeklyAnalyticsLineChart />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useFetchAnalytics as jest.Mock).mockReturnValue({
      steps: null,
      isLoading: false,
      error: 'Failed to fetch analytics',
    });

    render(<WeeklyAnalyticsLineChart />);
    expect(screen.getByText(/Failed to fetch analytics/i)).toBeInTheDocument();
  });

  it('renders the chart title and subtitle, handles no steps', () => {
    (useFetchAnalytics as jest.Mock).mockReturnValue({
      steps: [],
      isLoading: false,
      error: null,
    });

    render(<WeeklyAnalyticsLineChart />);
    expect(screen.getByText(/Weekly Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Steps per agent for the last 7 days/i)).toBeInTheDocument();
  });

  it('renders chart area for provided steps', () => {
    const today = new Date();
    const formatDate = (offset: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - offset);
      return d.toISOString();
    };
    const mockSteps = [
      { step_id: 1, agent: 28, created_at: formatDate(0) },
      { step_id: 2, agent: 22, created_at: formatDate(1) },
      { step_id: 3, agent: 27, created_at: formatDate(2) },
      { step_id: 4, agent: 28, created_at: formatDate(2) },
    ];
    (useFetchAnalytics as jest.Mock).mockReturnValue({
      steps: mockSteps,
      isLoading: false,
      error: null,
    });

    render(<WeeklyAnalyticsLineChart />);
    expect(screen.getByText(/Weekly Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Steps per agent for the last 7 days/i)).toBeInTheDocument();
  });

  it('does not include steps data older than 7 days in chart', () => {
    const today = new Date();
    const formatDate = (offset: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - offset);
      return d.toISOString();
    };
    const mockSteps = [
      { step_id: 1, agent: 28, created_at: formatDate(0) },  
      { step_id: 2, agent: 22, created_at: formatDate(1) },   
      { step_id: 3, agent: 27, created_at: formatDate(20) }, 
    ];
    (useFetchAnalytics as jest.Mock).mockReturnValue({
      steps: mockSteps,
      isLoading: false,
      error: null,
    });

    render(<WeeklyAnalyticsLineChart />);
    expect(screen.getByText(/Weekly Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Steps per agent for the last 7 days/i)).toBeInTheDocument();
  });
});
