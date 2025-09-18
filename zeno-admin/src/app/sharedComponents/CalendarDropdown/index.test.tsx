import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CalendarDropdown from '.';

describe('CalendarDropdown', () => {
  const onDateChangeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial date range display', () => {
    render(<CalendarDropdown onDateChange={onDateChangeMock} />);
    expect(screen.getByText(/Select Date Range|[A-Z][a-z]{2} \d{2} - [A-Z][a-z]{2} \d{2}, \d{4}/)).toBeInTheDocument();
  });

  it('opens date picker when clicked', () => {
    render(<CalendarDropdown onDateChange={onDateChangeMock} />);
    const container = screen.getByText(/Select Date Range|[A-Z][a-z]{2} \d{2} - [A-Z][a-z]{2} \d{2}, \d{4}/);
    fireEvent.click(container);
    expect(document.querySelector('.react-datepicker')).toBeInTheDocument();
  });

  it('calls onDateChange callback when dates are changed', () => {
    render(<CalendarDropdown onDateChange={onDateChangeMock} />);

    const container = screen.getByText(/Select Date Range|[A-Z][a-z]{2} \d{2} - [A-Z][a-z]{2} \d{2}, \d{4}/);
    fireEvent.click(container);

    const allTens = screen.getAllByText('10');
    const startDay = allTens.find(el => el.getAttribute('aria-label')?.includes('September 10'));
    const allFifteens = screen.getAllByText('15');
    const endDay = allFifteens.find(el => el.getAttribute('aria-label')?.includes('September 15'));

    if (!startDay || !endDay) throw new Error('Could not find start or end day elements');

    act(() => {
      fireEvent.click(startDay);
      fireEvent.click(endDay);
    });

    expect(onDateChangeMock).toHaveBeenCalled();

    const validCalls = onDateChangeMock.mock.calls.filter(
      ([start, end]) => start instanceof Date && end instanceof Date && end !== null
    );

    expect(validCalls.length).toBeGreaterThan(0);

    const lastCall = validCalls[validCalls.length - 1];
    expect(lastCall[0]).toBeInstanceOf(Date);
    expect(lastCall[1]).toBeInstanceOf(Date);
  });

  it('closes date picker after full range selection (simulated click outside)', () => {
    render(<CalendarDropdown onDateChange={onDateChangeMock} />);

    const container = screen.getByText(/Select Date Range|[A-Z][a-z]{2} \d{2} - [A-Z][a-z]{2} \d{2}, \d{4}/);
    fireEvent.click(container);

    const allTens = screen.getAllByText('10');
    const startDay = allTens.find(el => el.getAttribute('aria-label')?.includes('September 10'));
    const allFifteens = screen.getAllByText('15');
    const endDay = allFifteens.find(el => el.getAttribute('aria-label')?.includes('September 15'));

    if (!startDay || !endDay) throw new Error('Could not find start or end day elements');

    act(() => {
      fireEvent.click(startDay);
      fireEvent.click(endDay);
    });

    // Simulate clicking outside to close the picker
    act(() => {
      fireEvent.mouseDown(document.body);
    });

    expect(document.querySelector('.react-datepicker')).not.toBeInTheDocument();
  });
});
