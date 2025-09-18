import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DatabaseQuerySection from '../DatabaseQuerySection';
import { Run } from '../../../utils/types';


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

    expect(screen.getByText(/Database Query and Accuracy/i)).toBeInTheDocument();

    expect(screen.getByText(/Database Query Volume/i)).toBeInTheDocument();

    expect(screen.getByText(/Accuracy Rate/i)).toBeInTheDocument();

    expect(screen.getByText(/Select Date Range/i)).toBeInTheDocument();
  });

  it('updates dateRange and re-renders children on CalendarDropdown change', () => {
    render(<DatabaseQuerySection runs={mockRuns} />);

    fireEvent.click(screen.getByText(/Select Date Range/i));


    expect(screen.getByText(/Database Query Volume/i)).toBeInTheDocument();
    expect(screen.getByText(/Accuracy Rate/i)).toBeInTheDocument();

  });
});