const API_BASE = '/api';

export async function createRun(
  conversationId: string | null,
  userInput: string,
  token?: string,
  files?: File[]
): Promise<any> {
  const headers: HeadersInit = {};
  let body: BodyInit;

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  if (files && files.length > 0) {
    const formData = new FormData();
    formData.append('userInput', userInput);
    if (conversationId) formData.append('conversationId', conversationId);
    files.forEach(file => formData.append('files', file));
    body = formData;
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify({ conversationId, userInput });
  }

  const response = await fetch(`${API_BASE}/runs`, {
    method: 'POST',
    headers,
    body,
  });

  const contentType = response.headers.get('content-type') || '';

  let data = contentType.includes('application/json') 
    ? await response.json().catch(() => ({}))
    : (await response.text()).trim() ? { message: await response.text() } : {};

  if (!response.ok) {
    const errorMessage =
      data?.message || data?.detail || `Failed to create run (status ${response.status})`;
    throw new Error(errorMessage);
  }

  return data;
}

export async function fetchRunById(runId: number, token?: string): Promise<any> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const response = await fetch(`${API_BASE}/run?id=${runId}`, { headers });

  const contentType = response.headers.get('content-type') || '';

  let data = contentType.includes('application/json') 
    ? await response.json().catch(() => ({}))
    : (await response.text()).trim() ? { message: await response.text() } : {};

  if (!response.ok) {
    const errorMessage = data.message || `Failed to fetch run (status ${response.status})`;
    throw new Error(errorMessage);
  }

  return data;
}
