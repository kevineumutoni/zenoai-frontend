export async function sendFeedback({
  feedbackType,
  comment,
  userId,
  token,
}: {
  feedbackType: "like" | "dislike";
  comment?: string;
  userId: number;
  token?: string;
}) {
  if (!comment || !comment.trim()) {
    throw new Error("Review cannot be empty");
  }

  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
      body: JSON.stringify({
        review_text: comment.trim(),
        rating: feedbackType === "like" ? 1 : 0,
        user: userId,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to submit feedback");
    return data;
  } catch (err) {
    console.error("sendFeedback error:", err);
    throw err;
  }
}
