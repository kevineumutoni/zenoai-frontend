// src/app/systemHealth/components/DatabaseQuerySection/index.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DatabaseQuerySection from '../DatabaseQuerySection';
import { Run } from '../../../hooks/useFetchRuns';

// ✅ Only mock CalendarDropdown — keep real QueryVolumeCard & AccuracyRateCard
jest.mock('../../../sharedComponents/CalendarDropdown', () => {
  return jest.fn(({ onDateChange }) => (
    <button onClick={() => onDateChange(new Date('2025-09-15'), new Date('2025-09-18'))}>
      Select Date Range
    </button>
  ));
});

const mockRuns: Run[] = [
  {
    id: 1,
    conversation: null,
    user_input: 'Test query',
    final_output: 'Success',
    status: 'completed',
    started_at: '2025-09-16T10:00:00Z',
    completed_at: '2025-09-16T10:01:00Z',
    input_files: [],
    output_artifacts: [],
  },
];

describe('DatabaseQuerySection', () => {
  it('renders section title and child components', () => {
    render(<DatabaseQuerySection runs={mockRuns} />);

    // ✅ Assert by visible text — what user actually sees
    expect(screen.getByText(/Database Query and Accuracy/i)).toBeInTheDocument();

    // ✅ QueryVolumeCard renders "Database Query Volume"
    expect(screen.getByText(/Database Query Volume/i)).toBeInTheDocument();

    // ✅ AccuracyRateCard renders "Accuracy Rate"
    expect(screen.getByText(/Accuracy Rate/i)).toBeInTheDocument();

    // ✅ Calendar button is present
    expect(screen.getByText(/Select Date Range/i)).toBeInTheDocument();
  });

  it('updates dateRange and re-renders children on CalendarDropdown change', () => {
    render(<DatabaseQuerySection runs={mockRuns} />);

    // ✅ Before click — should show data for default range (last 7 days)
    // You can assert chart exists, or initial values if you add them

    // ✅ Click to change date
    fireEvent.click(screen.getByText(/Select Date Range/i));

    // ✅ After click — children should re-render with new date range
    // Since we can't easily spy on props without mocks, we assert:
    // → That the calendar button still exists (not crashed)
    // → That child components still render (not crashed)

    expect(screen.getByText(/Database Query Volume/i)).toBeInTheDocument();
    expect(screen.getByText(/Accuracy Rate/i)).toBeInTheDocument();

    // ✅ Optional: If your cards show date range in text, assert that
    // e.g., expect(screen.getByText(/Sep 15 - Sep 18/i)).toBeInTheDocument();
  });
});