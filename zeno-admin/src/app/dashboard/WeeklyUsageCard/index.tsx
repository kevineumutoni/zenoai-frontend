'use client';

import { useFetchAnalytics } from "../../hooks/useFetchSteps";
import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

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
    return { date: dateStr, comparative: counts.comparative, scenario: counts.scenario, forecast: counts.forecast};
  });

  if (isLoading) {
    return (
      <section className="rounded-2xl bg-[#15213B] shadow-xl w-full p-6 xl:px-8 xl:pt-8 xl:pb-2 flex items-center justify-center" style={{ minHeight: 250 }}>
        <div className="text-center w-full">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-[#A1B1D6] text-base">Loading weekly analytics...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-[#15213B] shadow-xl w-full p-6 xl:px-8 xl:pt-8 xl:pb-2 flex items-center justify-center" style={{ minHeight: 250 }}>
        <div className="text-center w-full">
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
            <h2 className="text-lg font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-[#15213B] shadow-xl w-full p-6 xl:px-8 xl:pt-8 xl:pb-2">
      <h2 className="2xl:text-4xl lg:text-2xl font-semibold text-white mb-2">
        Weekly Analytics
      </h2>
      <p className="2xl:text-lg lg:text-base text-white mb-3 mt-3">
        Steps per agent for the last 7 days
      </p>
      <div className="w-full h-64 ">
        <ResponsiveContainer width="80%" height="100%">
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
    </section>
  );
}