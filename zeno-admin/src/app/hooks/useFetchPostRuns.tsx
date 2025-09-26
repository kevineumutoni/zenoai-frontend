import { useEffect, useRef, useState } from "react";
import { createRun, fetchRunById } from "../utils/fetchPostRuns";
import { RunLike } from "../utils/types/chat";
import { RunFile } from "../utils/types/chat";

export function useRuns(user?: { id: number; token: string }) {
  const [runs, setRuns] = useState<RunLike[]>([]);
  const pollingRef = useRef<Map<number, number>>(new Map());

  useEffect(function cleanup() {
    return function () {
      pollingRef.current.forEach(clearInterval);
      pollingRef.current.clear();
    };
  }, []); 6

  function normalizeRun(run: Partial<RunLike>): RunLike {
    return {
      id: run.id || String(Date.now()),
      user_input: run.user_input || "",
      status: (run.status || "pending").toLowerCase(),
      final_output: run.final_output === undefined ? null : run.final_output,
      output_artifacts: run.output_artifacts || [],
      started_at: run.started_at || new Date().toISOString(),
      error: run.error,
    };
  }

  async function sendMessage({
    conversationId,
    userInput,
    files = [],
    filePreviews,
  }: {
    conversationId?: string | null;
    userInput: string;
    files?: File[];
    filePreviews?: RunFile[];
  }): Promise<RunLike> {
    var tempId = "temp-" + Date.now();

    var optimisticFiles = filePreviews || files.map(function (file) {
      return { file: file, previewUrl: "" };
    });

    var displayInput = files.length > 0 ? files
      .map(function (f) {
        return f.name;
      })
      .join(", ")
      : userInput;

    setRuns(function (prev) {
      return prev.concat([
        {
          id: tempId,
          user_input: displayInput,
          status: "pending",
          final_output: null,
          output_artifacts: [],
          started_at: new Date().toISOString(),
          _optimistic: true,
          files: optimisticFiles,
        },
      ]);
    });

    try {
      var backendRun = await createRun(
        conversationId || null,
        userInput,
        user && user.token,
        files
      );
      var normalized = normalizeRun(backendRun);

      setRuns(function (prev) {
        return prev.map(function (run) {
          if (run.id === tempId) {
            var updated = Object.assign({}, normalized);
            updated.files = run.files;
            return updated;
          }
          return run;
        });
      });

      var runId = Number(backendRun.id);
      if (runId > 0) startPolling(runId);

      return normalized;
    } catch (err) {
      var message = (err as { message?: string }).message || String(err);

      setRuns(function (prev) {
        return prev.map(function (run) {
          if (run.id === tempId) {
            var failedRun = Object.assign({}, run);
            failedRun.status = "failed";
            failedRun.error = message;
            return failedRun;
          }
          return run;
        });
      });

      throw err;
    }
  }

  function startPolling(runId: number) {
    if (pollingRef.current.has(runId)) return;

    var intervalId = window.setInterval(async function () {
      try {
        var updated = normalizeRun(await fetchRunById(runId, user && user.token));

        setRuns(function (prev) {
          return prev.map(function (run) {
            if (Number(run.id) === runId) {
              var merged = Object.assign({}, run);
              merged.id = updated.id;
              merged.user_input = updated.user_input;
              merged.status = updated.status;
              merged.final_output = updated.final_output;
              merged.output_artifacts = updated.output_artifacts;
              merged.started_at = updated.started_at;
              merged.error = updated.error;
              merged.files = run.files;
              return merged;
            }
            return run;
          });
        });

        if (updated.status === "completed" || updated.status === "failed") {
          clearInterval(intervalId);
          pollingRef.current.delete(runId);
        }
      } catch (e) {
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

  return { runs: runs, sendMessage: sendMessage, clearRuns: clearRuns, setRuns: setRuns };
}
