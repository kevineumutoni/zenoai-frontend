'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ChatInput from "../../../sharedComponents/ChatInput";
import { RunLike } from "../../../utils/types/chat";

type DashboardMainProps = {
  onRunCreated?: (run: RunLike) => void;
  conversationId?: string | null;
  user: { id: number; token: string };
  sendMessage: (params: {
    conversationId?: string | null;
    userInput: string;
    files?: File[];
    filePreviews?: { file: File; previewUrl: string }[];
  }) => Promise<RunLike>;
};

export default function DashboardMain({
  onRunCreated,
  conversationId,
  user,
  sendMessage,
}: DashboardMainProps) {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSendMessage = async (params: {
    conversationId?: string | null;
    userInput: string;
    files?: File[];
    filePreviews?: { file: File; previewUrl: string }[];
  }): Promise<RunLike> => {
    if (!user?.token) {
      setShowLoginModal(true);
      return {
        id: Date.now(),
        user_input: params.userInput,
        status: "blocked",
        final_output: "",
        output_artifacts: [],
        started_at: new Date().toISOString(),
      };
    }
    const run = await sendMessage(params);
    if (onRunCreated) onRunCreated(run);
    return run;
  };

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen pt-4 px-2 ">
      <div className="flex flex-col items-center justify-center mb-8 w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl px-2">
        <div className="flex justify-center w-full">
          <Image
            src="/images/Group 150.png"
            alt="Zeno Logo"
            width={100}
            height={100}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="mt-6 text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold text-white text-center flex flex-wrap items-center justify-center gap-x-2 md:gap-x-4">
          Ask
          <span className="text-cyan-400">Zeno,</span>
          Know
          <span className="text-cyan-400">More!</span>
        </h1>
      </div>
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl px-2">
        <ChatInput
          conversationId={conversationId}
          user={user}
          sendMessage={handleSendMessage}
          onRunCreated={onRunCreated}
        />
      </div>
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative bg-gray-900 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                lineHeight: "1",
              }}
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-white mb-4">
              You have to login to access Zeno AI
            </h3>
            <button
              onClick={() => {
                setShowLoginModal(false);
                router.push("/signin");
              }}
              className="bg-cyan-400 text-[#0B182F] px-5 py-3 rounded-full font-bold text-lg hover:bg-cyan-300 transition mt-4 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}