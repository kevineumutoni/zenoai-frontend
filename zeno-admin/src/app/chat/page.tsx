"use client";
import { useEffect, useRef } from "react";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "../sharedComponents/ChatInput";
import { useConversation } from "../hooks/usepostConversations";
import { useRuns, RunFile } from "../hooks/usepostRuns"; 

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const user = token
    ? { id: Number(localStorage.getItem("userId")), token }
    : null;

  const { conversationId } = useConversation(user?.id, user?.token);
  const { runs, sendMessage } = useRuns(user ?? undefined);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [runs]);

  return (
    <div className="relative flex flex-col h-screen text-white">
      <div className="absolute inset-0" />

      <div className="relative flex flex-col h-full bg-transparent">
        <ChatMessages
          runs={runs}
          onRetry={(run) =>
            sendMessage({
              conversationId,
              userInput: run.user_input,
              files: run.files?.map((f: RunFile) => f.file) || [], // ✅ Typed!
              filePreviews: run.files, // ✅ Already RunFile[] | undefined
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