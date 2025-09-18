import MetricCard from '../MetricCard';
import { FaStopwatch, FaExclamationTriangle, FaDatabase } from 'react-icons/fa';

const SystemHealthSection = ({ runs }: { runs: any[] }) => {
    const completed = runs.filter(r => r.status === 'completed' && r.started_at && r.completed_at);
    const avgMs = completed.reduce((sum, r) => sum + Math.max(0, new Date(r.completed_at).getTime() - new Date(r.started_at).getTime()), 0) / (completed.length || 1);
    const avgResponseTime = completed.length > 0
        ? (avgMs < 1000 ? `${avgMs.toFixed(0)}ms` : `${(avgMs / 1000).toFixed(2)}s`)
        : 'N/A';
    const failed = runs.filter(r => r.status === 'failed').length;
    const totalRelevant = completed.length + failed;
    const errorRate = totalRelevant > 0
        ? `${((failed / totalRelevant) * 100).toFixed(2)}%`
        : '0%';

    const totalQueries = runs.length.toLocaleString();

    return (
        <section className="mb-8 p-6 rounded-lg shadow-lg mx-1 lg:mx-30">
            <h2 className="text-xl md:text-2xl lg:text-4xl font-bold mb-10 text-white">System Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-5 md:gap-10 xl:gap-20">
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