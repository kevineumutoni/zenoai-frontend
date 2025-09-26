"use client";
import { useEffect, useRef, useState } from "react";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "../sharedComponents/ChatInput";
import Sidebar from "../sharedComponents/Sidebar";
import { useConversation } from "../hooks/useFetchConversations";
import { useRuns } from "../hooks/useFetchPostRuns";
import { RunFile } from "../utils/types/chat";
import { createConversation } from "../utils/fetchConversation";

type Conversation = {
  conversation_id: number;
  title: string;
  created_at: string;
};

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const user = token
    ? { id: Number(localStorage.getItem("userId")), token }
    : null;

  const [conversationList, setConversationList] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSidebarConvs() {
      if (!token) return;
      const res = await fetch("http://127.0.0.1:8000/conversations/with_runs/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setConversationList(data.map((conv: any) => ({
        conversation_id: conv.conversation_id,
        title: conv.title,
        created_at: conv.created_at,
      })));
      if (data.length && !selectedConversationId) {
        setSelectedConversationId(data[0].conversation_id);
      }
    }
    fetchSidebarConvs();
  }, [token]);

  const { conversationId, setConversationId } = useConversation(user?.id, user?.token);
  const { runs, sendMessage } = useRuns(user ?? undefined);

  const handleSelectConversation = (id: number | null) => {
    setSelectedConversationId(id);
    if (id !== null) setConversationId(id); 
  };

  const handleAddChat = async () => {
    if (!user?.id || !token) return;
    try {
      const newConv = await createConversation(user.id, token);
      setConversationList(prev => [
        ...prev,
        {
          conversation_id: newConv.conversation_id,
          title: newConv.title,
          created_at: newConv.created_at,
        },
      ]);
      setSelectedConversationId(newConv.conversation_id);
      setConversationId(newConv.conversation_id);
    } catch (e) {
      alert("Failed to create conversation: " + (e.message || e));
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [runs]);

  const sidebarProps = {
    conversations: conversationList,
    selectedConversationId,
    setSelectedConversationId: handleSelectConversation,
    onAddChat: handleAddChat,
    onLogout: () => {
      localStorage.clear();
      window.location.reload();
    },
    isMobile: false,
    showSidebar: true,
    setShowSidebar: () => {},
  };

  return (
    <div className="flex h-screen text-white">
      <Sidebar {...sidebarProps} />
      <div className="relative flex flex-col h-full bg-transparent flex-1">
        <ChatMessages
          runs={runs}
          onRetry={run =>
            sendMessage({
              conversationId,
              userInput: run.user_input,
              files: run.files?.map((f: RunFile) => f.file) || [],
              filePreviews: run.files,
            })
          }
          userId={user?.id}
        />
        <div ref={messagesEndRef} className="ml-460" />
        {user && (
          <ChatInput
            conversationId={conversationId}
            user={user}
            sendMessage={sendMessage}
          />
        )}
      </div>
    </div>
  );
}