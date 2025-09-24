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

  function normalizeRun(run: RunLike): RunLike {
    return { ...run, status: run.status?.toLowerCase() };
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

      setRuns((prev) => prev.map((r) => (r.id === tempId ? backendRun : r)));
      startPolling(Number(backendRun.id));

      return backendRun; 
    } catch (err) {
      setRuns((prev) =>
        prev.map((r) =>
          r.id === tempId
            ? { ...r, status: "failed", error: (err as Error).message }
            : r
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
          prev.map((r) => (r.id === runId ? { ...r, ...updated } : r))
        );

        if (["completed", "failed"].includes(updated.status)) {
          clearInterval(id);
          pollingRef.current.delete(runId);
        }
      } catch {
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
