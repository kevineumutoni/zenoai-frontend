import { NextRequest, NextResponse } from 'next/server';

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
    return new Response('An error occurred while retreiving data.', { status: 500 });
  }
}
