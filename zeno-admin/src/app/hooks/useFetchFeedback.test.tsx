import { renderHook, act } from "@testing-library/react";
import { useSendFeedback } from "./useFetchFeedback";
import * as sendFeedbackModule from "../utils/fetchFeedback";

type FeedbackResponse = { success: boolean; message: string };

describe("useSendFeedback", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should handle successful feedback", async () => {
    const mockResponse: FeedbackResponse = { success: true, message: "OK" };
    jest.spyOn(sendFeedbackModule, "sendFeedback").mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSendFeedback());

    let response: FeedbackResponse | undefined;
    await act(async () => {
      response = await result.current.submitFeedback({
        feedbackType: "like",
        comment: "Great job",
        userId: 1,
      });
    });

    expect(response).toEqual(mockResponse);
    expect(result.current.success).toBe("Feedback submitted successfully");
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("should handle feedback error", async () => {
    jest
      .spyOn(sendFeedbackModule, "sendFeedback")
      .mockRejectedValue(new Error("Failed"));

    const { result } = renderHook(() => useSendFeedback());

    await act(async () => {
      await expect(
        result.current.submitFeedback({
          feedbackType: "dislike",
          comment: "Bad experience",
          userId: 1,
        })
      ).rejects.toThrow("Failed");
    });

    expect(result.current.success).toBeNull();
    expect(result.current.error).toBe("Failed");
    expect(result.current.loading).toBe(false);
  });
});