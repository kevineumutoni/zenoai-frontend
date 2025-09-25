import { useEffect, useRef, useState } from "react";
import { createRun, fetchRunById } from "../utils/postRuns";

export interface RunLike {
  id: string | number;
  user_input: string;
  status: string;
  final_output: string | null;
  output_artifacts: any[];
  started_at: string;
  _optimistic?: boolean;
  files?: File[];
  error?: string;
}

export function useRuns(user?: { id: number; token: string }) {
  const [runs, setRuns] = useState<RunLike[]>([]);
  const pollingRef = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    return () => {
      pollingRef.current.forEach(clearInterval);
      pollingRef.current.clear();
    };
  }, []);

  function normalizeRun(run: Partial<RunLike>): RunLike {
    return {
      id: run.id ?? `unknown-${Date.now()}`,
      user_input: run.user_input ?? "",
      status: run.status?.toLowerCase() ?? "pending",
      final_output: run.final_output ?? null,
      output_artifacts: run.output_artifacts ?? [],
      started_at: run.started_at ?? new Date().toISOString(),
      error: run.error,
      files: run.files ?? [], // ensure array
    };
  }

  async function sendMessage({
    conversationId,
    userInput,
    files = [],
  }: {
    conversationId?: string | null;
    userInput: string;
    files?: File[];
  }): Promise<RunLike> {
    const tempId = `temp-${Date.now()}`;

    // :eyes: Add optimistic run
    setRuns((prev) => [
      ...prev,
      {
        id: tempId,
        user_input: userInput,
        status: "pending",
        final_output: null,
        output_artifacts: [],
        started_at: new Date().toISOString(),
        _optimistic: true,
        files,
      },
    ]);

    try {
      const backendRun = normalizeRun(
        await createRun(conversationId ?? null, userInput, user?.token, files)
      );

      setRuns((prev) =>
        prev.map((r) =>
          r.id === tempId
            ? { ...backendRun, files: r.files } // :white_check_mark: Keep optimistic files
            : r
        )
      );

      const runId = Number(backendRun.id);
      if (!isNaN(runId)) startPolling(runId);

      return { ...backendRun, files };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";

      setRuns((prev) =>
        prev.map((r) =>
          r.id === tempId ? { ...r, status: "failed", error: message } : r
        )
      );

      throw err;
    }
  }

  function startPolling(runId: number) {
    if (pollingRef.current.has(runId)) return;

    const id = window.setInterval(async () => {
      try {
        const updated = normalizeRun(await fetchRunById(runId, user?.token));

        setRuns((prev) =>
          prev.map((r) =>
            r.id === runId
              ? { ...r, ...updated, files: r.files } // :white_check_mark: Preserve files
              : r
          )
        );

        if (["completed", "failed"].includes(updated.status)) {
          clearInterval(id);
          pollingRef.current.delete(runId);
        }
      } catch (err) {
        console.error("[useRuns] Polling failed for run", runId, err);
        clearInterval(id);
        pollingRef.current.delete(runId);
      }
    }, 2000);

    pollingRef.current.set(runId, id);
  }

  function clearRuns() {
    setRuns([]);
    pollingRef.current.forEach(clearInterval);
    pollingRef.current.clear();
  }

  return { runs, sendMessage, clearRuns, setRuns };
}