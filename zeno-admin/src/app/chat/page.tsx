"use client";
import { useEffect, useRef } from "react";
import Sidebar from "../sharedComponents/Sidebar";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "../sharedComponents/ChatInput";
import { RunFile, RunLike } from "../utils/types/chat";
import { Conversation } from "../utils/types/runs";
import { useConversationsWithRuns } from "../hooks/useConversationWithRuns";
import { useRuns } from "../hooks/useFetchPostRuns";

function getUserIdFromLocalStorage() {
  if (typeof window === "undefined") return undefined;
  const possibleKeys = ["user_id", "id", "userId"];
  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);
    if (value && !isNaN(parseInt(value))) {
      return parseInt(value);
    }
  }
  return undefined;
}

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const userId = getUserIdFromLocalStorage();
  const user = token && userId ? { id: userId, token } : undefined;

  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    fetchConvos,
    setConversations,
  } = useConversationsWithRuns(token);

  const { runs, sendMessage, clearRuns, setRuns } = useRuns(user);

  useEffect(() => {
    const selectedConversation: Conversation | undefined = conversations.find(
      (c) => c.conversation_id === selectedConversationId
    );
    if (selectedConversation && selectedConversation.runs) {
      setRuns(selectedConversation.runs);
    } else {
      setRuns([]);
    }

  }, [selectedConversationId, conversations, setRuns]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [runs]);

  async function handleAddChat() {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json().catch(() => ({}));
      
      setConversations((prev) => [data, ...prev]);
      setSelectedConversationId(data.conversation_id);
      await fetchConvos();
    } catch (error) {
      alert("Error creating conversation: " + (error as Error).message);
    }
  }

  async function handleSendMessage({
    conversationId,
    userInput,
    files,
    filePreviews,
  }: {
    conversationId?: string | null;
    userInput: string;
    files?: File[];
    filePreviews?: { file: File; previewUrl: string }[];
  }): Promise<RunLike> {
    try {
      const result = await sendMessage({
        conversationId: conversationId ?? (selectedConversationId !== null ? String(selectedConversationId) : undefined),
        userInput,
        files,
        filePreviews,
      });
      await fetchConvos();
      return result;
    } catch (error) {
      alert("Error sending message: " + (error as Error).message);
      throw error;
    }
  }

  return (
    <div className="flex h-screen text-white">
      <Sidebar
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        setSelectedConversationId={setSelectedConversationId}
        onAddChat={handleAddChat}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/signin";
        }}
        isMobile={false}
        showSidebar={true}
        setShowSidebar={() => {}}
      />
      <div className="flex-1 flex flex-col h-screen bg-transparent">
        <ChatMessages
          runs={runs}
          onRetry={async (run) =>
            await handleSendMessage({
              conversationId: selectedConversationId !== null ? String(selectedConversationId) : undefined,
              userInput: run.user_input,
              files: run.files?.map((f: RunFile) => f.file) || [],
              filePreviews: run.files,
            })
          }
          userId={user?.id}
        />
        <div ref={messagesEndRef} />
        {user && (
          <ChatInput
            conversationId={selectedConversationId !== null ? String(selectedConversationId) : undefined}
            user={user}
            sendMessage={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
}