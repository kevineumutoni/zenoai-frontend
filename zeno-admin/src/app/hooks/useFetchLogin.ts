import { useState } from 'react';
import { fetchLogin } from '../utils/fetchLogin';

export function useFetchLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function login(email: string, password: string) {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLogin(email, password);
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        if (data.id) {
          localStorage.setItem('id', data.id.toString());
        }
        if (data.role) {
          localStorage.setItem('role', data.role);
        }
      }
      setIsLoading(false);
      return data;
    } catch (error) {
      setError(error as Error);
      setIsLoading(false);
      return null;
    }
  }

  return { login, isLoading, error };
}