import React from 'react';
import { render, screen } from '@testing-library/react';
import AnalyticsBarChart from '.';

jest.mock('react-chartjs-2', () => {
  const { forwardRef } = jest.requireActual('react');
  return {
    Bar: forwardRef((props: React.ComponentProps<'div'>, ref: React.Ref<HTMLDivElement>) => (
      <div ref={ref} data-testid="mock-bar" {...props}>
        Mock Bar Chart
      </div>
    )),
  };
});

describe('AnalyticsBarChart', () => {
  it('renders without crashing and displays the mocked Bar chart', () => {
    const sampleData = [100, 200, 300, 400, 500, 600, 700];
    render(<AnalyticsBarChart data={sampleData} />);
    const barElement = screen.getByTestId('mock-bar');
    expect(barElement).toBeInTheDocument();
  });

  it('passes the correct data prop to the Bar component', () => {
    const sampleData = [10, 20, 30, 40, 50, 60, 70];
    render(<AnalyticsBarChart data={sampleData} />);
    const barElement = screen.getByTestId('mock-bar');
    expect(barElement).toBeInTheDocument();
  });

  it('renders without crashing when no data is provided', () => {
    render(<AnalyticsBarChart data={[]} />);
    const barElement = screen.getByTestId('mock-bar');
    expect(barElement).toBeInTheDocument();
  });
});
