import React from 'react';
import Image from 'next/image';

interface AgentMessageProps {
  text?: string | null;
  loading?: boolean;
}

export default function AgentMessage({ text, loading }: AgentMessageProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-start">
        <div className="mb-2">
          <Image
            src="/images/zeno-logo-icon.png"
            alt="Zeno AI Logo"
            width={30}
            height={30}
          />
          <p></p>
        </div>
        <div className="bg-[#131F36] text-gray-300 p-3 rounded-2xl rounded-bl-none max-w-[70%]">
          Zeno AI is thinking...
        </div>
      </div>
    );
  }

  if (!text) return null;

  return (
    <div className="flex flex-col items-start">
      <div className="mb-2">
        <Image
          src="/images/zeno-logo-icon.png"
          alt="Zeno AI Logo"
          width={28}
          height={28}
        />
      </div>
      <div className="bg-[#131F36] text-white p-3 rounded-2xl rounded-bl-none max-w-[70%] whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}