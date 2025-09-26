import { useState, useEffect } from "react";

export function useUserConversations(token: string) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/conversations/with_runs/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => res.json())
      .then(data => setConversations(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchConversations();
  }, [token]);

  return { conversations, loading, error, refetch: fetchConversations };
}