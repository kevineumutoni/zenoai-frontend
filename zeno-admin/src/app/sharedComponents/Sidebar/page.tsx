// components/chat/ChatSidebar.tsx
import { useState } from 'react';
import Image from 'next/image';

interface ChatItem {
  id: string;
  title: string;
}

const ChatSidebar = ({ activeChatId, onChatSelect }: { activeChatId: string; onChatSelect: (id: string) => void }) => {
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');

  const chats: ChatItem[] = [
    { id: '1', title: 'Zeno AI is an economics...' },
    { id: '2', title: 'If tariff increased by 5% on...' },
    { id: '3', title: 'If tariff increased by 5% on...' },
    { id: '4', title: 'If tariff increased by 5% on...' },
  ];

  const handleNewChat = () => {
    if (newChatTitle.trim()) {
      // In real app, you'd create new chat and push to DB
      console.log('Creating new chat:', newChatTitle);
      setNewChatTitle('');
      setShowNewChat(false);
    }
  };

  return (
    <div className="w-80 bg-[#0d0d26] border-r border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="text-xl font-bold">Zeno AI</span>
        </div>
        <Image src="/images/avatar.png" alt="User" width={32} height={32} className="rounded-full" />
      </div>

      {/* Add New Chat */}
      <button
        onClick={() => setShowNewChat(!showNewChat)}
        className="w-full flex items-center justify-between p-3 bg-[#1a1a3a] hover:bg-[#2a2a4a] rounded-lg mb-4 transition"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Add a new chat</span>
        </div>
        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {showNewChat && (
        <div className="p-3 border border-gray-600 rounded-lg mb-4">
          <input
            type="text"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            placeholder="Enter chat title..."
            className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400"
          />
          <button
            onClick={handleNewChat}
            className="mt-2 w-full py-1 bg-cyan-600 hover:bg-cyan-500 rounded-md text-sm"
          >
            Create
          </button>
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`w-full text-left p-3 rounded-lg mb-1 transition ${
              activeChatId === chat.id ? 'bg-[#1a1a3a]' : 'hover:bg-[#1a1a3a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="truncate">{chat.title}</span>
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 space-y-2">
        <button className="w-full flex items-center justify-center space-x-2 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>User Guide</span>
        </button>
        <button className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-500 hover:bg-gray-700 rounded-md text-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6 4h.01M7 8h.01M7 12h.01M7 16h.01M17 8h.01M17 12h.01M17 16h.01M12 8v4m0 4h.01M12 16h.01" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;