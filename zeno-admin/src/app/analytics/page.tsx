'use client';
import { useState } from 'react';
import { subDays } from 'date-fns';
import { useFetchAnalytics } from '../hooks/useFetchSteps';
import AnalyticsBarChartCard from './components/BarchartCard';
import AnalyticsPieChartCard from './components/PieChartCard';
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

  if (isLoading) {
    return (
      <section className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4 animate-spin"></div>
          <p className="text-[#A1B1D6] text-base">Loading analytics data...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
            <h2 className="text-lg font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!steps) {
    return (
      <section className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="text-white text-base">No data available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-16 lg:mx-29 ">
      <div className=" mb-10">
        <h2 className="text-3xl md:text-4xl sm:text-[50px] xl:text-[50px] 2xl:font-semibold text-[#9FF8F8] ">Usage Analytics</h2>
        <p className="sm:text-[24px] lg:text-[20px] xl:text-[34px] my-5 ">Agent and Module Usage</p>
        <div className='flex justify-end mt-2'>
          <CalendarDropdown onDateChange={handleDateChange} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsBarChartCard steps={steps} dateRange={dateRange} />
        <AnalyticsPieChartCard steps={steps}  dateRange={dateRange} />
      </div>
    </section>
  );
};

export default AnalyticsPage;
