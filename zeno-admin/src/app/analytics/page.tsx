'use client';
import { useState } from 'react';
import { subDays } from 'date-fns';
import { useFetchAnalytics } from '../hooks/useFetchSteps';
import AnalyticsBarChartCard from './BarchartCard';
import AnalyticsPieChartCard from './PieChartCard';
import CalendarDropdown from '../sharedComponents/CalendarDropdown';

const AnalyticsPage: React.FC = () => {
  const { steps, isLoading, error } = useFetchAnalytics();
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: subDays(new Date(), 7),
    end: new Date(),
  });

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
  };

  if (isLoading) return <div className="text-white text-center p-6">Loading analytics data...</div>;
  if (error) return <div className="text-red-500 text-center p-6">{error}</div>;
  if (!steps) return <div className="text-white text-center p-6">No data available</div>;

  return (
    <section className="my-18 mx-5 lg:mx-40 ">
      <div className=" mb-10">
        <h2 className="text-xl md:text-2xl lg:text-5xl font-bold text-white">Usage Analytics</h2>
        <p className="text-2xl text-teal-400 my-5 ">Agent and Module Usage</p>
        <div className='flex justify-end mt-25'>
          <CalendarDropdown onDateChange={handleDateChange} />
        </div>
        
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsBarChartCard steps={steps} dateRange={dateRange} />
        <AnalyticsPieChartCard steps={steps} dateRange={dateRange} />
      </div>
    </section>
  );
};

export default AnalyticsPage;