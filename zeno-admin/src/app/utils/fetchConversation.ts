export async function createConversation(userId: number) {
  try {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to create conversation");
    }

    return data;
  } catch (err) {
    throw err;
  }
}