'use client';

import { useFetchAnalytics } from "../../hooks/useFetchSteps";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

function getLast7Days(): string[] {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    days.push(day.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }));
  }
  return days;
}

const agentNames: Record<number, 'comparative' | 'scenario' | 'forecast'> = {
  28: "comparative",
  22: "scenario",
  27: "forecast"
};

export default function WeeklyAnalyticsLineChart() {
  const { steps, isLoading, error } = useFetchAnalytics();
  const last7Days = getLast7Days();

  const chartData = last7Days.map(dateStr => {
    const counts: Record<'comparative' | 'scenario' | 'forecast', number> = {
      comparative: 0,
      scenario: 0,
      forecast: 0,
    };

    if (steps) {
      steps.forEach(step => {
        const stepDate = new Date(step.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        const agentKey = agentNames[step.agent as number];
        if (stepDate === dateStr && agentKey) {
          counts[agentKey] += 1;
        }
      });
    }
    return { date: dateStr, comparative: counts.comparative, scenario: counts.scenario, forecast: counts.forecast };
  });

  if (isLoading) {
    return (
      <section className="w-full max-w-[700px] rounded-2xl bg-[#15213B] shadow-xl xl:p-8 p-8 flex items-center justify-center" style={{ minHeight: 300 }}>
        <div className="text-center w-full">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-[#A1B1D6] text-base xl:text-xs">Loading weekly analytics...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-[700px] rounded-2xl bg-[#15213B] shadow-xl xl:p-8 p-8 flex items-center justify-center" style={{ minHeight: 300 }}>
        <div className="text-center w-full">
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4 xl:p-2 xl:mb-2">
            <h2 className="text-lg font-bold mb-2 xl:text-base xl:mb-1">Error</h2>
            <p className="text-xs xl:text-[10px]">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[780px] 2xl:rounded-2xl lg:rounded-lg  bg-[#15213B] shadow-xl lg:p-2 xl:p-4" style={{ minHeight: 200 }}>
      <h2 className="2xl:text-4xl xl:text-2xl font-semibold text-white 2xl:mb-2 xl:mb-2">Weekly Analytics</h2>
      <p className="2xl:text-lg xl:text-base text-white 2xl:mb-7 xl:mb-4 mb-6">
        Steps per agent for the last 7 days
      </p>
      <div className="w-full mt-2">
        <div className="w-full h-[220px] lg:h-[180px] xl:h-[180px] 2xl:h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#A1B1D6" />
              <XAxis dataKey="date" stroke="#A1B1D6" />
              <YAxis stroke="#A1B1D6" allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ color: "#A1B1D6", fontWeight: 400 }} />
              <Line type="monotone" dataKey="comparative" stroke="#e11d48" name="Comparative Analysis" dot={{ stroke: '#e11d48', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="scenario" stroke="#f97316" name="Scenario Explorer" dot={{ stroke: '#f97316', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="forecast" stroke="#22d3ee" name="Trade Forecast" dot={{ stroke: '#22d3ee', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}