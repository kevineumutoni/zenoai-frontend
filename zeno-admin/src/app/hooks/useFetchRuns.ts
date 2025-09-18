import { useState, useEffect } from 'react';
import { fetchRuns } from '../utils/fetchRuns';

export function useFetchRuns() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function fetchData() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchRuns();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { data, fetchData, isLoading, error };
}