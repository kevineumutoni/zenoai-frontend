"use client";

import { useEffect, useRef } from "react";
import UserMessage from "./components/UserMessageCard";
import AgentMessage from "./components/AgentMessageCard";
import FeedbackButtons from "../FeedbackButtons";
import ChatArtifactRenderer from "./components/ArtifactRender";
import type { ChatMessagesProps } from "../../../utils/types/chat";

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
      {runs.map((run) => (
        <div key={run.id} className="">
          <UserMessage text={run.user_input} files={run.files} />

          {run.status === "pending" && <AgentMessage loading />}

          {run.status === "completed" && (
            <>
              <AgentMessage text={run.final_output} />

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
            </>
          )}

          {run.status === "failed" && (
            <div className="flex items-center gap-2 ml-10">
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