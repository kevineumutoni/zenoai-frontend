const baseUrl = '/api/admin';

export function authInfo() {
  const token = localStorage.getItem('token') || '';
  const id = localStorage.getItem('id') || localStorage.getItem('user_id') || null;
  const user_id = localStorage.getItem('user_id') || null;
  return { token, id, user_id };
}

export async function fetchCurrentAdmin() {
  try {
    const { token, id, user_id } = authInfo();
    if (!token) throw new Error('No token found in localStorage');
    if (!id && !user_id) throw new Error('No id or user_id found in localStorage. Please login.');
    const queryId = id || user_id;
    const response = await fetch(`${baseUrl}?id=${queryId}`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    const clonedResponse = response.clone();
    const text = await clonedResponse.text();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}, message: ${text || 'No response'}`);
    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(message);
  }
}

export async function updateCurrentAdmin(id: number | string, userData: any) {
  try {
    const { token } = authInfo();
    if (!token) return new Response('No token found', { status: 401 });

    const payload: { role?: any; first_name?: any; last_name?: any; email?: any; image?: any; date_joined?: any; password?: any } = {
      role: userData.role,
      first_name: userData.first_name ?? userData.firstName,
      last_name: userData.last_name ?? userData.lastName,
      email: userData.email,
      image: userData.image,
      date_joined: userData.date_joined || userData.registeredDate || userData.created_at || '',
    };
    if (payload.date_joined === '') delete payload.date_joined;
    if (userData.password && userData.password.length > 0) payload.password = userData.password;

    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const clonedResponse = response.clone();
    const text = await clonedResponse.text();
    if (!response.ok) return new Response(text, { status: response.status });
    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(message);
  }
}