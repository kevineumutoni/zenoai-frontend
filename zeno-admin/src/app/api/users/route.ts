const BASE_URL = process.env.BASE_URL;
import type { User } from "../../utils/types";


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