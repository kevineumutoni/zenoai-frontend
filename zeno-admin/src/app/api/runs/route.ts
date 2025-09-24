const BASE_URL = process.env.BASE_URL;

export async function GET(request: Request) {
  if (!BASE_URL) {
    return new Response('The system is not properly configured. Please try again.', { status: 500 });
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Please log in.', { status: 401 });
  }

  try {
    const response = await fetch(`${BASE_URL}/runs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!BASE_URL) {
    return new Response('The system is not properly configured. Please try again.', { status: 500 });
  }
const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Please log in.', { status: 401 });
  }
  try {
    const formData = await request.formData();

    const response = await fetch(`${BASE_URL}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText || 'Failed send your query.', { status: response.status || 500 });
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 201,
      statusText: 'Query sent successfully',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = (error as Error).message || 'An error occurred while sending query.';
    return new Response(message, { status: 500 });
  }
}




