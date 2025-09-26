export async function getConversationsWithRuns(token?: string) {
  if (!token) throw new Error("Missing token");
  const response = await fetch("/api/conversationruns", {
    headers: { Authorization: `Token ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch conversations with runs");
  return await response.json();
}