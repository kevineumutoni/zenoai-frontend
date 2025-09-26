const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Missing required fields: email, password' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
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
      let errorMessage;
      try {
        errorMessage = await response.json();
      } catch {
        errorMessage = await response.text();
      }
      return new Response(JSON.stringify({ error: "Failed to login", details: errorMessage }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await response.json();

    const responseData = {
      token: result.token,
      id: result.id, 
      email: result.email,
      role: result.role
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      statusText: "Login successful",
      headers: { 'Content-Type': 'application/json' }
    });
  
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}