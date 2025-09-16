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
            throw new Error("Something went wrong," + response.statusText)
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error('Failed to login; ' + (error as Error).message)
    }
} 