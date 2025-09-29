'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useRef } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AnalyticsBarChartProps {
  data: number[];
}

export default function AnalyticsBarChart({ data }: AnalyticsBarChartProps) {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const chartData = {
    labels: dayLabels,
    datasets: [
      {
        label: 'Agent Requests',
        data,
        backgroundColor: '#ffffff', 
        borderColor: '#22d3ee', 
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          display:false,
        },
      },
      y: {
        beginAtZero: true,
        max: 800,
        ticks: {
          stepSize: 200,
          color: '#ffffff',
          font: { size: 12 },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    animation: {
      duration: 800,
    },
  };

  return <Bar ref={chartRef} data={chartData} options={options} className="h-full w-full" />;
}