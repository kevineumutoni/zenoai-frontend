import { Step } from "./types/steps";

export async function fetchAnalytics(): Promise<{ steps: Step[] }> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Please log in to access usage analytics data.');
  }

  try {
    const response = await fetch('/api/steps', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Unable to fetch analytics data. Please try again later.');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`We couldn't load the analytics data: ${(error as Error).message}`);
  }
}