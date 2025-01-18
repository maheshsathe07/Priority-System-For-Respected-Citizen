import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  city: string;
  role?: string;
}

interface LoginResponse {
  message: string;
  user: User;
}

interface RegisterResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    city: string;
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  city?: string;
}

// Helper function to manage user session
const UserSession = {
  setUser: (user: User) => {
    sessionStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: (): User | null => {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  clearUser: () => {
    sessionStorage.removeItem('user');
  },
  
  isLoggedIn: (): boolean => {
    return !!sessionStorage.getItem('user');
  }
};

export const login_user = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      'http://localhost:5000/authenticate-user',
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Store user data in sessionStorage
    if (response.data.user) {
      UserSession.setUser(response.data.user);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('User not found');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid password');
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
    }
    throw new Error('An error occurred during login');
  }
};

// Logout function to clear session
export const logout_user = () => {
  UserSession.clearUser();
};

export const add_new_user = async (
  name: string,
  email: string,
  password: string,
  city: string = "Unknown"
): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(
      'http://localhost:5000/add-user-data',
      {
        name,
        email,
        password,
        city
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error('Email already exists');
      } else if (error.response?.status === 415) {
        throw new Error('Invalid request format');
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
    }
    throw new Error('An error occurred during registration');
  }
};

// Export the UserSession helper for use in other components
export { UserSession };