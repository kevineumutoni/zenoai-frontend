'use client';
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

export default function DashboardMain({ onRunCreated, conversationId, user, sendMessage }: DashboardMainProps) {
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
          sendMessage={sendMessage}
          onRunCreated={onRunCreated}
        />
      </div>
    </div>
  );
}