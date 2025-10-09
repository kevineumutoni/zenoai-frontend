import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import ChatPage from './page';
import * as useConversationWithRuns from '../hooks/useConversationWithRuns';
import * as useFetchPostRuns from '../hooks/useFetchPostRuns';

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('../sharedComponents/Sidebar', () => {
  const MockSidebar = ({ onLogout }: { onLogout: () => void }) => (
    <div data-testid="sidebar">
      <button onClick={onLogout} data-testid="logout-btn">Logout</button>
    </div>
  );
  MockSidebar.displayName = 'MockSidebar';
  return MockSidebar;
});

jest.mock('./components/ChatMessages', () => {
  interface Run {
    id: string;
    user_input: string;
    final_output: string | null;
    output_artifacts: unknown[];
    status: 'pending' | 'completed' | 'failed';
    started_at: string;
    files: unknown[];
    _optimistic: boolean;
  }

  const MockChatMessages = ({ runs }: { runs: Run[] }) => (
    <div data-testid="chat-messages">
      {runs.map((run, i) => (
        <div key={i} data-testid={`message-${i}`}>{run.user_input}</div>
      ))}
    </div>
  );
  MockChatMessages.displayName = 'MockChatMessages';
  return MockChatMessages;
});

jest.mock('../sharedComponents/ChatInput', () => {
  const MockChatInput = ({ sendMessage }: { sendMessage: () => void }) => (
    <div data-testid="chat-input">
      <button onClick={sendMessage} data-testid="send-btn">Send</button>
    </div>
  );
  MockChatInput.displayName = 'MockChatInput';
  return MockChatInput;
});

jest.mock('lucide-react', () => {
  const Hand = () => <span data-testid="hand-icon">👋</span>;
  Hand.displayName = 'Hand';
  return { Hand };
});

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

const mockUser = {
  id: 11,
  first_name: 'Test',
  last_name: 'User',
  name: 'Test User',
  email: 'test@example.com',
  created_at: '2023-01-01T00:00:00Z',
  role: 'user'
};

const mockConversations = [
  { 
    conversation_id: 1, 
    title: 'Test Chat', 
    runs: [], 
    created_at: '2023-01-01T00:00:00Z',
    user: mockUser
  },
];

const mockRuns = [
  {
    id: 'run1',
    user_input: 'Hello',
    final_output: 'Hi there!',
    output_artifacts: [],
    status: 'completed',
    started_at: '2023-01-01T00:00:00Z',
    files: [],
    _optimistic: false,
  },
];

describe('ChatPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    localStorageMock.clear.mockReset();
    mockPush.mockReset();
  });

  it('redirects to /signin when no token', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return null;
      if (key === 'id') return '123';
      if (key === 'role') return 'User';
      return null;
    });
    render(<ChatPage />);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/signin');
    });
  });

  it('redirects to /signin when no id', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'valid-token';
      if (key === 'id') return null;
      if (key === 'role') return 'User';
      return null;
    });
    render(<ChatPage />);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/signin');
    });
  });

  it('redirects to /signin when invalid role', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'valid-token';
      if (key === 'id') return '123';
      if (key === 'role') return 'Guest';
      return null;
    });
    render(<ChatPage />);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/signin');
    });
  });

  it('renders greeting when no messages', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'valid-token';
      if (key === 'id') return '123';
      if (key === 'role') return 'User';
      return null;
    });
    jest.spyOn(useConversationWithRuns, 'useConversationsWithRuns').mockReturnValue({
      conversations: mockConversations,
      selectedConversationId: null,
      setSelectedConversationId: jest.fn(),
      fetchConvos: jest.fn(),
      setConversations: jest.fn(),
      loading: false,
      error: null,
    });
    jest.spyOn(useFetchPostRuns, 'useRuns').mockReturnValue({
      runs: [],
      sendMessage: jest.fn().mockResolvedValue(mockRuns[0]),
      clearRuns: jest.fn(),
      setRuns: jest.fn(),
    });
    render(<ChatPage />);
    await waitFor(() => {
      expect(screen.getByText('Hello there!')).toBeInTheDocument();
      expect(screen.getByText('How may I help you today?')).toBeInTheDocument();
      expect(screen.getByTestId('hand-icon')).toBeInTheDocument();
    });
  });

  it('renders chat messages when runs exist', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'valid-token';
      if (key === 'id') return '123';
      if (key === 'role') return 'User';
      return null;
    });
    jest.spyOn(useConversationWithRuns, 'useConversationsWithRuns').mockReturnValue({
      conversations: [
        { 
          conversation_id: 1, 
          title: 'Has runs', 
          runs: mockRuns, 
          created_at: '2023-01-01T00:00:00Z',
          user: mockUser
        }
      ],
      selectedConversationId: 1,
      setSelectedConversationId: jest.fn(),
      fetchConvos: jest.fn(),
      setConversations: jest.fn(),
      loading: false,
      error: null,
    });
    jest.spyOn(useFetchPostRuns, 'useRuns').mockReturnValue({
      runs: mockRuns,
      sendMessage: jest.fn().mockResolvedValue(mockRuns[0]),
      clearRuns: jest.fn(),
      setRuns: jest.fn(),
    });
    render(<ChatPage />);
    await waitFor(() => {
      expect(screen.getByTestId('chat-messages')).toBeInTheDocument();
      expect(screen.getByTestId('message-0')).toHaveTextContent('Hello');
    });
  });

  it('handles logout correctly', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'valid-token';
      if (key === 'id') return '123';
      if (key === 'role') return 'User';
      return null;
    });
    jest.spyOn(useConversationWithRuns, 'useConversationsWithRuns').mockReturnValue({
      conversations: mockConversations,
      selectedConversationId: null,
      setSelectedConversationId: jest.fn(),
      fetchConvos: jest.fn(),
      setConversations: jest.fn(),
      loading: false,
      error: null,
    });
    jest.spyOn(useFetchPostRuns, 'useRuns').mockReturnValue({
      runs: [],
      sendMessage: jest.fn().mockResolvedValue(mockRuns[0]),
      clearRuns: jest.fn(),
      setRuns: jest.fn(),
    });
    render(<ChatPage />);
    await act(async () => {
      fireEvent.click(screen.getByTestId('logout-btn'));
    });
    expect(localStorageMock.clear).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/signin');
  });
});