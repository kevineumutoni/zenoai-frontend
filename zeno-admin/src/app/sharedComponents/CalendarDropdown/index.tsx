'use client'
import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, subDays } from 'date-fns';

interface CalendarDropdownProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

const CalendarDropdown: React.FC<CalendarDropdownProps> = ({ onDateChange }) => {
  const defaultStart = subDays(new Date(), 7);
  const defaultEnd = new Date();

  const [startDate, setStartDate] = useState<Date | null>(defaultStart);
  const [endDate, setEndDate] = useState<Date | null>(defaultEnd);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => onDateChange(startDate, endDate), []);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onDateChange(start, end);
    if (start && end) {
    setIsOpen(false);
  }
  };

  const handleClick = () => {
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const displayValue = startDate && endDate
    ? `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}`
    : 'Select Date Range';

  return (
    <div className="relative  inline-block text-white text-sm cursor-pointer">
      <div className="flex items-center justify-center border border-teal-500/50 rounded-md py-1 px-2 mb-2 sm:px-3 md:px-4 " onClick={handleClick}>
        <svg className="w-6 h-6 text-teal-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-center truncate">{displayValue}</span>
      </div>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        monthsShown={2}
        inline={false}
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        customInput={<input ref={inputRef} style={{ display: 'none' }} />}
        popperClassName="flex justify-between w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto z-10"
        calendarClassName="flex bg-blue-300 text-white rounded-lg divide-x divide-teal-500"
        dayClassName={(date) => (startDate && endDate && date >= startDate && date <= endDate ? 'cursor-pointer  text-white rounded' : 'cursor-pointer')}
      />
    </div>
  );
};

export default CalendarDropdown;