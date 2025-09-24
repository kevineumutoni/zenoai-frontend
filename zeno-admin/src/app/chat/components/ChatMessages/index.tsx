"use client";

import ChatMessage from "../ChatMessage";
import FeedbackButtons from "../FeedbackButtons";
import ChatArtifactRenderer from "./components/ArtifactRender";
import Image from "next/image";

type ChatMessagesProps = {
  runs: any[];
  onRetry?: (run: any) => void;
  userId?: number;
};

export default function ChatMessages({
  runs,
  onRetry,
  userId,
}: ChatMessagesProps) {
  console.log("Rendering ChatMessages with runs:", runs);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 w-[50vw] ml-120   scrollbar-hide">
      {runs.map((run) => (
        <div key={run.id} className="space-y-3">
          <ChatMessage role="user" text={run.user_input} />

          {run.status === "pending" && <ChatMessage role="agent" loading />}

          {run.status === "completed" && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
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

              <div className="mt-2 flex">
                <FeedbackButtons
                  responseId={String(run.id)}
                  responseText={run.final_output || ""}
                  userId={userId ?? 0}
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
    </div>
  );
}
