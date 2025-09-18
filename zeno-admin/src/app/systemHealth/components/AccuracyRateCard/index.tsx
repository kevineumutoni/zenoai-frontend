import React from 'react';

interface AccuracyRateCardProps {
  runs: any[];
  dateRange: { start: Date | null; end: Date | null };
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

  const errorBreakdown = filteredRuns.reduce(
    (acc, run) => {
      const output = run.final_output?.toLowerCase() || '';
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

  const DonutChart = ({ percentage, label, color }: { percentage: string; label: string; color: string }) => {
    const pct = parseFloat(percentage);
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (pct / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#1f2937" strokeWidth="10" opacity-30="true" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="bold" fill="white">
            {pct}%
          </text>
        </svg>
        <p className="text-xs text-gray-400 mt-1">{label}</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-teal-500/30 shadow-lg sm:p-5 md:p-6 lg:mx-15 2xl:mx-0">
      <h3 className="text-xl xl:text-2xl font-bold text-teal-400 mb-2">Accuracy Rate</h3>
      <p className="text-sm xl:text-lg text-gray-400 mb-4">Breakdown of query by module</p>
      {totalErrors > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DonutChart percentage={getPercentage(errorBreakdown.internal)} label="Internal Server Error" color="#ef4444" />
          <DonutChart percentage={getPercentage(errorBreakdown.database)} label="Database Error" color="#3b82f6" />
          <DonutChart percentage={getPercentage(errorBreakdown.apiLimit)} label="API limit Error" color="#f59e0b" />
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">No errors in selected range</div>
      )}
      <div className="flex mt-4 text-xs text-gray-400 flex-column">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div><span>Error Occurrence</span>
        <div className="w-3 h-3 rounded-full bg-blue-500 ml-3 mr-1"></div><span>Accurate Responses</span>
      </div>
    </div>
  );
};

export default AccuracyRateCard;