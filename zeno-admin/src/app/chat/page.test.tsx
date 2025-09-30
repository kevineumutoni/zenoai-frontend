import { render, screen, act, fireEvent } from '@testing-library/react';
import ChatPage from './page';
import * as useConversationWithRuns from '../hooks/useConversationWithRuns';
import * as useFetchPostRuns from '../hooks/useFetchPostRuns';
import React from 'react';

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

type SidebarMockProps = {
  onAddChat: () => void;
  onRenameConversation: (id: number, title: string) => void;
  onDeleteConversation: (id: number) => void;
};
function SidebarMock(props: SidebarMockProps) {
  return (
    <div data-testid="sidebar">
      <button data-testid="add-chat" onClick={props.onAddChat} />
      <button data-testid="rename-chat" onClick={() => props.onRenameConversation(1, 'Changed Title')} />
      <button data-testid="delete-chat" onClick={() => props.onDeleteConversation(1)} />
    </div>
  );
}

type ChatInputMockProps = {
  sendMessage: (params: { conversationId: number | null; userInput: string }) => void;
};
function ChatInputMock(props: ChatInputMockProps) {
  return (
    <div data-testid="chat-input">
      <button data-testid="send-message" onClick={() => props.sendMessage({
        conversationId: null,
        userInput: 'Hi there',
      })} />
    </div>
  );
}

function ChatMessagesMock() {
  return <div data-testid="chat-messages" />;
}
function HandMock(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-testid="hand" {...props} />;
}

jest.mock('../sharedComponents/Sidebar', () => SidebarMock);
jest.mock('./components/ChatMessages', () => ChatMessagesMock);
jest.mock('../sharedComponents/ChatInput', () => ChatInputMock);
jest.mock('lucide-react', () => ({ Hand: HandMock }));

const mockConversations = [
  { conversation_id: 1, title: 'First Chat', runs: [], created_at: '2023-01-01T00:00:00Z' },
];
const mockRuns = [
  {
    id: 'run1',
    user_input: 'Hello',
    final_output: 'Hi!',
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
    window.localStorage.setItem('token', 'token123');
    window.localStorage.setItem('id', '42');

    jest.spyOn(useConversationWithRuns, 'useConversationsWithRuns').mockReturnValue({
      conversations: mockConversations,
      selectedConversationId: 1,
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
  });

  it('renders unauthorized user screen if user is not set', () => {
    window.localStorage.clear();
    render(<ChatPage />);
    expect(screen.getByText(/unauthorized user/i)).toBeInTheDocument();
    expect(screen.getByText(/please sign in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders greeting when showGreeting is true', () => {
    render(<ChatPage />);
    expect(screen.getByText(/hello there!/i)).toBeInTheDocument();
    expect(screen.getByText(/how may i help you today/i)).toBeInTheDocument();
    expect(screen.getByTestId('hand')).toBeInTheDocument();
  });

  it('renders messages and input when showGreeting is false', () => {
    jest.spyOn(useConversationWithRuns, 'useConversationsWithRuns').mockReturnValue({
      conversations: [
        { conversation_id: 1, title: 'Has runs', runs: mockRuns, created_at: '2023-01-01T00:00:00Z' }
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
    expect(screen.getByTestId('chat-messages')).toBeInTheDocument();
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
  });

  it('calls handleAddChat and updates conversations', async () => {
    const setConversations = jest.fn();
    const setSelectedConversationId = jest.fn();
    (useConversationWithRuns.useConversationsWithRuns as jest.Mock).mockReturnValue({
      conversations: mockConversations,
      selectedConversationId: 1,
      setSelectedConversationId,
      fetchConvos: jest.fn(),
      setConversations,
      loading: false,
      error: null,
    });
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ conversation_id: 99, title: 'New Chat', runs: [], created_at: '2023-02-01T00:00:00Z' }),
      });

    render(<ChatPage />);
    await act(async () => {
      fireEvent.click(screen.getByTestId('add-chat'));
    });
    expect(global.fetch).toHaveBeenCalledWith('/api/conversations', expect.any(Object));
    expect(setConversations).toHaveBeenCalled();
    expect(setSelectedConversationId).toHaveBeenCalledWith(99);
  });

  it('calls handleRenameConversation', async () => {
    const fetchConvos = jest.fn();
    (useConversationWithRuns.useConversationsWithRuns as jest.Mock).mockReturnValue({
      conversations: mockConversations,
      selectedConversationId: 1,
      setSelectedConversationId: jest.fn(),
      fetchConvos,
      setConversations: jest.fn(),
      loading: false,
      error: null,
    });
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true });
    render(<ChatPage />);
    await act(async () => {
      fireEvent.click(screen.getByTestId('rename-chat'));
    });
    expect(global.fetch).toHaveBeenCalledWith('/api/conversations/1', expect.objectContaining({ method: 'PATCH' }));
    expect(fetchConvos).toHaveBeenCalled();
  });

  it('calls handleDeleteConversation and updates state', async () => {
    const setConversations = jest.fn();
    const setSelectedConversationId = jest.fn();
    const fetchConvos = jest.fn();
    (useConversationWithRuns.useConversationsWithRuns as jest.Mock).mockReturnValue({
      conversations: mockConversations,
      selectedConversationId: 1,
      setSelectedConversationId,
      fetchConvos,
      setConversations,
      loading: false,
      error: null,
    });
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true });
    render(<ChatPage />);
    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-chat'));
    });
    expect(global.fetch).toHaveBeenCalledWith('/api/conversations/1', expect.objectContaining({ method: 'DELETE' }));
    expect(setConversations).toHaveBeenCalled();
    expect(setSelectedConversationId).toHaveBeenCalled();
    expect(fetchConvos).toHaveBeenCalled();
  });

  it('calls handleSendMessage and updates state', async () => {
    const setConversations = jest.fn();
    const setSelectedConversationId = jest.fn();
    const fetchConvos = jest.fn();
    (useConversationWithRuns.useConversationsWithRuns as jest.Mock).mockReturnValue({
      conversations: mockConversations,
      selectedConversationId: 1,
      setSelectedConversationId,
      fetchConvos,
      setConversations,
      loading: false,
      error: null,
    });
    const sendMessage = jest.fn().mockResolvedValue(mockRuns[0]);
    (useFetchPostRuns.useRuns as jest.Mock).mockReturnValue({
      runs: [],
      sendMessage,
      clearRuns: jest.fn(),
      setRuns: jest.fn(),
    });
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ conversation_id: 123, title: 'New Chat', runs: [], created_at: '2023-02-01T00:00:00Z' }),
      })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true });
    render(<ChatPage />);
    await act(async () => {
      fireEvent.click(screen.getByTestId('send-message'));
    });
    expect(global.fetch).toHaveBeenCalledWith('/api/conversations', expect.any(Object));
    expect(sendMessage).toHaveBeenCalled();
    expect(fetchConvos).toHaveBeenCalled();
  });
});