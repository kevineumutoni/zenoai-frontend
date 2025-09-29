import React, { useState } from 'react';
import QueryVolumeCard from '../QueryVolumeCard';
import AccuracyRateCard from '../AccuracyRateCard';
import CalendarDropdown from '../../../sharedComponents/CalendarDropdown';
import { subDays } from 'date-fns';
import { Run } from '../../../utils/types/runs';

interface DatabaseQuerySectionProps {
  runs: Run[];
}

const DatabaseQuerySection: React.FC<DatabaseQuerySectionProps> = ({ runs }) => {
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: subDays(new Date(), 7),
    end: new Date(),
  });

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
  };

  return (
    <section className="mb-8 mx-5 lg:mx-40">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-teal-400">Database Query and Accuracy</h2>
        <CalendarDropdown onDateChange={handleDateChange} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QueryVolumeCard runs={runs} dateRange={dateRange} />
        <AccuracyRateCard runs={runs} dateRange={dateRange} />
      </div>
    </section>
  );
};

export default DatabaseQuerySection; 