import React from 'react';
import { Run } from '../../../utils/types/runs';

interface AccuracyRateCardProps {
  runs: Run[];
  dateRange: { start: Date | null; end: Date | null };
}

interface ErrorBreakdown {
  internal: number;
  database: number;
  apiLimit: number;
}

const AccuracyRateCard: React.FC<AccuracyRateCardProps> = ({ runs, dateRange }) => {
  const filteredRuns = runs.filter((run) => {
    if (!run.started_at) return false;
    const runDate = new Date(run.started_at);
    if (dateRange.start && dateRange.end) return runDate >= dateRange.start && runDate <= dateRange.end;
    if (dateRange.start) return runDate >= dateRange.start;
    if (dateRange.end) return runDate <= dateRange.end;
    return true;
  });

  const errorBreakdown: ErrorBreakdown = filteredRuns.reduce(
    (acc: ErrorBreakdown, run: Run) => {
      const output = (run.final_output ?? '').toLowerCase();
      if (output.includes('error')) {
        if (output.includes('null value') || output.includes('constraint')) acc.database += 1;
        else if (output.includes('limit')) acc.apiLimit += 1;
        else acc.internal += 1;
      }
      return acc;
    },
    { internal: 0, database: 0, apiLimit: 0 }
  );

  const totalErrors = errorBreakdown.internal + errorBreakdown.database + errorBreakdown.apiLimit;
  const getPercentage = (count: number) => (totalErrors > 0 ? ((count / totalErrors) * 100).toFixed(1) : "0.0");

  const CHART_COLOR = "rgb(260, 120, 120)";

  const DonutChart = ({ percentage, label }: { percentage: string; label: string }) => {
    const pct = parseFloat(percentage);
    const radius = 55;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (pct / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto lg:mx-0  xl:mx-auto lg:w-30 lg:h-40 2xl:h-50 2xl:w-50">
          <circle
            cx="80" 
            cy="80"
            r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth="5"
            opacity="0.3"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={CHART_COLOR}
            strokeWidth="5" 
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
          />
          <text
            x="80"
            y="80"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="20" 
            fontWeight="bold"
            fill="white"
          >
            {pct}%
          </text>
        </svg>
        <p className="text-lg text-gray-400 mt-2 text-center max-w-32 font-bolder">{label}</p> 
      </div>
    );
  };

  return (
    <div className=" p-4 rounded-xl border border-teal-500/30 shadow-lg sm:p-5 md:p-6">
      <h3 className="text-xl xl:text-2xl font-bold text-teal-400 mb-2">Accuracy Rate</h3>
      <p className="text-sm xl:text-lg text-gray-400 mb-4">Breakdown of query by module</p>

      {totalErrors > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <DonutChart percentage={getPercentage(errorBreakdown.internal)} label="Internal Server Error" />
          <DonutChart percentage={getPercentage(errorBreakdown.database)} label="Database Error" />
          <DonutChart percentage={getPercentage(errorBreakdown.apiLimit)} label="API limit Error" />
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6">No errors in selected range</div>
      )}

      <div className="flex justify-center mt-20 text-xs text-gray-400">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-300 mr-1 "></div>
          <span>Error Occurrence</span>
        </div>
      </div>
    </div>
  );
};

export default AccuracyRateCard;