export async function fetchRuns() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Please log in to access system health data.');
  }

  try {
    const response = await fetch('/api/runs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Unable to fetch system data. Please try again later.');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`We couldn't load the system data: ${(error as Error).message}`);
  }
}