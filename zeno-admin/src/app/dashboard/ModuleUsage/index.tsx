

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
      <section className="xl:h-12/13 rounded-2xl bg-[#15213B] shadow-xl xl:p-8 w-full flex items-center justify-center
        lg:max-w-[220px] lg:p-2 lg:shadow-sm lg:rounded-lg lg:h-[120px]"
        style={{ maxWidth: 500, minHeight: 200 }}>
        <div className="text-center w-full">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-[#A1B1D6] text-base lg:text-xs">Loading module usage...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="xl:h-12/13 rounded-2xl bg-[#15213B] shadow-xl xl:p-8 w-full  flex items-center justify-center
        lg:max-w-[220px] lg:p-2 lg:shadow-sm lg:rounded-lg lg:h-[120px]"
        style={{ maxWidth: 500, minHeight: 200 }}>
        <div className="text-center w-full">
          <div className="bg-red-600 text-white xl:p-4 lg:p-2 rounded-lg xl:mb-4 lg:mb-2">
            <h2 className="text-lg font-bold xl:mb-2 lg:text-base lg:mb-1">Error</h2>
            <p className="text-xs lg:text-[10px]">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="2xl:h-13/13 xl:h-13/13 rounded-2xl bg-[#15213B] xl:shadow-xl w-full
    xl:p-4 lg:p-2 lg:shadow-sm lg:rounded-lg lg:h-[180px] "
      style={{ maxWidth: 500 }}>
      <h2 className="2xl:text-4xl xl:text-2xl font-semibold text-white 2xl:mb-2 xl:mb-2 lg:text-base lg:mb-1">Module Usage</h2>
      <p className="2xl:text-lg xl:mb-7  lg:text-xs lg:mb-1">Percent usage for each agent</p>
      <ul className="2xl:space-y-6 xl:space-y-4 lg:space-y-2">
        {Object.entries(subAgent).map(([key, meta]) => (
          <li key={key} className="flex justify-between items-center text-white xl:text-lg xl:text-xl lg:text-xs">
            <span>
              {meta.label}
            </span>
            <span className="2xl:font-semibold  xl:font-normal text-2xl lg:text-md" style={{ color: meta.color }}>
              {total > 0 ? Math.round((counts[key as keyof typeof counts] / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}


