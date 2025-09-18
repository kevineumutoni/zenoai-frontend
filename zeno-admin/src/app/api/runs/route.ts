const BASE_URL = process.env.BASE_URL;

export async function GET(request: Request) {
  if (!BASE_URL) {
    return new Response('BASE_URL not configured', { status: 500 });
  }

  try {
    const response = await fetch(`${BASE_URL}/runs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token 97de2f121a870ef6e3db15d81813dd15cb0c31ed`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return new Response(`Failed to fetch runs: ${errorMessage}`, {
        status: response.status,
      });
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      statusText: 'Fetch successful',
    });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}