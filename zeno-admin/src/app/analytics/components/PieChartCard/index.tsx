'use client';
import { Step } from '../../../utils/types/steps';
import AnalyticsPieChart from '../AnalysisPieChart';

const agentNames: Record<number, 'Trade Forecast' | 'Scenario Explorer' | 'Comparative Analysis'> = {
  28: 'Comparative Analysis',
  22: 'Scenario Explorer',
  27: 'Trade Forecast',
};

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
    const moduleKey = agentNames[step.agent as number];
    if (moduleKey) {
      moduleUsage[moduleKey] += 1;
    }
  });

  return (
    <div className="border border-teal-400/30 rounded-xl p-6
      lg:rounded-lg lg:h-[260px] 2xl:h-[450px] xl:h-[400px]">
      <h3 className="text-xl xl:text-3xl font-semibold text-white mb-2
        lg:mb-1 ">
        Module Usage
      </h3>
      <p className="text-sm xl:text-xl text-gray-300 mb-10
        lg:text-xs lg:mb-1">
        Most frequent used specialized modules.
      </p>
      <div className="h-60 flex items-center
        lg:h-[110px] xl:h-[240] 2xl:h-[260px] pt-5 2xl:pt-10">
        <AnalyticsPieChart data={moduleUsage} />
      </div>
    </div>
  );
}


