

export async function fetchUsers(ids: number[]) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Please log in.');
  }
 
 
  try {
    const response = await fetch(`/api/users?ids=${ids.join(',')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });
 
 
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
 
 
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch users: ' + (error as Error).message);
  }
 }
 