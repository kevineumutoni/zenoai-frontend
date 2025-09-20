const baseUrl = process.env.BASE_URL || 'https://zeno-ai-be14a438528a.herokuapp.com';

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

    // Provide both user_id and id for frontend consistency
    const responseData = {
      token: result.token,
      user_id: result.user_id,
      id: result.user_id, // Set id to user_id for easy use in API calls
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