export async function createRun(
  conversationId: string | null,
  userInput: string,
  token?: string
) {
  try {
    const res = await fetch("/api/conversationruns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
      body: JSON.stringify({ conversationId, userInput }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to create run");
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export async function fetchRunById(runId: number, token?: string) {
  try {
    const res = await fetch(`/api/run?id=${runId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch run");
    }

    return data;
  } catch (err) {
    throw err;
  }
}
