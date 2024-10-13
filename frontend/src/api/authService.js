const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const login = async (email, password) => {
    const response = await fetch(`${BACKEND_URL}/api/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(response.status !== 500 ? error.message : "An error occurred while signing in");
    }
  
    return await response.json();
  };