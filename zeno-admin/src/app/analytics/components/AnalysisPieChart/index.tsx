'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
  ChartData,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useRef } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AnalyticsPieChartProps {
  data: { [key: string]: number };
}

export default function AnalyticsPieChart({ data }: AnalyticsPieChartProps) {
  const chartRef = useRef<ChartJS<'pie'>>(null);

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  const chartData: ChartData<'pie', number[], string> = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data).map(v => (total > 0 ? (v / total) * 100 : 0)),
        backgroundColor: ['#e11d48', '#f97316', '#22d3ee'],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white',
          font: { size: 12 },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          label: (context: TooltipItem<'pie'>) => {
            const label = context.label || '';
            const value = context.raw as number;
            return `${label}: ${value.toFixed(1)}%`;
          },
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div className="h-full w-full flex flex-col">
      <Pie ref={chartRef} data={chartData} options={options} />
      <div className="text-2xl  text-white flex justify-end">Total: {total}</div>
    </div>
  );
}
