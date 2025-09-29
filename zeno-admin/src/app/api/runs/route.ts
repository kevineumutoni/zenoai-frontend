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
    const response = await fetch(`${BASE_URL}/runs/`, {
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
    const contentType = request.headers.get('Content-Type') || '';
    let body: BodyInit;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      body = formData;
    } else {
      const json = await request.json();
      body = JSON.stringify(json);
    }

    const headers: HeadersInit = {
      'Authorization': authHeader,
    };

    if (!contentType.includes('multipart/form-data')) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}/runs/`, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText || 'Failed to send your query.', { status: response.status });
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = (error as Error).message || 'An error occurred while sending query.';
    return new Response(message, { status: 500 });
  }
}