import ChatInput from "../../../sharedComponents/ChatInput";
import { RunLike } from "../../../hooks/usepostRuns";

export default function ChatInputWrapper({
  conversationId,
  user,
  sendMessage,
}: {
  conversationId: string | null;
  user: { id: number; token: string };
  sendMessage: (params: {
    conversationId?: string | null;
    userInput: string;
    files?: File[];
  }) => Promise<RunLike>;
}) {
  async function handleRunCreated(run: RunLike) {
    try {
      await sendMessage({
        conversationId,
        userInput: run.user_input,
        files: run.files || [],
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  return (
    <ChatInput
      onRunCreated={handleRunCreated}
      conversationId={conversationId}
      user={user}
    />
  );
}
