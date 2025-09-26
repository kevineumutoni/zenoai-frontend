'use client';
import { Step } from '../../../utils/types/steps';
import AnalyticsPieChart from '../AnalysisPieChart';

interface AnalyticsPieChartCardProps {
  steps: Step[];
  dateRange: { start: Date | null; end: Date | null };
}

export default function AnalyticsPieChartCard({ steps, dateRange }: AnalyticsPieChartCardProps) {

  const filteredSteps = steps.filter(step => {
    if (!step.created_at) return false;
    const stepDate = new Date(step.created_at);
    const { start, end } = dateRange;

    if (start && end) return stepDate >= start && stepDate <= end;
    if (start) return stepDate >= start;
    if (end) return stepDate <= end;
    return true;
  });

  const moduleUsage = {
    'Trade Forecast': 0,
    'Scenario Explorer': 0,
    'Comparative Analysis': 0,
  };

  filteredSteps.forEach(step => {
    if (step.type !== 'sub_agent_call') return;
    const func = step.content?.function || '';

    if (func.includes('TradeForecast') || func.includes('trade_forecast')) {
      moduleUsage['Trade Forecast'] += 1;
    } else if (func.includes('Scenario') || func.includes('scenario')) {
      moduleUsage['Scenario Explorer'] += 1;
    } else if (func.includes('RAGRetrieval') || func.includes('compare')) {
      moduleUsage['Comparative Analysis'] += 1;
    }
  });

  return (
    <div className=" border border-teal-400/30 rounded-xl p-6">
      <h3 className="text-xl xl:text-3xl font-semibold text-white mb-2">Module Usage</h3>
      <p className="text-sm xl:text-xl text-gray-300 mb-10">Most frequent used specialized modules.</p>
      <div className="h-60 flex items-center">
        <AnalyticsPieChart data={moduleUsage} />
      </div>
    </div>
  );
}