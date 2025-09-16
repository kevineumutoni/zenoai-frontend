const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return new Response('Missing required fields: email, password', {
      status: 400,
    });
  }

  try {
    const response = await fetch(`${baseUrl}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return new Response(`Failed to login: ${errorMessage}`, {
        status: response.status,
      });
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      statusText: "Login successful",
    });
  
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}