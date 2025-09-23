"use client";
import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    try {
      await onSend(input.trim());
    } catch {
    } finally {
      setInput("");
      setSending(false);
    }
  };

  return (
    <div className="p-4 border-t border-gray-700 w-[60vw] ml-100">
      <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 shadow-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 transition disabled:opacity-50"
        >
          <Send className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}
