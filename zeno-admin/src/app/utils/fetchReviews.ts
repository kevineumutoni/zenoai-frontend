export async function fetchReviews() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Please log in.');
  }
  try {
    const response = await fetch('https://zeno-ai-be14a438528a.herokuapp.com/reviews/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });


    if (!response.ok) {
      throw new Error('Unable to fetch users feedback, Try again.');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`We couldn't load users feedback: ${(error as Error).message}`);
  }
}



