"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "../ChatMessageCard";
import FeedbackButtons from "../FeedbackButtons";
import ChatArtifactRenderer from "./components/ArtifactRender";
import Image from "next/image";
import type { ChatMessagesProps } from "../../../utils/types/chat";
import type { RunLike } from "../../../hooks/usepostRuns";

export default function ChatMessages({
  runs,
  onRetry,
  userId,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [runs]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 w-[50vw] ml-110 scrollbar-hide">
      {runs.map((run: RunLike) => (
        <div key={run.id} className="space-y-3">
          {run.files && run.files.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end">
              {run.files.map((file: File, idx: number) => (
                <div
                  key={idx}
                  className="bg-[#9FF8F8] text-black rounded-xl p-2 max-w-[60%]"
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="max-h-32 rounded-lg"
                      onLoad={(e) =>
                        URL.revokeObjectURL((e.target as HTMLImageElement).src)
                      }
                    />
                  ) : (
                    <span className="text-sm">{file.name}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {run.user_input && <ChatMessage role="user" text={run.user_input} />}

          {run.status === "pending" && <ChatMessage role="agent" loading />}

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
