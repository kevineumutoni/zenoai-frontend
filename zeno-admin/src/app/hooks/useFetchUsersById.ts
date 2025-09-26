import { useEffect, useState } from 'react';
import { fetchUsers } from '../utils/fetchUser';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image: string | null;
}

const useFetchUsers = (ids: number[]) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchUsers(ids);
        setUsers(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ids]);

  return { users, loading, error };
};

export default useFetchUsers;