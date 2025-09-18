const BASE_URL = process.env.BASE_URL;

export async function GET(request: Request) {
  if (!BASE_URL) {
    return new Response('BASE_URL not configured', { status: 500 });
  }

  try {
    const response = await fetch(`${BASE_URL}/runs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token 97de2f121a870ef6e3db15d81813dd15cb0c31ed`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return new Response(`Failed to fetch runs: ${errorMessage}`, {
        status: response.status,
      });
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      statusText: 'Fetch successful',
    });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}

// // api/runs/route.ts
// const BASE_URL = process.env.BASE_URL;

// export async function GET(request: Request) {
//   if (!BASE_URL) {
//     return new Response('The system is not properly configured. Please try again.', { status: 500 });
//   }

//   const token = request.headers.get('Authorization')?.replace('Token ', '');
//   if (!token) {
//     return new Response('Please log in to view system data.', { status: 401 });
//   }

//   try {
//     const response = await fetch(`${BASE_URL}/runs`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Token ${token}`,
//       },
//     });

//     if (!response.ok) {
//       const errorMessage = await response.text();
//       return new Response(`We couldn’t retrieve the data: ${errorMessage}. Please try again.`, {
//         status: response.status,
//       });
//     }

//     const result = await response.json();
//     return new Response(JSON.stringify(result), {
//       status: 200,
//       statusText: 'Fetch successful',
//     });
//   } catch (error) {
//     return new Response('An error occurred while fetching data. Please try again or contact support.', { status: 500 });
//   }
// }