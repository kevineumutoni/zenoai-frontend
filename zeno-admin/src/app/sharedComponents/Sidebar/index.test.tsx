import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
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
};

describe("Sidebar", () => {
  it("renders expanded sidebar with conversations", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Add a new chat")).toBeInTheDocument();
    expect(screen.getByText("Conversations")).toBeInTheDocument();
    expect(screen.getByText("Conversation 1")).toBeInTheDocument();
    expect(screen.getByText("Conversation 2")).toBeInTheDocument();
  });

  it("renders collapsed sidebar", () => {
    render(<Sidebar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Collapse Sidebar"));
    expect(screen.getByLabelText("Expand Sidebar")).toBeInTheDocument();
  });

  it("calls onAddChat when Add a new chat is clicked", () => {
    render(<Sidebar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Add a new chat"));
    expect(defaultProps.onAddChat).toHaveBeenCalled();
  });

  it("calls setSelectedConversationId when a conversation is clicked", () => {
    render(<Sidebar {...defaultProps} />);
    fireEvent.click(screen.getByText("Conversation 2"));
    expect(defaultProps.setSelectedConversationId).toHaveBeenCalledWith(2);
  });

  it("shows no conversations message", () => {
    render(
      <Sidebar
        {...defaultProps}
        conversations={[]}
      />
    );
    expect(screen.getByText("No conversations yet")).toBeInTheDocument();
  });



  it("closes logout confirmation modal when Cancel is clicked", () => {
    render(<Sidebar {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Logout"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Confirm Logout")).not.toBeInTheDocument();
  });

  it("renders sidebar as overlay when isMobile and showSidebar are true", () => {
    render(
      <Sidebar
        {...defaultProps}
        isMobile={true}
        showSidebar={true}
      />
    );
    expect(screen.getByText("Add a new chat")).toBeInTheDocument();
    expect(screen.getByText("Conversations")).toBeInTheDocument();
  });
});