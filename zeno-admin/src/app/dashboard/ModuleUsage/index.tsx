'use client';

import { useFetchAnalytics } from "../../hooks/useFetchSteps";

const agentNames: Record<number, 'comparative' | 'scenario' | 'forecast'> = {
  28: "comparative",
  22: "scenario",
  27: "forecast"
};

const subAgent: Record<'comparative' | 'scenario' | 'forecast', { label: string; color: string }> = {
  comparative: {
    label: "Comparative Analysis",
    color: "#e11d48",
  },
  scenario: {
    label: "Scenario Explorer",
    color: "#f97316",
  },
  forecast: {
    label: "Trade Forecast",
    color: "#22d3ee",
  }
};

export default function UsageAnalyticsCard() {
  const { steps, isLoading, error } = useFetchAnalytics();

  const counts: Record<'comparative' | 'scenario' | 'forecast', number> = {
    comparative: 0,
    scenario: 0,
    forecast: 0,
  };

  if (steps) {
    steps.forEach(step => {
      const agentKey = agentNames[step.agent as number];
      if (agentKey) {
        counts[agentKey]++;
      }
    });
  }

  const total = counts.comparative + counts.scenario + counts.forecast;

  if (isLoading) {
    return (
      <section className="lg:h-12/13 rounded-2xl bg-[#15213B] shadow-xl p-8 w-full h-9/10 flex items-center justify-center" style={{ maxWidth: 500, minHeight: 200 }}>
        <div className="text-center w-full">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-[#A1B1D6] text-base">Loading module usage...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="lg:h-12/13 rounded-2xl bg-[#15213B] shadow-xl p-8 w-full h-9/10 flex items-center justify-center" style={{ maxWidth: 500, minHeight: 200 }}>
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
    <section className="lg:h-12/13 rounded-2xl bg-[#15213B] shadow-xl p-8 w-full h-9/10" style={{ maxWidth: 500 }}>
      <h2 className="2xl:text-4xl lg:text-2xl font-semibold text-white mb-2">Module Usage</h2>
      <p className="2xl:text-lg mb-7">Percent usage for each agent</p>
      <ul className="2xl:space-y-6 lg:space-y-7">
        {Object.entries(subAgent).map(([key, meta]) => (
          <li key={key} className="flex justify-between items-center text-white lg:text-lg 2xl:text-xl">
            <span>
              {meta.label}
            </span>
            <span className="2xl:font-semibold lg:font-normal  text-2xl" style={{ color: meta.color }}>
              {total > 0 ? Math.round((counts[key as keyof typeof counts] / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}