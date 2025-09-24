"use client";
import { useEffect, useRef } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInputWrapper from "./components/ChatInputWrapper";
import { useConversation } from "../hooks/usepostConversations";
import { useRuns } from "../hooks/usepostRuns";

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const user = token
    ? { id: Number(localStorage.getItem("userId")), token }
    : null;

  const { conversationId, resetConversation } = useConversation(
    user?.id,
    user?.token
  );
  const { runs, sendMessage, clearRuns } = useRuns(user ?? undefined);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [runs]);

  return (
    <div className="relative flex flex-col h-screen text-white">
      <div className="absolute inset-0 " />

      <div className="relative flex flex-col h-full bg-transparent">
        <ChatHeader
          onNewChat={() => {
            resetConversation();
            clearRuns();
          }}
        />

        <ChatMessages
          runs={runs}
          onRetry={(run) =>
            sendMessage({
              conversationId,
              userInput: run.user_input,
              files: run.files || [],
            })
          }
        />

        <div ref={messagesEndRef} />

        {user && (
          <ChatInputWrapper
            conversationId={conversationId}
            user={user}
            sendMessage={sendMessage} 
          />
        )}
      </div>
    </div>
  );
}
