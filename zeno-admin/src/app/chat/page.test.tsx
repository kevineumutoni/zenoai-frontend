import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import ChatPage from './page';
import * as useConversationWithRuns from '../hooks/useConversationWithRuns';
import * as useFetchPostRuns from '../hooks/useFetchPostRuns';
import React from 'react';

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('../sharedComponents/Sidebar', () => {
  return ({ onLogout }: { onLogout: () => void }) => (
    <div data-testid="sidebar">
      <button onClick={onLogout} data-testid="logout-btn">Logout</button>
    </div>
  );
});

jest.mock('./components/ChatMessages', () => {
  return ({ runs }: { runs: any[] }) => (
    <div data-testid="chat-messages">
      {runs.map((run, i) => (
        <div key={i} data-testid={`message-${i}`}>{run.user_input}</div>
      ))}
    </div>
  );
});

jest.mock('../sharedComponents/ChatInput', () => {
  return ({ sendMessage }: { sendMessage: () => void }) => (
    <div data-testid="chat-input">
      <button onClick={sendMessage} data-testid="send-btn">Send</button>
    </div>
  );
});

jest.mock('lucide-react', () => {
  const Hand = () => <span data-testid="hand-icon">👋</span>;
  return { Hand };
});

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

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
    localStorageMock.clear();
    mockPush.mockClear();
  });

  it('redirects to /signin when no token', async () => {
    localStorageMock.getItem = jest.fn((key) => {
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
    localStorageMock.getItem = jest.fn((key) => {
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
    localStorageMock.getItem = jest.fn((key) => {
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
    localStorageMock.getItem = jest.fn((key) => {
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
    localStorageMock.getItem = jest.fn((key) => {
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
    localStorageMock.getItem = jest.fn((key) => {
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

  it('creates new conversation on send when no conversation selected', async () => {
    localStorageMock.getItem = jest.fn((key) => {
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

    const sendMessageMock = jest.fn().mockResolvedValue(mockRuns[0]);
    jest.spyOn(useFetchPostRuns, 'useRuns').mockReturnValue({
      runs: [],
      sendMessage: sendMessageMock,
      clearRuns: jest.fn(),
      setRuns: jest.fn(),
    });

    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ conversation_id: 456, title: 'New Chat', runs: [], created_at: '2023-01-01T00:00:00Z', user: mockUser }),
      });

    render(<ChatPage />);
    
    await act(async () => {
      fireEvent.click(screen.getByTestId('send-btn'));
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/conversations', expect.any(Object));
    expect(sendMessageMock).toHaveBeenCalled();
  });

  it('handles conversation creation error', async () => {
    localStorageMock.getItem = jest.fn((key) => {
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

    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Daily conversation limit reached' }),
      });

    render(<ChatPage />);
    
    await act(async () => {
      fireEvent.click(screen.getByTestId('send-btn'));
    });

    await waitFor(() => {
      expect(screen.getByText('You have run out of conversations for today. Try again tomorrow.')).toBeInTheDocument();
    });
  });
});