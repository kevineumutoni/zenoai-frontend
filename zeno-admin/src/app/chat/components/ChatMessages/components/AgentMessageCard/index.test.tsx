import { render, screen } from '@testing-library/react';
import AgentMessage from '.';

jest.mock('next/image', () => {
  return ({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) => {
    return <img src={src} alt={alt} width={width} height={height} data-testid="agent-logo" />;
  };
});

describe('AgentMessage', () => {
  it('renders loading state with logo and "thinking" text', () => {
    render(<AgentMessage loading />);

    expect(screen.getByTestId('agent-logo')).toBeInTheDocument();
    expect(screen.getByAltText('Zeno AI Logo')).toBeInTheDocument();

    expect(screen.getByText('Zeno AI is thinking...')).toBeInTheDocument();

    const messageBubble = screen.getByText('Zeno AI is thinking...').closest('div');
    expect(messageBubble).toHaveClass('bg-[#131F36]');
  });

  it('renders completed message with text and logo', () => {
    const testMessage = "Hello, I'm Zeno AI!";
    render(<AgentMessage text={testMessage} />);

    expect(screen.getByTestId('agent-logo')).toBeInTheDocument();

    expect(screen.getByText(testMessage)).toBeInTheDocument();

    const messageBubble = screen.getByText(testMessage).closest('div');
    expect(messageBubble).toHaveClass('bg-[#131F36]');
  });

  it('does not render anything when text is null and not loading', () => {
    const { container } = render(<AgentMessage text={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render anything when text is undefined and not loading', () => {
    const { container } = render(<AgentMessage />);
    expect(container).toBeEmptyDOMElement();
  });


});