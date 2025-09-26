"use client";
import { useState } from "react";
import Image from "next/image";
import { PanelLeft, PanelRight, Plus, MessageSquare, LogOut } from "lucide-react";

export default function Sidebar({
  conversations,
  selectedConversationId,
  setSelectedConversationId,
  onAddChat,
  onLogout,
  isMobile,
  showSidebar,
  setShowSidebar,
}: {
  conversations: { conversation_id: number; title: string; created_at: string }[];
  selectedConversationId: number | null;
  setSelectedConversationId: (id: number | null) => void;
  onAddChat: () => void;
  onLogout: () => void;
  isMobile: boolean;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const scrollStyle: React.CSSProperties = {
    overflowY: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    scrollBehavior: "smooth",
  };

  const collapsedSidebar = (
    <div className="h-full w-20 flex flex-col bg-[#001533] text-white transition-all duration-200">
      <div className="flex flex-col items-center flex-1 pt-4">
        <button
          className="mb-6 text-white p-2"
          onClick={() => setIsCollapsed(false)}
          aria-label="Expand Sidebar"
        >
          <PanelRight size={24} />
        </button>
        <button
          className="bg-blue-900/70 text-white rounded-full p-2 hover:bg-[#003366] my-2"
          onClick={onAddChat}
          aria-label="Add Chat"
        >
          <Plus size={20} />
        </button>
        <button
          className={`bg-blue-900/70 text-white rounded-full p-2 hover:bg-[#003366] my-2 ${
            conversations.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (conversations.length > 0)
              setSelectedConversationId(conversations[0].conversation_id);
          }}
          aria-label="Conversations"
        >
          <MessageSquare size={20} />
        </button>
      </div>
      <div className="pb-4 flex justify-center">
        <button
          className="bg-transparent border border-cyan-500 text-cyan-400 rounded-full p-2 hover:bg-cyan-500/10"
          onClick={() => setShowLogoutConfirm(true)}
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );

  const expandedSidebar = (
    <div className="h-full w-72 flex flex-col text-white transition-all duration-200 bg-[#001533] p-4 relative">
      <div className="flex items-center justify-between mb-6">
        <Image src="/images/zeno-logo-icon.png" alt="Zeno Logo" width={40} height={40} />
        <button
          className="text-white p-2"
          onClick={() => setIsCollapsed(true)}
          aria-label="Collapse Sidebar"
        >
          <PanelLeft size={24} />
        </button>
      </div>
      <button
        className="w-full bg-blue-900/70 text-white py-3 px-2 rounded-full flex items-center justify-center space-x-2 hover:bg-[#003366] mb-6 cursor-pointer"
        onClick={onAddChat}
        aria-label="Add a new chat"
      >
        <Plus className="w-5 h-5" />
        <span>Add a new chat</span>
      </button>
      <h3 className="text-sm text-gray-400 mb-4">Conversations</h3>
      <div
        className="flex-1 sidebar-conversations"
        style={scrollStyle}
      >
        {conversations.length === 0 && (
          <div className="text-gray-500 text-center mt-8">No conversations yet</div>
        )}
        {conversations.map((c) => (
          <div
            key={c.conversation_id}
            className={`p-3 rounded-lg mb-3 flex items-center transition-colors cursor-pointer ${
              selectedConversationId === c.conversation_id
                ? "bg-[#003366]"
                : "hover:bg-[#003366]"
            }`}
            onClick={() => {
              setSelectedConversationId(c.conversation_id);
              if (isMobile) setShowSidebar(false);
            }}
            title={c.title || "Untitled Conversation"}
            tabIndex={0}
            role="button"
            aria-label={c.title || "Untitled Conversation"}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                setSelectedConversationId(c.conversation_id);
                if (isMobile) setShowSidebar(false);
              }
            }}
          >
            <MessageSquare className="mr-2" size={18} />
            <span className="truncate max-w-[170px] font-medium">{c.title || "Untitled Conversation"}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4">
        <button
          className="w-full bg-transparent border border-cyan-500 text-cyan-400 py-2 px-4 rounded-full flex items-center justify-center space-x-2 hover:bg-cyan-500/10"
          onClick={() => setShowLogoutConfirm(true)}
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Confirm Logout</h3>
            <p className="text-gray-300 mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {isMobile && showSidebar ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex">
          {isCollapsed ? collapsedSidebar : expandedSidebar}
        </div>
      ) : isCollapsed ? collapsedSidebar : expandedSidebar}
      <style>{`
        .sidebar-conversations {
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: smooth;
        }
        .sidebar-conversations::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}