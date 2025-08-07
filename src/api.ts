// User interface matching your current setup
export interface User {
  id: number;
  name: string;
  email: string;
}

// SSR data fetching function for your backend
export async function fetchUsersData(): Promise<User[]> {
  try {
    // For SSR, we need to use the full URL
    const apiUrl = 'http://localhost:5000/users';
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}
