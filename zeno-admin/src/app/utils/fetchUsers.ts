const baseUrl = '/api/users';

export type User = {
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  role: string;
  image?: string;
};

export async function fetchUsers(): Promise<User[]> {
 
  const token = localStorage.getItem('token') || '';

  const response = await fetch(baseUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token, 
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  const users: User[] = await response.json();
  return users;
}