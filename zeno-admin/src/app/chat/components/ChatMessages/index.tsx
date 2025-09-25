"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "../ChatMessageCard";
import FeedbackButtons from "../FeedbackButtons";
import ChatArtifactRenderer from "./components/ArtifactRender";
import Image from "next/image";
import type { ChatMessagesProps , Run} from "../../../utils/types/chat";

export default function ChatMessages({
  runs,
  onRetry,
  userId,
}: ChatMessagesProps) {
  console.log("Rendering ChatMessages with runs:", runs);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [runs]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 w-[50vw] ml-110 scrollbar-hide">
      {runs.map((run) => (
        <div key={run.id} className="space-y-3">
          {/* User message */}
          <ChatMessage role="user" text={run.user_input} />

          {/* ✅ File Previews (if any) */}
        {run.files && run.files.length > 0 && (
  <div className="flex flex-wrap gap-3 ml-auto max-w-[60%]">
    {run.files.map((file: File, idx: number) => (
      <div
        key={idx}
        className="bg-gray-100 text-gray-900 p-2 rounded-xl text-sm shadow-md flex flex-col items-center"
      >
        {file.type.startsWith("image/") ? (
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-24 h-24 object-cover rounded-md"
          />
        ) : (
          <span className="truncate max-w-[150px]">{file.name}</span>
        )}
      </div>
    ))}
  </div>
)}


          {/* Agent loading */}
          {run.status === "pending" && <ChatMessage role="agent" loading />}

          {/* Agent response */}
          {run.status === "completed" && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Image
                  src="/images/zeno-logo-icon.png"
                  alt="Zeno AI Logo"
                  width={28}
                  height={28}
                />
                <span className="text-white font-semibold">Zeno AI</span>
              </div>

              {run.final_output && (
                <ChatMessage
                  role="agent"
                  text={run.final_output}
                  runId={run.id}
                  userId={userId}
                />
              )}

              {run.output_artifacts?.map((artifact: any) => (
                <ChatArtifactRenderer
                  key={artifact.id}
                  artifactType={artifact.artifact_type}
                  artifactData={artifact.data}
                  text={artifact.title}
                />
              ))}

              <div className="flex">
                <FeedbackButtons
                  userId={userId ?? 0}
                  textToCopy={run.final_output || ""}
                />
              </div>
            </div>
          )}

          {/* Failed message */}
          {run.status === "failed" && (
            <div className="flex items-center gap-2">
              <span className="text-red-500">Failed to send</span>
              {onRetry && (
                <button
                  onClick={() => onRetry(run)}
                  className="text-blue-400 underline"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
