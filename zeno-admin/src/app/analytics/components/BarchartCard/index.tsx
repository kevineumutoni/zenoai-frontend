'use client';
import { Step } from '../../../utils/types/steps';
import AnalyticsBarChart from '../AnalysisBarChart';

interface AnalyticsBarChartCardProps {
  steps: Step[];
  dateRange: { start: Date | null; end: Date | null };
}

export default function AnalyticsBarChartCard({ steps, dateRange }: AnalyticsBarChartCardProps) {
  const filteredSteps = steps.filter(step => {
    if (!step.created_at) return false;
    const stepDate = new Date(step.created_at);
    const { start, end } = dateRange;

    if (start && end) return stepDate >= start && stepDate <= end;
    if (start) return stepDate >= start;
    if (end) return stepDate <= end;
    return true;
  });

  const weeklyRequests = Array(7).fill(0);
  filteredSteps.forEach(step => {
    if (step.type === 'sub_agent_call') {
      const date = new Date(step.created_at);
      const dayIndex = date.getUTCDay();
      weeklyRequests[dayIndex] += 1;
    }
  });

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className=" border border-teal-400/30 rounded-xl p-6 xl:p-2 2xl:p-8 lg:rounded-lg lg:h-[260px] 2xl:h-[450px] xl:h-[400px]">
      <h3 className="text-xl xl:text-3xl font-semibold text-white">Agent Usage</h3>
      <p className="text-sm xl:text-xl text-gray-300 m-2">Total incoming requests per week.</p>
      <div className="h-78 lg:h-[130px]        xl:h-[240] 2xl:h-[260px] pt-5 2xl:pt-10">
        <AnalyticsBarChart data={weeklyRequests} />
      </div>

      <div className="w-full flex justify-between px-8 mt-4 lg:px-3 lg:mt-2 ">
        {dayLabels.map((day, index) => (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center text-xs xl:font-medium lg:font-small text-white border border-teal-500/50 rounded-full transition-colors lg:w-5 lg:h-5 lg:text-[10px] ${
           index===4 || index === 6
                ? 'bg-teal-500/30 ring-1 ring-teal-400'
                : 'bg-teal-500/20'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}