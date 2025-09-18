const BASE_URL = process.env.BASE_URL;

export type User = {
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  role: string;
  image?: string;
};

export async function GET(req: Request) {
  try {
    const token = req.headers.get('x-auth-token') || '';
    if (!token) {
      return new Response('No token found in request headers', { status: 401 });
    }

    const response = await fetch(`${BASE_URL}/users/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return new Response(`Failed to fetch users: ${errorMessage}`, {
        status: response.status,
      });
    }

    const users: User[] = await response.json();

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}