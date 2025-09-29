import { render, screen } from '@testing-library/react';
import Background from '.'; 

describe('Background Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Background />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders 50 circles and 50 lines after useEffect', async () => {
    render(<Background />);

    await screen.findByTestId('circle-0');
    await screen.findByTestId('line-0');

    const circles = screen.getAllByTestId(/circle-/);
    const lines = screen.getAllByTestId(/line-/);

    expect(circles.length).toBe(50);
    expect(lines.length).toBe(50);
  });

  it('each circle has correct attributes', async () => {
    render(<Background />);
    await screen.findByTestId('circle-0');

    const firstCircle = screen.getByTestId('circle-0');

    expect(firstCircle).toHaveAttribute('cx');
    expect(firstCircle).toHaveAttribute('cy');
    expect(firstCircle).toHaveAttribute('r');
    expect(firstCircle).toHaveAttribute('fill', 'url(#grad)');
    expect(firstCircle).toHaveAttribute('opacity', '0.8');
  });

  it('each line has correct attributes', async () => {
    render(<Background />);
    await screen.findByTestId('line-0');

    const firstLine = screen.getByTestId('line-0');

    expect(firstLine).toHaveAttribute('x1');
    expect(firstLine).toHaveAttribute('y1');
    expect(firstLine).toHaveAttribute('x2');
    expect(firstLine).toHaveAttribute('y2');
    expect(firstLine).toHaveAttribute('stroke', 'url(#grad)');
    expect(firstLine).toHaveAttribute('stroke-width', '0.5');
    expect(firstLine).toHaveAttribute('opacity', '0.3');
  });

  it('renders linear gradient definition', () => {
    const { container } = render(<Background />);

    const grad = screen.getByTestId('gradient-def');
    expect(grad).toBeInTheDocument();

    const stops = container.querySelectorAll('stop');
    expect(stops.length).toBeGreaterThanOrEqual(2); 
  });
});
