import { useState } from "react";
import { createConversation } from "../utils/fetchConversation";

export function useConversation(userId?: number, token?: string) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startConversation() {
    if (!userId || !token) return null;
    if (conversationId) return conversationId;

    setLoading(true);
    setError(null);

    try {
      const data = await createConversation(userId, token);
      const cid = data.conversation_id ?? null;
      setConversationId(cid);
      return cid;
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  function resetConversation() {
    setConversationId(null);
  }

  return { conversationId, startConversation, resetConversation, loading, error, setConversationId };
}
