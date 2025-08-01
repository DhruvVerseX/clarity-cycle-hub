/**
 * API service for communicating with the MongoDB backend
 * Handles all HTTP requests to the server endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

/**
 * Generic API request function with error handling and authentication
 */
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const token = getAuthToken();
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
      
      // Handle authentication errors
      if (response.status === 401) {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
        throw new Error("Authentication required");
      }
      
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Task-related API functions
 */
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: "todo" | "in-progress" | "completed";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  updatedAt?: string;
}

export const taskApi = {
  /**
   * Fetch all tasks from the database
   */
  getAll: async (): Promise<Task[]> => {
    return apiRequest<Task[]>("/tasks");
  },

  /**
   * Create a new task
   */
  create: async (task: CreateTaskRequest): Promise<Task> => {
    return apiRequest<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
  },

  /**
   * Update an existing task
   */
  update: async (id: string, updates: UpdateTaskRequest): Promise<Task> => {
    return apiRequest<Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete a task
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/tasks/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Pomodoro session-related API functions
 */
export interface PomodoroSession {
  _id: string;
  duration: number;
  taskId?: {
    _id: string;
    title: string;
  };
  completed: boolean;
  startTime: string;
  endTime?: string;
  notes?: string;
}

export interface CreatePomodoroSessionRequest {
  duration: number;
  taskId?: string;
  notes?: string;
}

export interface CompletePomodoroSessionRequest {
  notes?: string;
}

export const pomodoroApi = {
  /**
   * Fetch all pomodoro sessions
   */
  getAll: async (): Promise<PomodoroSession[]> => {
    return apiRequest<PomodoroSession[]>("/pomodoro-sessions");
  },

  /**
   * Create a new pomodoro session
   */
  create: async (session: CreatePomodoroSessionRequest): Promise<PomodoroSession> => {
    return apiRequest<PomodoroSession>("/pomodoro-sessions", {
      method: "POST",
      body: JSON.stringify(session),
    });
  },

  /**
   * Complete a pomodoro session
   */
  complete: async (id: string, data: CompletePomodoroSessionRequest): Promise<PomodoroSession> => {
    return apiRequest<PomodoroSession>(`/pomodoro-sessions/${id}/complete`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

/**
 * Health check API function
 */
export interface HealthCheck {
  status: string;
  message: string;
  timestamp: string;
}

export const healthApi = {
  /**
   * Check server health status
   */
  check: async (): Promise<HealthCheck> => {
    return apiRequest<HealthCheck>("/health");
  },
}; 