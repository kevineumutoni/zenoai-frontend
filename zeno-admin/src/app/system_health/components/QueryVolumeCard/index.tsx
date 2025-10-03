import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Run } from '../../../utils/types/runs';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface QueryVolumeCardProps {
  runs: Run[]; 
  dateRange: { start: Date | null; end: Date | null };
}

const QueryVolumeCard: React.FC<QueryVolumeCardProps> = ({ runs, dateRange }) => {
  const filteredRuns = runs.filter((run) => {
    if (!run.started_at) return false;
    const runDate = new Date(run.started_at);
    const { start, end } = dateRange;

    if (start && end) return runDate >= start && runDate <= end;
    if (start) return runDate >= start;
    if (end) return runDate <= end;
    return true;
  });

  const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const dailyCounts = dayKeys.reduce((acc, day) => ({ ...acc, [day]: 0 }), {} as Record<string, number>);
  filteredRuns.forEach((run) => {
    if (run.started_at) {
      const dayIndex = new Date(run.started_at).getDay();
      dailyCounts[dayKeys[dayIndex]] += 1;
    }
  });

  const dataPoints = dayKeys.map(day => dailyCounts[day]);
  const lineData = {
    labels: dayLabels,
    datasets: [
      {
        label: 'Queries',
        data: dataPoints,
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
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { display: false } },
      y: {
        grid: { display: false },
        ticks: {
          color: '#fff',
          font: { size: 12 },
          callback: (value: string | number) => value.toString(),
        },
      },
    },
  };

  return (
    <div className="2xl:p-6 p-3 lg:h-67 xl:h-85 2xl:h-115 rounded-xl border border-teal-500/30  shadow-lg">
      <h3 className="text-xl xl:text-2xl font-bold text-white mb-2">Database Query Volume</h3>
      <p className="text-sm xl:text-lg text-gray-400 mb-4">Weekly database queries</p>

      {filteredRuns.length > 0 ? (
        <div className="2xl:h-64 xl:h-40 lg:h-33 w-full">
          <Line data={lineData} options={options} />
        </div>
      ) : (
        <div className="2xl:h-64 xl:h-40 lg:h-30 flex items-center justify-center text-gray-500">No data for selected range</div>
      )}

      <div className="w-full flex justify-between px-6 mt-4">
        {dayLabels.map((day, index) => (
          <div
            key={index}
            className={`w-8 h-8 md:w-10 md:h-10 lg:w-5 lg:h-5 xl:w-10 xl:h-10 flex items-center justify-center text-xs md:text-sm font-medium text-white border border-teal-500/50 rounded-full transition-colors ${
              index === 0 || index === 6 ? 'bg-teal-500/30 ring-1 ring-teal-400' : 'bg-teal-500/20'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueryVolumeCard;