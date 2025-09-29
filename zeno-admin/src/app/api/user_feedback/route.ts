
const BASE_URL = process.env.BASE_URL;
export async function GET(request: Request) {
  const token = request.headers.get('Authorization');
  try {
    const response = await fetch(`${BASE_URL}/reviews/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `${token}` } : {}),
      },
    });
    const result = await response.json();
    
    return new Response(JSON.stringify(result), {
      status: 200,
      statusText: 'Data retreived successfully',
    });
    
  } catch (error) {
    const message = (error as Error).message || 'An error occurred while retrieving feedback.';
    return new Response(message, { status: 500 });
  }
}
