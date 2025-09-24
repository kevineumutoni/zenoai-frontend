
export async function createRun(
  conversationId: string | null,
  userInput: string,
  token?: string,
  files?: File[]
) {
  try {
    let body: BodyInit;
    let headers: HeadersInit = {};

    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append("userInput", userInput);
      if (conversationId) formData.append("conversationId", conversationId);

      files.forEach((file) => formData.append("files", file));

      body = formData;
      if (token) headers["Authorization"] = `Token ${token}`;
    } else {
      headers["Content-Type"] = "application/json";
      if (token) headers["Authorization"] = `Token ${token}`;
      body = JSON.stringify({ conversationId, userInput });
    }

    const res = await fetch("/api/conversationruns", {
      method: "POST",
      headers,
      body,
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
