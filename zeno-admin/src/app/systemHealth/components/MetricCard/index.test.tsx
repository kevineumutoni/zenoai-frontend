import React from 'react';
import { render, screen } from '@testing-library/react';
import MetricCard from '.';

describe('MetricCard', () => {
  test('renders title and value', () => {
    render(<MetricCard title="Test Title" value="123" colorClass="bg-white" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  test('renders subtext if provided with correct color class', () => {
    render(<MetricCard title="Test" value="123" subtext="Subtext here" colorClass="bg-green-100" />);
    expect(screen.getByText('Subtext here')).toBeInTheDocument();
    expect(screen.getByText('Subtext here')).toHaveClass('text-green-700');
  });

  test('renders icon if provided and applies correct icon color', () => {
    const icon = <svg data-testid="icon" />;
    render(<MetricCard title="Icon Test" value="456" colorClass="bg-purple-100" icon={icon} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByTestId('icon').parentElement).toHaveClass('text-purple-700');
  });

  test('applies default icon color if colorClass does not match known colors', () => {
    const icon = <svg data-testid="icon" />;
    render(<MetricCard title="Default Color" value="789" colorClass="bg-blue-100" icon={icon} />);
    expect(screen.getByTestId('icon').parentElement).toHaveClass('text-orange-500');
  });
});
