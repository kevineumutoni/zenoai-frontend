
import { useState, useEffect } from 'react';
import { fetchRuns } from '../utils/fetchRuns';
import { Run } from '../utils/types';
export function useFetchRuns() {
  const [data, setData] = useState<Run[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchRuns();
      
      setData(result);
    } catch (err) {
      const message = (err as Error).message || 'An unknown error occurred';
      setError(message); 
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { data, fetchData, isLoading, error };
}