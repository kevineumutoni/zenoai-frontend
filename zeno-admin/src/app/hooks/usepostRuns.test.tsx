import { renderHook, act } from "@testing-library/react";
import { useRuns } from "../hooks/usepostRuns";
import * as postRunsApi from "../utils/postRuns";

describe("useRuns", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should optimistically add a run and then replace with backend run", async () => {
    const mockBackendRun = {
      id: 123,
      user_input: "Hello",
      status: "COMPLETED",
      final_output: "World",
      output_artifacts: [],
      started_at: new Date().toISOString(),
    };

    jest.spyOn(postRunsApi, "createRun").mockResolvedValueOnce(mockBackendRun);

    const { result } = renderHook(() => useRuns({ id: 1, token: "fake-token" }));

    await act(async () => {
      await result.current.sendMessage({
        userInput: "Hello",
        conversationId: "conv-1",
      });
    });

    expect(result.current.runs).toHaveLength(1);
    expect(result.current.runs[0]).toMatchObject({
      id: 123,
      user_input: "Hello",
      status: "completed", 
      final_output: "World",
    });
  });

  it("should mark run as failed if createRun throws", async () => {
    jest
      .spyOn(postRunsApi, "createRun")
      .mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useRuns({ id: 1, token: "fake-token" }));

    await act(async () => {
      await expect(
        result.current.sendMessage({
          userInput: "Hi there",
          conversationId: "conv-2",
        })
      ).rejects.toThrow("Network error");
    });

    expect(result.current.runs).toHaveLength(1);
    expect(result.current.runs[0].status).toBe("failed");
    expect(result.current.runs[0].error).toBe("Network error");
  });

  it("should start polling and update runs when fetchRunById resolves", async () => {
    const mockBackendRun = {
      id: 456,
      user_input: "Polling test",
      status: "PENDING",
      final_output: null,
      output_artifacts: [],
      started_at: new Date().toISOString(),
    };

    jest.spyOn(postRunsApi, "createRun").mockResolvedValueOnce(mockBackendRun);
    const fetchSpy = jest
      .spyOn(postRunsApi, "fetchRunById")
      .mockResolvedValueOnce({ ...mockBackendRun, status: "COMPLETED" });

    const { result } = renderHook(() => useRuns({ id: 1, token: "fake-token" }));

    await act(async () => {
      await result.current.sendMessage({
        userInput: "Polling test",
        conversationId: "conv-3",
      });
    });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(fetchSpy).toHaveBeenCalledWith(456, "fake-token");
    expect(result.current.runs[0].status).toBe("completed");
  });

  it("should clear runs and stop polling", async () => {
    jest.spyOn(postRunsApi, "createRun").mockResolvedValueOnce({
      id: 789,
      user_input: "Clear test",
      status: "PENDING",
      final_output: null,
      output_artifacts: [],
      started_at: new Date().toISOString(),
    });

    const { result } = renderHook(() => useRuns());

    await act(async () => {
      await result.current.sendMessage({ userInput: "Clear test" });
    });

    expect(result.current.runs).toHaveLength(1);

    act(() => {
      result.current.clearRuns();
    });

    expect(result.current.runs).toHaveLength(0);
  });
});
