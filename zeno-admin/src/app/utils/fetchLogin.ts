const baseUrl = '/api/auth';

export async function fetchLogin(email: string, password: string) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Something went wrong: " + errorText);
    }

    const result = await response.json();

    if (result.token) {
      localStorage.setItem('token', result.token);
    }

    if (result.id) {
      localStorage.setItem('id', result.id.toString());
    }

    if (result.role) {
      localStorage.setItem('role', result.role);
    }

    return result;
  } catch (error) {
    throw new Error('Failed to login; ' + (error as Error).message);
  }
}