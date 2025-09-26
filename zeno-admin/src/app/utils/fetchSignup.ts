const baseUrl = 'api/signup';

export async function fetchSignUp(data: { first_name: string; last_name: string; email: string; password: string }) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errorText = await response.text();
      let friendlyMessage = "Something went wrong, please try again.";
      try {
        const error = JSON.parse(errorText);
        if (
          error?.error &&
          error?.error.toLowerCase().includes("already registered")
        ) {
          friendlyMessage = error.error;
        } else if (
          error?.details?.email &&
          error.details.email.some((d: string) =>
            d.toLowerCase().includes("user with this email already exists")
          )
        ) {
          friendlyMessage = "This email is already registered. Please log in or use a different email address.";
        } else if (error?.error) {
          friendlyMessage = error.error;
        }
      } catch {
      }
      throw new Error(friendlyMessage);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error((error as Error).message || "Failed to sign up");
  }
}