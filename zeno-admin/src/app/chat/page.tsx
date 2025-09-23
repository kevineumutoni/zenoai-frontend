"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { useConversation } from "../hooks/usepostConversations";
import { useRuns } from "../hooks/usepostRuns";

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const user = token
    ? { id: Number(localStorage.getItem("userId")), token }
    : null;

  const { conversationId, initConversation, resetConversation } = useConversation(
    user?.id,
    user?.token
  );
  const { runs, sendMessage, clearRuns } = useRuns(user ?? undefined);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [runs]);

  async function handleSend(input: string) {
    if (!input.trim()) return;

    let convId = conversationId;
    if (user?.id && user?.token && !conversationId) {
      convId = await initConversation();
    }

    try {
      await sendMessage(input, convId);
    } catch (err) {
      console.error("sendMessage error", err);
    }
  }

  return (
    <div className="relative flex flex-col h-screen text-white">
      <Image
        src="/images/zeno-chat.png"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative flex flex-col h-full bg-transparent">
        <ChatHeader
          onNewChat={() => {
            resetConversation();
            clearRuns();
          }}
        />

        <ChatMessages
          runs={runs}
          onRetry={(run) => sendMessage(run.user_input, conversationId)}
        />

        <div ref={messagesEndRef} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
