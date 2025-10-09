import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeedbackButtons from './';

jest.mock('../FeedbackModal', () => {
  const MockFeedbackModal = ({ onClose }: { onClose: () => void }) => (
    <div data-testid="feedback-modal">
      <button onClick={onClose} data-testid="close-modal">Close</button>
    </div>
  );
  MockFeedbackModal.displayName = 'MockFeedbackModal';
  return MockFeedbackModal;
});

jest.mock('react-icons/fa', () => {
  const FaRegThumbsUp = () => <span data-testid="thumbs-up">👍</span>;
  FaRegThumbsUp.displayName = 'FaRegThumbsUp';
  const FaRegThumbsDown = () => <span data-testid="thumbs-down">👎</span>;
  FaRegThumbsDown.displayName = 'FaRegThumbsDown';
  const FaRegCopy = () => <span data-testid="copy-icon">📋</span>;
  FaRegCopy.displayName = 'FaRegCopy';
  const FaDownload = () => <span data-testid="download-icon">📥</span>;
  FaDownload.displayName = 'FaDownload';
  return { FaRegThumbsUp, FaRegThumbsDown, FaRegCopy, FaDownload };
});

describe('FeedbackButtons', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn().mockReturnValue('test-token'),
      },
      writable: true,
    });
  });

  it('renders all feedback buttons', () => {
    render(<FeedbackButtons userId={1} textToCopy="test" />);
    expect(screen.getByTestId('thumbs-up')).toBeInTheDocument();
    expect(screen.getByTestId('thumbs-down')).toBeInTheDocument();
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
  });

  it('shows download button when onDownloadReport and runData are provided', () => {
    const handleDownload = jest.fn();
    const runData = {
      id: '1',
      user_input: 'test',
      status: 'completed',
      final_output: null,
      output_artifacts: [],
      started_at: '2024-01-01T00:00:00Z',
    };
    render(
      <FeedbackButtons 
        userId={1} 
        textToCopy="test" 
        onDownloadReport={handleDownload} 
        runData={runData} 
      />
    );
    expect(screen.getByTestId('download-icon')).toBeInTheDocument();
  });

  it('does not show download button when runData is missing', () => {
    const handleDownload = jest.fn();
    render(
      <FeedbackButtons 
        userId={1} 
        textToCopy="test" 
        onDownloadReport={handleDownload} 
      />
    );
    expect(screen.queryByTestId('download-icon')).not.toBeInTheDocument();
  });

  it('opens feedback modal on like click', () => {
    render(<FeedbackButtons userId={1} textToCopy="test" />);
    fireEvent.click(screen.getByTestId('thumbs-up'));
    expect(screen.getByTestId('feedback-modal')).toBeInTheDocument();
  });

  it('opens feedback modal on dislike click', () => {
    render(<FeedbackButtons userId={1} textToCopy="test" />);
    fireEvent.click(screen.getByTestId('thumbs-down'));
    expect(screen.getByTestId('feedback-modal')).toBeInTheDocument();
  });

  it('closes feedback modal', () => {
    render(<FeedbackButtons userId={1} textToCopy="test" />);
    fireEvent.click(screen.getByTestId('thumbs-up'));
    fireEvent.click(screen.getByTestId('close-modal'));
    expect(screen.queryByTestId('feedback-modal')).not.toBeInTheDocument();
  });

  it('shows copy success message', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
      writable: true,
    });
    render(<FeedbackButtons userId={1} textToCopy="test copy text" />);
    fireEvent.click(screen.getByTestId('copy-icon'));
    await waitFor(() => {
      expect(screen.getByText('Copied successfully!')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText('Copied successfully!')).not.toBeInTheDocument();
    }, { timeout: 2100 });
  });

  it('shows copy error message', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockRejectedValue(new Error('Permission denied')),
      },
      writable: true,
    });
    render(<FeedbackButtons userId={1} textToCopy="test copy text" />);
    fireEvent.click(screen.getByTestId('copy-icon'));
    await waitFor(() => {
      expect(screen.getByText('Failed to copy')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText('Failed to copy')).not.toBeInTheDocument();
    }, { timeout: 2100 });
  });

  it('calls onDownloadReport with runData', () => {
    const handleDownload = jest.fn();
    const runData = {
      id: '1',
      user_input: 'test input',
      status: 'completed',
      final_output: 'Response',
      output_artifacts: [],
      started_at: '2024-01-01T00:00:00Z',
    };
    render(
      <FeedbackButtons 
        userId={1} 
        textToCopy="test" 
        onDownloadReport={handleDownload} 
        runData={runData} 
      />
    );
    fireEvent.click(screen.getByTestId('download-icon'));
    expect(handleDownload).toHaveBeenCalledWith(runData);
  });
});