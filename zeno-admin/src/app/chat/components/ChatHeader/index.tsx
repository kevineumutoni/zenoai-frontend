"use client";

export default function ChatHeader({ onNewChat }: { onNewChat?: () => void }) {
  return (
    <div className="p-4 border-b border-gray-700 flex items-center gap-3 bg-transparent shadow-md">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
      <h1 className="text-lg font-semibold">Zeno AI</h1>

      <div className="ml-auto flex items-center gap-2">
        {onNewChat && (
          <button
            onClick={onNewChat}
            className="text-sm bg-gray-800 px-3 py-1 rounded-md hover:bg-gray-700"
          >
            New Chat
          </button>
        )}
      </div>
    </div>
  );
}
