import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.BASE_URL;

export async function PUT(request: NextRequest, { params: { id } }: { params: { id: string } }) {
  if (!BASE_URL) return new Response('System not configured.', { status: 500 });
  const token = request.headers.get('Authorization')?.replace('Token ', '') || '';

  if (!token) return new Response('Login required.', { status: 401 });
  const bodyData = await request.json();
  const endpoint = `${BASE_URL}/users/${id}`;
  const response = await fetch(endpoint, { method: 'PUT', headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(bodyData) });
  const clonedResponse = response.clone();
  const text = await clonedResponse.text();

  if (!response.ok) return new Response(`Update failed: ${text}`, { status: response.status });
  
  if ((response.headers.get('content-type') || '').includes('text/html')) 
    return new Response(`Invalid endpoint: ${text.substring(0, 100)}...`, { status: 403 });
  try {
    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200, statusText: 'Admin data updated' });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : 'Unknown error', { status: 500 });
  }
}