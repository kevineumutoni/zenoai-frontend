import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface QueryVolumeCardProps {
  runs: any[];
  dateRange: { start: Date | null; end: Date | null };
}

const QueryVolumeCard: React.FC<QueryVolumeCardProps> = ({ runs, dateRange }) => {
  const filteredRuns = runs.filter((run: any) => {
    if (!run.started_at) return false;
    const runDate = new Date(run.started_at);

    if (dateRange.start && dateRange.end) {
      return runDate >= dateRange.start && runDate <= dateRange.end;
    }

    if (dateRange.start && !dateRange.end) {
      return runDate >= dateRange.start;
    }

    if (!dateRange.start && dateRange.end) {
      return runDate <= dateRange.end;
    }

    return true;
  });

  const dailyCounts: { [key: string]: number } = {
    S: 0,
    M: 0,
    T: 0,
    W: 0,
    Th: 0,
    F: 0,
    Sat: 0,
  };

  filteredRuns.forEach((run: any) => {
    if (run.started_at) {
      const date = new Date(run.started_at);
      const day = date.getDay();
      const days = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sat'];
      const dayKey = days[day];
      dailyCounts[dayKey] += 1;
    }
  });

  const lineData = {
    labels: ['S', 'M', 'T', 'W', 'Th', 'F', 'Sat'],
    datasets: [
      {
        label: 'Queries',
        data: Object.values(dailyCounts),
        borderColor: '#00C4CC',
        backgroundColor: 'rgba(0, 196, 204, 0.3)',
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#fff',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#fff',
          font: {
            size: 12,
          },
          callback: function(value: string | number) {
            return value.toString();
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-teal-500/30 shadow-lg ">
      <h3 className="text-xl xl:text-2xl font-bold text-teal-400 mb-2">Database Query Volume</h3>
      <p className="text-sm xl:text-lg text-gray-400 mb-4">Weekly database queries</p>

      {filteredRuns.length > 0 ? (
        <div className="h-64">
          <Line data={lineData} options={options} />
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">No data for selected range</div>
      )}

      <div className="flex justify-center mt-4 space-x-4">
        {['S', 'M', 'T', 'W', 'Th', 'F', 'Sat'].map((day) => (
          <div key={day} className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center text-xs text-white bg-teal-500/20 border border-teal-500/50 rounded-full">
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueryVolumeCard;