import { render, screen } from '@testing-library/react';
import AnalyticsBarChartCard from './index';
import { Step } from '../../../utils/types/steps';

jest.mock('../AnalysisBarChart', () => {
  return {
    __esModule: true,
    default: function MockBarChart(props: any) {
      if (!props.data) return <div data-testid="mock-bar-chart">No data</div>;
      const total = props.data.reduce((sum: number, val: number) => sum + val, 0);
      return <div data-testid="mock-bar-chart">Chart with {total} total requests</div>;
    }
  };
});

describe('AnalyticsBarChartCard', () => {
  const mockSteps: Step[] = [
    {

      step_id: 1,
      conversation: 123,
      step_order: 1,
      type: 'sub_agent_call' as const,
      tool: null,
      agent: 5,
      created_at: '2025-09-15T10:00:00Z',
      content: { function: 'TradeForecastAgent.run()' },
    },
    {
      step_id: 2,
      conversation: 124,
      step_order: 2,
      type: 'sub_agent_call' as const,
      tool: null,
      agent: 5,
      created_at: '2025-09-16T10:00:00Z',
      content: { function: 'ScenarioAnalysisAgent.invoke()' },
    },
    {
      step_id: 3,
      conversation: 125,
      step_order: 3,
      type: 'sub_agent_call' as const,
      tool: null,
      agent: 5,
      created_at: '2025-09-21T10:00:00Z',
      content: { function: 'RAGRetrievalAgent.execute()' },
    },
  ];

  const mockDateRange = {
    start: new Date('2025-09-14T00:00:00Z'),
    end: new Date('2025-09-21T23:59:59Z'),
  };

  it('renders without crashing', () => {
    render(<AnalyticsBarChartCard steps={mockSteps} dateRange={mockDateRange} />);

    expect(screen.getByText('Agent Usage')).toBeInTheDocument();
    expect(screen.getByText('Total incoming requests per week.')).toBeInTheDocument();
  });

  it('renders 7 day labels', () => {
    render(<AnalyticsBarChartCard steps={mockSteps} dateRange={mockDateRange} />);

    const dayLabels = screen.getAllByText(/^[SMTWF]$/);
    expect(dayLabels).toHaveLength(7);
  });

  it('passes correct data to bar chart', () => {
    render(<AnalyticsBarChartCard steps={mockSteps} dateRange={mockDateRange} />);

    const chartElement = screen.getByTestId('mock-bar-chart');
    expect(chartElement).toHaveTextContent('Chart with 3 total requests');
  });

  it('filters steps by date range', () => {
    const narrowDateRange = {
      start: new Date('2025-09-15T00:00:00Z'),
      end: new Date('2025-09-16T23:59:59Z'),
    };

    render(<AnalyticsBarChartCard steps={mockSteps} dateRange={narrowDateRange} />);

    const chartElement = screen.getByTestId('mock-bar-chart');
    expect(chartElement).toHaveTextContent('Chart with 2 total requests');
  });

  it('handles steps with no created_at', () => {
    const stepsWithMissingDate = [
      ...mockSteps,
      {
        ...mockSteps[0],
        id: 4,
        created_at: '',
        content: { function: 'TradeForecastAgent.run()' },
      },
    ];

    render(<AnalyticsBarChartCard steps={stepsWithMissingDate} dateRange={mockDateRange} />);

    const chartElement = screen.getByTestId('mock-bar-chart');
    expect(chartElement).toHaveTextContent('Chart with 3 total requests');
  });

  it('only counts sub_agent_call steps', () => {
    const mixedSteps = [
      ...mockSteps,
      {
        ...mockSteps[0],
        id: 4,
        type: 'thought' as const,
        created_at: '2025-09-17T10:00:00Z',
        content: { function: 'SomeOtherFunction()' },
      },
    ];

    render(<AnalyticsBarChartCard steps={mixedSteps} dateRange={mockDateRange} />);

    const chartElement = screen.getByTestId('mock-bar-chart');
    expect(chartElement).toHaveTextContent('Chart with 3 total requests');
  });
});