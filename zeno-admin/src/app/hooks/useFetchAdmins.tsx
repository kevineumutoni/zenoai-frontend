'use client';

import { useEffect, useState } from 'react';
import { fetchCurrentAdmin, updateCurrentAdmin } from '../utils/fetchAdmins';

export interface User {
  id?: number;
  user_id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  registeredDate?: string;
  image?: string;
  password?: string;
  [key: string]: any;
}

const usefetchAdmins = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const userData = await fetchCurrentAdmin();
      setUser({
        ...userData,
        id: userData.id ?? userData.user_id,
        user_id: userData.user_id ?? userData.id,
      });
      setError(null);
    } catch (error) {
      setError((error as Error).message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateAdmin = async (id: number | string, data: Partial<User>) => {
    setLoading(true);
    try {
      const updatedUser = await updateCurrentAdmin(id, data);
      setUser({
        ...updatedUser,
        id: updatedUser.id ?? updatedUser.user_id,
        user_id: updatedUser.user_id ?? updatedUser.id,
      });
      setError(null);
      return updatedUser;
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return {
    user,
    loading,
    error,
    updateAdmin,
    refetch: fetchAdmins,
  };
};

export default usefetchAdmins;