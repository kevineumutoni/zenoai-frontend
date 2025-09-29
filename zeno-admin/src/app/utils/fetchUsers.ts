const baseUrl = '/api/users';
import type { User } from "./types/runs";

export async function fetchUsers(): Promise<User[]> {
  try {
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
  } catch (error) {
    throw error; 
  }
}
