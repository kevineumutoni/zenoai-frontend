import { useEffect, useState } from "react";
import { Conversation } from "../utils/types/runs";
import { getConversationsWithRuns } from "../utils/fetchConversationWithRuns";

export function useConversationsWithRuns(token?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  const fetchConvos = async () => {
    if (!token) return;
    try {
      const data = await getConversationsWithRuns(token);
      setConversations(data);
      if (data.length > 0 && !selectedConversationId) {
        setSelectedConversationId(data[0].conversation_id);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchConvos();
  }, [token]);

  return {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    fetchConvos,
    setConversations,
  };
}