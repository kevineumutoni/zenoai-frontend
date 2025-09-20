import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.BASE_URL;

export async function GET(request: NextRequest) {
  if (!BASE_URL) return new Response('System not configured.', { status: 500 });
  const token = request.headers.get('Authorization')?.replace('Token ', '') || '';

  if (!token) return new Response('Login required.', { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return new Response('ID required.', { status: 400 });
  const endpoint = `${BASE_URL}/users/${id}`;
  const response = await fetch(endpoint, { headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' } });
  const clonedResponse = response.clone();
  const text = await clonedResponse.text();
  
  if ((response.headers.get('content-type') || '').includes('text/html')) 
    return new Response(`Invalid endpoint: ${text.substring(0, 100)}...`, { status: 403 });

  if (!response.ok) return new Response(`Fetch failed: ${text}`, { status: response.status });
  try {
    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200, statusText: 'Data retrieved' });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : 'Unknown error', { status: 500 });
  }
}