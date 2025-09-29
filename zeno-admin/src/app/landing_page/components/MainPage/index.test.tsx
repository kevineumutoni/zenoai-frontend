import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardMain from "./index";

jest.mock("next/image", () => {
  return function MockImage(props: { src: string; alt: string; width?: number; height?: number; className?: string }) {
    return <ImageMock {...props} />;
  };
});
function ImageMock(props: { src: string; alt?: string; width?: number; height?: number; className?: string }) {
  return (
    <div
      data-testid="mock-next-image"
      data-src={props.src}
      data-alt={props.alt ?? ""}
      data-width={props.width ?? ""}
      data-height={props.height ?? ""}
      className={props.className}
    />
  );
}

type MockChatInputProps = {
  onRunCreated?: (run: {
    id: string;
    user_input: string;
    status: string;
    final_output: string;
    output_artifacts: unknown[];
    started_at: string;
  }) => void;
  user?: { id: number; token: string };
  sendMessage?: (...args: unknown[]) => Promise<unknown>;
  conversationId?: string | null;
};

const mockChatInput = jest.fn();
jest.mock("../../../sharedComponents/ChatInput", () => {
  return function MockChatInput({ onRunCreated, user, sendMessage, conversationId }: MockChatInputProps) {
    mockChatInput({ onRunCreated, user, sendMessage, conversationId });
    return (
      <div>
        <button
          data-testid="mock-chat-submit"
          onClick={() => {
            if (onRunCreated) {
              onRunCreated({
                id: "test-id",
                user_input: "test",
                status: "completed",
                final_output: "output",
                output_artifacts: [],
                started_at: "2025-01-01T00:00:00Z",
              });
            }
          }}
        >
          Submit
        </button>
      </div>
    );
  };
});

const mockUser = { id: 1, token: "abc123" };
const mockSendMessage = jest.fn().mockResolvedValue({
  id: "test-id",
  user_input: "test",
  status: "completed",
  final_output: "output",
  output_artifacts: [],
  started_at: "2025-01-01T00:00:00Z",
});

describe("DashboardMain", () => {
  it("renders logo, heading, and ChatInput", () => {
    render(
      <DashboardMain
        conversationId="conv-1"
        user={mockUser}
        sendMessage={mockSendMessage}
      />
    );
    expect(screen.getByTestId("mock-next-image")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Ask.*Zeno.*Know.*More!/i })).toBeInTheDocument();
    expect(screen.getByTestId("mock-chat-submit")).toBeInTheDocument();
  });

  it("passes props correctly to ChatInput", () => {
    render(
      <DashboardMain
        conversationId="conv-2"
        user={mockUser}
        sendMessage={mockSendMessage}
      />
    );
    expect(mockChatInput).toHaveBeenCalledWith(
      expect.objectContaining({
        user: mockUser,
        sendMessage: mockSendMessage,
        conversationId: "conv-2",
      })
    );
  });

  it("calls onRunCreated when ChatInput triggers it", () => {
    const handleRunCreated = jest.fn();
    render(
      <DashboardMain
        conversationId="conv-3"
        user={mockUser}
        sendMessage={mockSendMessage}
        onRunCreated={handleRunCreated}
      />
    );
    fireEvent.click(screen.getByTestId("mock-chat-submit"));
    expect(handleRunCreated).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "test-id",
        user_input: "test",
        status: "completed",
        final_output: "output",
        output_artifacts: [],
        started_at: "2025-01-01T00:00:00Z",
      })
    );
  });
});