export async function createConversation(userId: number, token: string) {
  try {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to create conversation");
    }

    return data;
  } catch (err) {
    throw err;
  }
}
