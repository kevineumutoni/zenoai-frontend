import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatInputWrapper from "./index";
import { RunLike } from "../../../hooks/usepostRuns";

jest.mock("../../../sharedComponents/ChatInput", () => {
  return ({ onRunCreated }: any) => (
    <button onClick={() => onRunCreated({ user_input: "Hello", files: [] })}>
      MockChatInput
    </button>
  );
});

describe("ChatInputWrapper", () => {
  const mockSendMessage = jest.fn().mockResolvedValue({
    id: 1,
    user_input: "Hello",
    status: "pending",
    final_output: null,
    output_artifacts: [],
    started_at: "2025-01-01T00:00:00Z",
  } as RunLike);

  const user = { id: 123, token: "fake-token" };

  it("renders ChatInput with correct props", () => {
    render(<ChatInputWrapper conversationId="conv-1" user={user} sendMessage={mockSendMessage} />);
    expect(screen.getByText("MockChatInput")).toBeInTheDocument();
  });

  it("calls sendMessage with correct arguments when onRunCreated is triggered", async () => {
    render(<ChatInputWrapper conversationId="conv-1" user={user} sendMessage={mockSendMessage} />);

    fireEvent.click(screen.getByText("MockChatInput"));

    expect(mockSendMessage).toHaveBeenCalledWith({
      conversationId: "conv-1",
      userInput: "Hello",
      files: [],
    });
  });

  it("handles sendMessage rejection without throwing", async () => {
    const errorSendMessage = jest.fn().mockRejectedValue(new Error("Network error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<ChatInputWrapper conversationId="conv-1" user={user} sendMessage={errorSendMessage} />);
    fireEvent.click(screen.getByText("MockChatInput"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to send message:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
