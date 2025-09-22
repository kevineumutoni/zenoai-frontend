const baseUrl = '/api/admin';

export function authInfo() {
  const token = localStorage.getItem('token') || '';
  const id = localStorage.getItem('id') || localStorage.getItem('user_id') || null;
  return { token, id };
}

export async function fetchCurrentAdmin() {
  const { token, id } = authInfo();
  if (!token || !id) throw new Error('Missing token or id');
  const response = await fetch(`${baseUrl}?id=${id}`, { headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' } });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function updateCurrentAdmin(id: number | string, u: any) {
  const { token } = authInfo();
  if (!token) throw new Error('No token found');
  const data = {
    role: u.role,
    first_name: u.first_name ?? u.firstName,
    last_name: u.last_name ?? u.lastName,
    email: u.email,
    image: u.image,
    ...(u.date_joined || u.registeredDate || u.created_at ? { date_joined: u.date_joined || u.registeredDate || u.created_at } : {}),
    ...(u.password?.length ? { password: u.password } : {})
  };

  const res = await fetch(`${baseUrl}/${id}`, { method: 'PUT', headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}