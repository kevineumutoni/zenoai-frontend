import { useEffect, useRef, useState } from "react";
import { createRun, fetchRunById } from "../utils/postRuns";

export interface RunLike {
  id: number | string; // keep union because tempId is a string
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

    const displayInput =
      files.length > 0 ? files.map((f) => f.name).join(", ") : userInput;

    setRuns((prev) => [
      ...prev,
      {
        id: tempId,
        user_input: displayInput,
        status: "pending",
        final_output: null,
        output_artifacts: [],
        started_at: new Date().toISOString(),
        _optimistic: true,
        files,
      },
    ]);

    try {
      const backendRun = await createRun(
        conversationId ?? null,
        userInput,
        user?.token,
        files
      );

      const normalized = normalizeRun(backendRun);

      setRuns((prev) =>
        prev.map((r) =>
          r.id === tempId ? { ...normalized, files: r.files } : r
        )
      );

      const runId = Number(backendRun.id);
      if (!isNaN(runId)) startPolling(runId);

      return normalized;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";

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

    const intervalId = window.setInterval(async () => {
      try {
        const updated = normalizeRun(await fetchRunById(runId, user?.token));

        setRuns((prev) =>
          prev.map((r) =>
            Number(r.id) === runId ? { ...r, ...updated, files: r.files } : r
          )
        );

        if (["completed", "failed"].includes(updated.status)) {
          clearInterval(intervalId);
          pollingRef.current.delete(runId);
        }
      } catch (err) {
        console.error("[useRuns] Polling failed for run", runId, err);
        clearInterval(intervalId);
        pollingRef.current.delete(runId);
      }
    }, 2000);

    pollingRef.current.set(runId, intervalId);
  }

  function clearRuns() {
    setRuns([]);
    pollingRef.current.forEach(clearInterval);
    pollingRef.current.clear();
  }

  return { runs, sendMessage, clearRuns, setRuns };
}