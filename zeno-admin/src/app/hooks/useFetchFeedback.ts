import { useState } from "react";
import { sendFeedback } from "../utils/fetchFeedback";

export function useSendFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submitFeedback(options: {
    feedbackType: "like" | "dislike";
    comment: string;
    userId: number;
    token?: string;
  }) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await sendFeedback(options);
      setSuccess("Feedback submitted successfully");
      return response;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to send feedback");
        throw err;
      } else {
        setError("Failed to send feedback");
        throw new Error("Failed to send feedback");
      }
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setError(null);
    setSuccess(null);
  }

  return { submitFeedback, loading, error, success, clear };
}