export async function fetchRuns() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Please log in to access system health data.');
  }

  const response = await fetch('/api/runs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Unable to fetch system data. Please try again later.');
  }

  return response.json();
}


export async function postRun(userInput: string, files: File[]) {
  const formData = new FormData();
  formData.append('user_input', userInput);
  files.forEach((file) => formData.append('files', file));
    const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Please log in to access system health data.');
  }
  const response = await fetch('/api/runs', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Unable to create run. Please try again later.');
  }

  return response.json();
}
