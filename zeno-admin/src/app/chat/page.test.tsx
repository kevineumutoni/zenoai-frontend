import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as useConversationModule from '../hooks/useFetchConversations';
import * as useRunsModule from '../hooks/useFetchPostRuns';
import ChatPage from './page';

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

jest.mock('../sharedComponents/ChatInput', () => {
  return ({ conversationId, user }: any) => (
    <div data-testid="chat-input">
      ChatInput: {conversationId} | User: {user?.id}
    </div>
  );
});

jest.mock('./components/ChatMessages', () => {
  return ({ runs, onRetry, userId }: any) => (
    <div data-testid="chat-messages">
      ChatMessages: {runs.length} runs | User: {userId}
      <button onClick={() => onRetry(runs[0])} data-testid="retry-button">
        Retry
      </button>
    </div>
  );
});

const mockUseConversation = {
  conversationId: 'c001',
  initConversation: jest.fn(),
  resetConversation: jest.fn(),
  loading: false,
  error: null,
  setConversationId: jest.fn(),
};

const mockSendMessage = jest.fn();
const mockUseRuns = {
  runs: [
    {
      id: '1',
      user_input: 'Hey Zeno',
      status: 'completed',
      final_output: 'Response',
      files: undefined,
      output_artifacts: [],
      started_at: new Date().toISOString(),
    },
  ],
  sendMessage: mockSendMessage,
  clearRuns: jest.fn(),
  setRuns: jest.fn(),
};

describe('ChatPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: jest.fn(),
    });

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'token';
      if (key === 'userId') return '123';
      return null;
    });

    jest.spyOn(useConversationModule, 'useConversation').mockReturnValue(mockUseConversation);
    jest.spyOn(useRunsModule, 'useRuns').mockReturnValue(mockUseRuns);
  });

  it('renders chat messages and input when user is logged in', () => {
    render(<ChatPage />);

    expect(screen.getByTestId('chat-messages')).toBeInTheDocument();
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();

    expect(screen.getByTestId('chat-messages')).toHaveTextContent('User: 123');
    expect(screen.getByTestId('chat-input')).toHaveTextContent('User: 123');
  });

  it('does not render chat input when user is not logged in', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return null;
      if (key === 'userId') return null;
      return null;
    });

    render(<ChatPage />);

    expect(screen.getByTestId('chat-messages')).toBeInTheDocument();
    expect(screen.queryByTestId('chat-input')).not.toBeInTheDocument();
  });

  it('passes correct props to ChatMessages', () => {
    render(<ChatPage />);

    expect(screen.getByTestId('chat-messages')).toHaveTextContent('1 runs');
    expect(screen.getByTestId('chat-messages')).toHaveTextContent('User: 123');
  });

  it('handles retry functionality correctly', () => {
    const mockFiles = [
      { file: new File([''], 'test.pdf', { type: 'application/pdf' }), previewUrl: 'blob:1' }
    ];

    const runWithFiles = {
      ...mockUseRuns.runs[0],
      files: mockFiles,
      user_input: 'Message with files',
    };

    const mockUseRunsWithFiles = {
      ...mockUseRuns,
      runs: [runWithFiles],
    };

    jest.spyOn(useRunsModule, 'useRuns').mockReturnValue(mockUseRunsWithFiles);

    render(<ChatPage />);

    fireEvent.click(screen.getByTestId('retry-button'));

    expect(mockSendMessage).toHaveBeenCalledWith({
      conversationId: 'c001',
      userInput: 'Message with files',
      files: [mockFiles[0].file],
      filePreviews: mockFiles,
    });
  });

  it('scrolls to bottom when runs change', async () => {
    const scrollIntoViewMock = HTMLElement.prototype.scrollIntoView as jest.Mock;

    const { rerender } = render(<ChatPage />);

    scrollIntoViewMock.mockClear();

    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    const newRuns = [
      ...mockUseRuns.runs,
      {
        id: '2',
        user_input: 'New message',
        status: 'pending',
        final_output: null,
        files: undefined,
        output_artifacts: [],
        started_at: new Date().toISOString(),
      },
    ];

    const mockUseRunsWithNewMessage = {
      ...mockUseRuns,
      runs: newRuns,
    };

    jest.spyOn(useRunsModule, 'useRuns').mockReturnValue(mockUseRunsWithNewMessage);

    rerender(<ChatPage />);

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
  });

  it('handles user with only token but no userId', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'token';
      if (key === 'userId') return null;
      return null;
    });

    render(<ChatPage />);

    expect(screen.getByTestId('chat-messages')).toBeInTheDocument();
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
  });

  it('handles empty localStorage gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(<ChatPage />);

    expect(screen.getByTestId('chat-messages')).toBeInTheDocument();
    expect(screen.queryByTestId('chat-input')).not.toBeInTheDocument();
  });

  it('passes conversationId to ChatInput', () => {
    render(<ChatPage />);

    expect(screen.getByTestId('chat-input')).toHaveTextContent('c001');
  });

  it('uses correct user object structure', () => {
    render(<ChatPage />);

    expect(screen.getByTestId('chat-input')).toHaveTextContent('User: 123');
  });
});
