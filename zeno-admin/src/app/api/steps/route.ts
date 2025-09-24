const BASE_URL = process.env.BASE_URL;
import { Step } from "../../utils/types/steps";

export async function GET(request: Request) {
  if (!BASE_URL) {
    return new Response('The system is not properly configured. Please try again.', { status: 500 });
  }

  const token = request.headers.get('Authorization');

  if (!token) {
    return new Response('Please log in to view analytics data.', { status: 401 });
  }

  try {
    const response = await fetch(`${BASE_URL}/steps`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    const steps: Step[] = await response.json();
    return new Response(JSON.stringify({ steps }), {
      status: 200,
      statusText: 'Analytics data retrieved successfully',
    });
  } catch (error) {
    const message = (error as Error).message || 'An error occurred while retrieving analytics data.';
    return new Response(message, { status: 500 });
  }
}