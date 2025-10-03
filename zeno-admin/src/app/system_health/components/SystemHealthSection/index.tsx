import MetricCard from '../MetricCard';
import { FaStopwatch, FaExclamationTriangle, FaDatabase } from 'react-icons/fa';
import { Run } from '../../../utils/types/runs';

interface SystemHealthSectionProps {
  runs: Run[];
}

const SystemHealthSection: React.FC<SystemHealthSectionProps> = ({ runs }) => {
  const completed = runs.filter(r => r.status === 'completed' && r.started_at && r.completed_at);
  const avgMs = completed.reduce(
    (sum, r) =>
      sum +
      Math.max(
        0,
        new Date(r.completed_at ?? '').getTime() - new Date(r.started_at ?? '').getTime()
      ),
    0
  ) / (completed.length || 1);

  const avgResponseTime =
    completed.length > 0
      ? avgMs < 1000
        ? `${avgMs.toFixed(0)}ms`
        : `${(avgMs / 1000).toFixed(2)}s`
      : 'N/A';

  const failed = runs.filter(r => r.status === 'failed').length;
  const totalRelevant = completed.length + failed;
  const errorRate =
    totalRelevant > 0
      ? `${((failed / totalRelevant) * 100).toFixed(2)}%`
      : '0%';

  const totalQueries = runs.length.toLocaleString();

  return (
    <section className="mb-8 p-6 rounded-lg xl:mt-5 shadow-lg mx-1 lg:mx-30 ">
      <h2 className="text-3xl md:text-4xl sm:text-[50px xl:text-[50px] font-semibold text-[#9FF8F8] mb-2">System Health</h2>
      <div className="grid grid-cols-1  xl:mb:3 md:grid-cols-3 gap-5 lg:gap-5 md:gap-10 xl:gap-26">
        <MetricCard
          title="Avg. Response Time"
          value={avgResponseTime}
          subtext="Last completed runs"
          colorClass="bg-green-100"
          icon={<FaStopwatch />}
          data-testid="avg-response-time"
        />
        <MetricCard
          title="Error Rate"
          value={errorRate}
          subtext={`${failed} failed / ${totalRelevant} total`}
          colorClass="bg-pink-100"
          icon={<FaExclamationTriangle />}
          data-testid="error-rate"
        />
        <MetricCard
          title="Database Queries"
          value={totalQueries}
          subtext="Total executed"
          colorClass="bg-yellow-100"
          icon={<FaDatabase />}
          data-testid="total-queries"
        />
      </div>
    </section>
  );
};

export default SystemHealthSection;