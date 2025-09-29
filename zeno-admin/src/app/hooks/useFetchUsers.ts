import { useState, useEffect } from "react";
import { fetchUsers } from "../utils/fetchUsers";
import type { User } from "../utils/types/runs";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadUsers() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      const message = (err as Error).message || "An unknown error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return { users, loadUsers, loading, error };
}
