import { render, screen } from '@testing-library/react';
import AnalyticsPieChartCard from './index';
import { Step } from '../../../utils/types/steps';

jest.mock('../AnalysisPieChart', () => {
  return {
    __esModule: true,
    default: ({ data }: { data: { [key: string]: number } }) => (
      <div data-testid="mock-pie-chart">
        <div>Trade Forecast: {data['Trade Forecast']}</div>
        <div>Scenario Explorer: {data['Scenario Explorer']}</div>
        <div>Comparative Analysis: {data['Comparative Analysis']}</div>
      </div>
    ),
  };
});

describe('AnalyticsPieChartCard', () => {
  const mockSteps: Step[] = [
    {
      step_id: 1,
      conversation: 123,
      step_order: 1,
      type: 'sub_agent_call',
      tool: null,
      agent: 27,
      created_at: '2025-09-15T10:00:00Z',
      content: { function: 'TradeForecastAgent.run()' },
    },
    {
      step_id: 2,
      conversation: 124,
      step_order: 2,
      type: 'sub_agent_call',
      tool: null,
      agent: 22,
      created_at: '2025-09-16T10:00:00Z',
      content: { function: 'ScenarioAnalysisAgent.invoke()' },
    },
    {
      step_id: 3,
      conversation: 125,
      step_order: 3,
      type: 'sub_agent_call',
      tool: null,
      agent: 28,
      created_at: '2025-09-17T10:00:00Z',
      content: { function: 'RAGRetrievalAgent.execute()' },
    },
    {
      step_id: 4,
      conversation: 126,
      step_order: 4,
      type: 'sub_agent_call',
      tool: null,
      agent: 27,
      created_at: '2025-09-18T10:00:00Z',
      content: { function: 'TradeForecastAgent.run()' },
    },
  ];

  const mockDateRange = {
    start: new Date('2025-09-14T00:00:00Z'),
    end: new Date('2025-09-21T23:59:59Z'),
  };

  it('renders without crashing', () => {
    render(<AnalyticsPieChartCard steps={mockSteps} dateRange={mockDateRange} />);
    expect(screen.getByText('Module Usage')).toBeInTheDocument();
    expect(screen.getByText('Most frequent used specialized modules.')).toBeInTheDocument();
  });

  it('passes correct module usage data to pie chart', () => {
    render(<AnalyticsPieChartCard steps={mockSteps} dateRange={mockDateRange} />);
    expect(screen.getByText('Trade Forecast: 2')).toBeInTheDocument();
    expect(screen.getByText('Scenario Explorer: 1')).toBeInTheDocument();
    expect(screen.getByText('Comparative Analysis: 1')).toBeInTheDocument();
  });

  it('filters steps by date range', () => {
    const narrowDateRange = {
      start: new Date('2025-09-15T00:00:00Z'),
      end: new Date('2025-09-15T23:59:59Z'),
    };
    render(<AnalyticsPieChartCard steps={mockSteps} dateRange={narrowDateRange} />);
    expect(screen.getByText('Trade Forecast: 1')).toBeInTheDocument();
    expect(screen.getByText('Scenario Explorer: 0')).toBeInTheDocument();
    expect(screen.getByText('Comparative Analysis: 0')).toBeInTheDocument();
  });

  it('only counts sub_agent_call steps', () => {
    render(<AnalyticsPieChartCard steps={mockSteps} dateRange={mockDateRange} />);
    expect(screen.getByText('Trade Forecast: 2')).toBeInTheDocument();
    expect(screen.getByText('Scenario Explorer: 1')).toBeInTheDocument();
    expect(screen.getByText('Comparative Analysis: 1')).toBeInTheDocument();
  });

  it('handles steps with no created_at', () => {
    const stepsWithMissingDate = [
      ...mockSteps,
      {
        ...mockSteps[0],
        step_id: 5,
        created_at: '',
        content: { function: 'TradeForecastAgent.run()' },
      },
    ];
    render(<AnalyticsPieChartCard steps={stepsWithMissingDate} dateRange={mockDateRange} />);
    expect(screen.getByText('Trade Forecast: 2')).toBeInTheDocument();
    expect(screen.getByText('Scenario Explorer: 1')).toBeInTheDocument();
    expect(screen.getByText('Comparative Analysis: 1')).toBeInTheDocument();
  });

  it('handles steps with empty content object', () => {
    const stepsWithEmptyContent = [
      ...mockSteps,
      {
        ...mockSteps[0],
        step_id: 6,
        content: {},
      },
    ];
    render(<AnalyticsPieChartCard steps={stepsWithEmptyContent} dateRange={mockDateRange} />);
    expect(screen.getByText('Trade Forecast: 3')).toBeInTheDocument();
    expect(screen.getByText('Scenario Explorer: 1')).toBeInTheDocument();
    expect(screen.getByText('Comparative Analysis: 1')).toBeInTheDocument();
  });
});