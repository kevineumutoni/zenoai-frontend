import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from ".";

const mockConversations = [
  { conversation_id: 1, title: "Conversation 1", created_at: "2023-01-01" },
  { conversation_id: 2, title: "Conversation 2", created_at: "2023-01-02" },
];

const defaultProps = {
  conversations: mockConversations,
  selectedConversationId: 1,
  setSelectedConversationId: jest.fn(),
  onAddChat: jest.fn(),
  onLogout: jest.fn(),
  isMobile: false,
  showSidebar: true,
  setShowSidebar: jest.fn(),
  onRenameConversation: jest.fn(),
  onDeleteConversation: jest.fn(),
};

describe("Sidebar", () => {
  it("renders expanded sidebar with conversation titles", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Add a new chat")).toBeInTheDocument();
    expect(screen.getByText("Conversations")).toBeInTheDocument();
    expect(screen.getByText("Conversation 1")).toBeInTheDocument();
    expect(screen.getByText("Conversation 2")).toBeInTheDocument();
  });

  it("collapses and expands sidebar", () => {
    render(<Sidebar {...defaultProps} />);

    fireEvent.click(screen.getByLabelText("Collapse Sidebar"));
    expect(screen.getByLabelText("Expand Sidebar")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Expand Sidebar"));
    expect(screen.getByText("Add a new chat")).toBeInTheDocument();
  });

  it("calls onAddChat when 'Add a new chat' button clicked", () => {
    render(<Sidebar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Add a new chat"));
    expect(defaultProps.onAddChat).toHaveBeenCalled();
  });

  it("calls setSelectedConversationId when a conversation is clicked", () => {
    render(<Sidebar {...defaultProps} />);
    fireEvent.click(screen.getByText("Conversation 2"));
    expect(defaultProps.setSelectedConversationId).toHaveBeenCalledWith(2);
  });

  it("shows 'No conversations yet' message when no conversations", () => {
    render(
      <Sidebar
        {...defaultProps}
        conversations={[]}
      />
    );
    expect(screen.getByText("No conversations yet")).toBeInTheDocument();
  });

  it("opens and closes logout confirmation modal", () => {
    render(<Sidebar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Logout"));
    expect(screen.getByText("Confirm Logout")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Confirm Logout")).not.toBeInTheDocument();
  });

  it("calls onLogout when logout confirmed", () => {
    render(<Sidebar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Logout"));
    const logoutButtons = screen.getAllByRole('button', { name: /^logout$/i });
    fireEvent.click(logoutButtons[1]);

    expect(defaultProps.onLogout).toHaveBeenCalled();
  });


});


describe("Sidebar conversation errors", () => {
  it("renders conversationError message and dismiss button", () => {
    const errorMessage = "You have run out of conversations for today. Try again tomorrow.";
    const setConversationErrorMock = jest.fn();

    render(
      <Sidebar
        {...defaultProps}
        conversationError={errorMessage}
        setConversationError={setConversationErrorMock}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    const dismissButton = screen.getByText(/dismiss/i);
    expect(dismissButton).toBeInTheDocument();

    fireEvent.click(dismissButton);
    expect(setConversationErrorMock).toHaveBeenCalledWith(null);
  });

  it("does not render error message if conversationError is null or undefined", () => {
    render(<Sidebar {...defaultProps} conversationError={null} />);
    expect(screen.queryByText(/you have run out of conversations/i)).not.toBeInTheDocument();
  });

  
  it("renders conversationError message and allows dismissal", () => {
    const errorMessage = "You have run out of conversations for today. Try again tomorrow.";
    const setConversationErrorMock = jest.fn();

    render(
      <Sidebar
        {...defaultProps}
        conversationError={errorMessage}
        setConversationError={setConversationErrorMock}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();

   const dismissBtn = screen.getByText(/dismiss/i);
    expect(dismissBtn).toBeInTheDocument();
    fireEvent.click(dismissBtn);
    expect(setConversationErrorMock).toHaveBeenCalledWith(null);
  });

  it("does not render error message when conversationError is triggered", () => {
    render(<Sidebar {...defaultProps} conversationError={null} />);
    expect(screen.queryByText(/you have run out of conversations/i)).not.toBeInTheDocument();
  });
});
