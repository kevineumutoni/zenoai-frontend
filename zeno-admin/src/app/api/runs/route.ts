const BASE_URL = process.env.BASE_URL;

export async function GET(request: Request) {
  if (!BASE_URL) {
    return new Response('The system is not properly configured. Please try again.', { status: 500 });
  }

  const token = request.headers.get('Authorization');
  
  if (!token) {
    return new Response('Please log in to view system data.', { status: 401 });
  }

  try {
    const response = await fetch(`${BASE_URL}/runs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      statusText: 'Data retreived successfully',
    });
  } catch (error) {
  const message = (error as Error).message || 'An error occurred while retrieving data.';
  return new Response(message, { status: 500 });
}
}




