import { sendFeedback } from "../utils/sendfeedback";

global.fetch = jest.fn();

describe("sendFeedback", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send feedback successfully", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const result = await sendFeedback({
      feedbackType: "like",
      comment: "Great response",
      userId: 1,
      token: "testtoken",
    });

    expect(fetch).toHaveBeenCalledWith("/api/feedback", expect.any(Object));
    expect(result).toEqual({ success: true });
  });

  it("should throw error on failure", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Failed" }),
    });

    await expect(
      sendFeedback({
        feedbackType: "dislike",
        comment: "Bad response",
        userId: 1,
      })
    ).rejects.toThrow("Failed");
  });
});
