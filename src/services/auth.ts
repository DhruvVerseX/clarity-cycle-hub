/**
 * Authentication API service
 * Handles user authentication, registration, and profile management
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Generic API request function with authentication
 */
const authRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Auth API request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * User registration request
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: UserData;
}

/**
 * User login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: UserData;
}

/**
 * User data interface
 */
export interface UserData {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  preferences: {
    defaultPomodoroDuration: number;
    defaultBreakDuration: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    theme: "light" | "dark" | "system";
  };
  stats: {
    totalPomodoros: number;
    totalTasks: number;
    totalCompletedTasks: number;
    totalFocusTime: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

/**
 * Profile update request
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  preferences?: Partial<UserData["preferences"]>;
}

/**
 * Change password request
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Delete account request
 */
export interface DeleteAccountRequest {
  password: string;
}

/**
 * Authentication API functions
 */
export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return authRequest<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return authRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get current user profile
   */
  getProfile: async (token: string): Promise<{ user: UserData }> => {
    return authRequest<{ user: UserData }>("/auth/profile", {
      method: "GET",
    }, token);
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileRequest, token: string): Promise<{ message: string; user: UserData }> => {
    return authRequest<{ message: string; user: UserData }>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }, token);
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest, token: string): Promise<{ message: string }> => {
    return authRequest<{ message: string }>("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    }, token);
  },

  /**
   * Delete account
   */
  deleteAccount: async (data: DeleteAccountRequest, token: string): Promise<{ message: string }> => {
    return authRequest<{ message: string }>("/auth/account", {
      method: "DELETE",
      body: JSON.stringify(data),
    }, token);
  },
};

/**
 * Token management utilities
 */
export const tokenUtils = {
  /**
   * Store token in localStorage
   */
  storeToken: (token: string): void => {
    localStorage.setItem("auth_token", token);
  },

  /**
   * Get token from localStorage
   */
  getToken: (): string | null => {
    return localStorage.getItem("auth_token");
  },

  /**
   * Remove token from localStorage
   */
  removeToken: (): void => {
    localStorage.removeItem("auth_token");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("auth_token");
    if (!token) return false;

    try {
      // Basic token validation (check if it's a valid JWT format)
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        localStorage.removeItem("auth_token");
        return false;
      }

      return true;
    } catch (error) {
      localStorage.removeItem("auth_token");
      return false;
    }
  },
}; 