import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsCard from '.';
import { Users } from 'lucide-react'; 

describe('StatsCard', () => {
  it('renders title and value correctly', () => {
    render(<StatsCard title="Total Feedback" value={42} type="total" />);
    expect(screen.getByText('Total Feedback')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <StatsCard title="Likes" value={10} type="like" icon={<Users data-testid="icon" />} />
    );

    expect(screen.getByText('Likes')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
