/**
 * Auth0 Service
 * Handles authentication with Auth0
 */

export interface Auth0Config {
  domain: string;
  clientId: string;
  audience: string;
  redirectUri: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  token?: string;
}

/**
 * Initialize Auth0 configuration
 */
export const initializeAuth0 = (): Auth0Config => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin;

  if (!domain || !clientId) {
    throw new Error("Auth0 configuration is missing. Please check your environment variables.");
  }

  return {
    domain,
    clientId,
    audience,
    redirectUri,
  };
};

/**
 * Login with email and password using Auth0
 */
export const loginWithAuth0 = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const config = initializeAuth0();
    
    // For now, we'll use a simple API call to your backend
    // In a real implementation, you'd use Auth0's SDK
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return {
      success: true,
      message: "Login successful",
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
};

/**
 * Signup with Auth0
 */
export const signupWithAuth0 = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  try {
    // Validate password confirmation
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // For now, we'll use a simple API call to your backend
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return {
      success: true,
      message: "Registration successful",
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
    };
  }
};

/**
 * Logout from Auth0
 */
export const logoutFromAuth0 = async (): Promise<void> => {
  try {
    const config = initializeAuth0();
    
    // Clear local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    
    // Redirect to Auth0 logout
    const logoutUrl = `https://${config.domain}/v2/logout?client_id=${config.clientId}&returnTo=${encodeURIComponent(config.redirectUri)}`;
    window.location.href = logoutUrl;
  } catch (error) {
    console.error("Logout failed:", error);
    // Fallback: just clear local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }
};

/**
 * Get current user from local storage
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

/**
 * Get auth token from local storage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

/**
 * Set auth token and user in local storage
 */
export const setAuthData = (token: string, user: any): void => {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
}; 