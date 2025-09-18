export async function fetchRuns() {
  try {
    const response = await fetch('/api/runs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token 97de2f121a870ef6e3db15d81813dd15cb0c31ed`, 
      },
    });

    if (!response.ok) {
      throw new Error(`Something went wrong: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`Failed to fetch runs: ${(error as Error).message}`);
  }
}