import { useState, useEffect } from "react";
import { fetchUsers } from "../utils/fetchUsers";
type User = {
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  image?: string;
};

type UserStats = {
  total_users: number;
  new_users: number;
  loading: boolean;
  error?: string | null;
};

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>({
    total_users: 0,
    new_users: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const users: User[] = await fetchUsers();
        const total_users = users.length;

        const now = new Date();
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);

        const new_users = users.filter(user => {
          const created = new Date(user.created_at);
          return created >= oneWeekAgo && created <= now;
        }).length;

        setStats({
          total_users,
          new_users,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        setStats({
          total_users: 0,
          new_users: 0,
          loading: false,
          error: error.message || "Failed to load user stats",
        });
      }
    }

    loadStats();
  }, []);

  return stats;
}
