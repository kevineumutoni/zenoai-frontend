"use client";

import Image from "next/image";

type ChatMessageProps = {
  role: "user" | "agent";
  text?: string;
  artifactType?: "text" | "chart" | "table";
  artifactData?: any;
  loading?: boolean;
  runId?: string | number; 
  userId?: number;         
};

export default function ChatMessage({
  role,
  text,
  artifactType = "text",
  artifactData,
  loading = false,
  runId,
  userId,
}: ChatMessageProps) {
  const isAgent = role === "agent";

  return (
    <div
      className={`max-w-[60%] space-y-2 ${
        isAgent ? "mr-auto" : "ml-auto text-left"
      }`}
    >
      {isAgent}

      <div
        className={`p-3 rounded-2xl shadow-md break-words whitespace-pre-wrap ${
          isAgent ? "bg-[#131F36] text-gray-200" : "bg-[#39b4b4] text-black"
        }`}
      >
        {loading ? (
          <span className="flex space-x-1">
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
          </span>
        ) : artifactType === "text" ? (
          <p>{text}</p>
        ) : artifactType === "chart" ? (
          <div className="bg-[#0B182F] p-2 rounded-lg">
            <pre className="text-xs">{JSON.stringify(artifactData, null, 2)}</pre>
          </div>
        ) : artifactType === "table" && artifactData?.rows ? (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                {artifactData.columns?.map((col: string, idx: number) => (
                  <th key={idx} className="border-b border-gray-700 p-1">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {artifactData.rows.map((row: any[], idx: number) => (
                <tr key={idx}>
                  {row.map((cell, cidx) => (
                    <td key={cidx} className="border-b border-gray-800 p-1">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      {isAgent && text && userId !== undefined}
    </div>
  );
}
