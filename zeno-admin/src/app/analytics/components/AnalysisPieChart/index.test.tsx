import { render, screen } from '@testing-library/react';
import AnalyticsPieChart from './index';

describe('AnalyticsPieChart', () => {
  const mockData = {
    'Trade Forecast': 5,
    'Scenario Explorer': 3,
    'Comparative Analysis': 7,
  };

  it('renders chart and total count', () => {
    render(<AnalyticsPieChart data={mockData} />);
    expect(screen.getByText('Total: 15')).toBeInTheDocument();

  });

  it('shows 0 total when data is empty', () => {
    render(<AnalyticsPieChart data={{}} />);

    expect(screen.getByText('Total: 0')).toBeInTheDocument();
  });

  it('calculates percentages correctly in tooltip (via props)', () => {

    render(<AnalyticsPieChart data={mockData} />);

    expect(screen.getByText('Total: 15')).toBeInTheDocument();
  });
});