import { render, screen, fireEvent } from '@testing-library/react';
import DashboardMain from '.';

jest.mock('next/image', () => {
  return function Image({ src, alt, width, height }: any) {
    return <img src={src} alt={alt} width={width} height={height} />;
  };
});

jest.mock('../../../sharedComponents/ChatInput', () => {
  return ({ onRunCreated }: { onRunCreated: () => void }) => (
    <button
      data-testid="mock-chat-submit"
      onClick={() => onRunCreated()}
    >
      Submit
    </button>
  );
});

describe('DashboardMain', () => {
  it('renders logo, heading, and chat input', () => {
    render(<DashboardMain onRunCreated={() => {}} />);

    expect(screen.getByAltText('Zeno Logo')).toBeInTheDocument();
    
    expect(
      screen.getByRole('heading', { level: 1, name: /Ask.*Zeno.*Know.*More!/i })
    ).toBeInTheDocument();

    expect(screen.getByTestId('mock-chat-submit')).toBeInTheDocument();
  });

  it('calls onRunCreated when ChatInput triggers it', () => {
    const handleRunCreated = jest.fn();
    render(<DashboardMain onRunCreated={handleRunCreated} />);

    fireEvent.click(screen.getByTestId('mock-chat-submit'));

    expect(handleRunCreated).toHaveBeenCalledTimes(1);
  });
});