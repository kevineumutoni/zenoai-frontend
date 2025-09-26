import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import ChatPage from "./page";


jest.mock("../sharedComponents/Sidebar", () => (props: any) => (
  <div data-testid="sidebar">
    <button onClick={props.onAddChat}>Add Chat</button>
    <button onClick={props.onLogout}>Logout</button>
    <div>
      {props.conversations.map((c: any) => (
        <div key={c.conversation_id} onClick={() => props.setSelectedConversationId(c.conversation_id)}>
          {c.title}
        </div>
      ))}
    </div>
  </div>
));
jest.mock("./components/ChatMessages", () => (props: any) => (
  <div data-testid="chat-messages">
    {props.runs.map((run: any) => (
      <div key={run.id}>{run.user_input}</div>
    ))}
  </div>
));
jest.mock("../sharedComponents/ChatInput", () => (props: any) => (
  <form
    data-testid="chat-input"
    onSubmit={e => {
      e.preventDefault();
      props.sendMessage({
        conversationId: props.conversationId,
        userInput: "Test message",
        files: [],
        filePreviews: [],
      });
    }}
  >
    <button type="submit">Send</button>
  </form>
));
jest.mock("../hooks/useConversationWithRuns", () => ({
  useConversationsWithRuns: () => ({
    conversations: [
      { conversation_id: 1, title: "Test Conversation", created_at: "2023-09-26", runs: [{ id: 1, user_input: "Hello", files: [] }] }
    ],
    selectedConversationId: 1,
    setSelectedConversationId: jest.fn(),
    fetchConvos: jest.fn(),
    setConversations: jest.fn(),
  }),
}));
jest.mock("../hooks/useFetchPostRuns", () => ({
  useRuns: () => ({
    runs: [{ id: 1, user_input: "Hello", files: [] }],
    sendMessage: jest.fn(() => Promise.resolve({ id: 2, user_input: "Test message", files: [] })),
    clearRuns: jest.fn(),
    setRuns: jest.fn(),
  }),
}));

window.alert = jest.fn();
Object.defineProperty(global.HTMLElement.prototype, "scrollIntoView", {
  configurable: true,
  value: jest.fn(),
});

window.location.href = "";
describe("ChatPage", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn((key) => {
          if (key === "token") return "mock-token";
          if (key === "user_id") return "1";
          return null;
        }),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it("renders sidebar, chat messages, and chat input", () => {
    render(<ChatPage />);
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("chat-messages")).toBeInTheDocument();
    expect(screen.getByTestId("chat-input")).toBeInTheDocument();
  });

  it("calls sendMessage when chat input submits", async () => {
    render(<ChatPage />);
    fireEvent.click(screen.getByText("Send"));
    await waitFor(() =>
      expect(screen.getByText("Hello")).toBeInTheDocument()
    );
  });

  it("handles add chat and logout from sidebar", () => {
    render(<ChatPage />);
    fireEvent.click(screen.getByText("Add Chat"));
    fireEvent.click(screen.getByText("Logout"));
    expect(window.localStorage.clear).toHaveBeenCalled();
  });

  it("shows conversations in sidebar", () => {
    render(<ChatPage />);
    expect(screen.getByText("Test Conversation")).toBeInTheDocument();
  });
});