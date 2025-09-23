export async function sendFeedback({
  responseId,
  responseText,
  feedbackType,
  comment,
  userId,
  token,
}: {
  responseId?: string;
  responseText?: string;
  feedbackType: "like" | "dislike";
  comment?: string;
  userId: number;
  token?: string;
}) {
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
      body: JSON.stringify({ responseId, responseText, feedbackType, comment, userId }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to submit feedback");
    return data;
  } catch (err) {
    console.error("sendFeedback error:", err);
    throw err;
  }
}
