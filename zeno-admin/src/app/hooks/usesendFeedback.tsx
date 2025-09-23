import { useState } from "react";
import { sendFeedback } from "../utils/sendfeedback";

export function useSendFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submitFeedback(options: {
    responseId?: string;
    responseText?: string;
    feedbackType: "like" | "dislike";
    comment?: string;
    userId: number;
    token?: string;
  }) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await sendFeedback(options);
      setSuccess(true);
      return true;
    } catch (err) {
      setError((err as Error).message || "Failed to send feedback");
      return false;
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setError(null);
    setSuccess(false);
  }

  return { submitFeedback, loading, error, success, clear };
}
