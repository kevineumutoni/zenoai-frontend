'use client';
import { useState, useEffect } from 'react';
import { fetchAnalytics } from '../utils/fetchSteps';
import { Step } from '../utils/types/steps';

export function useFetchAnalytics() {
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  async function fetchData(){
     setIsLoading(true);
      setError(null);
      try {
      const result = await fetchAnalytics();
      setSteps(result.steps || []);
  } catch (err){
     const message = (err as Error).message || 'Sorry, an unknown error occurred';
      setError(message); 
    } finally {
      setIsLoading(false);
    }
  }
   useEffect(() => {
    fetchData();
  }, []);

 return { steps, isLoading, error };
}