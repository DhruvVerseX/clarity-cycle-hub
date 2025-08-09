/**
 * React Query hooks for managing API state and caching
 * Provides hooks for tasks, pomodoro sessions, and health checks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi, pomodoroApi, healthApi, type Task, type CreateTaskRequest, type UpdateTaskRequest, type PomodoroSession, type CreatePomodoroSessionRequest, type CompletePomodoroSessionRequest } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for managing tasks with React Query
 */
export const useTasks = () => {
  const { toast } = useToast();
  
  const {
    data: tasks = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getAll,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    // Avoid indefinite loading when backend is down: fail fast and show error UI
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const createTaskMutation = useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create task",
        variant: "destructive",
      });
    },
    onSettled: () => {
      refetch();
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTaskRequest }) =>
      taskApi.update(id, updates),
    onSuccess: () => {
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update task",
        variant: "destructive",
      });
    },
    onSettled: () => {
      refetch();
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskApi.delete,
    onSuccess: () => {
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete task",
        variant: "destructive",
      });
    },
    onSettled: () => {
      refetch();
    },
  });

  return {
    tasks,
    isLoading,
    error,
    refetch,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};

/**
 * Hook for managing pomodoro sessions with React Query
 */
export const usePomodoroSessions = () => {
  const { toast } = useToast();
  
  const {
    data: sessions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["pomodoro-sessions"],
    queryFn: pomodoroApi.getAll,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const createSessionMutation = useMutation({
    mutationFn: pomodoroApi.create,
    onSuccess: () => {
      toast({
        title: "Session started",
        description: "Your pomodoro session has been started.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start session",
        variant: "destructive",
      });
    },
    onSettled: () => {
      refetch();
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompletePomodoroSessionRequest }) =>
      pomodoroApi.complete(id, data),
    onSuccess: () => {
      toast({
        title: "Session completed",
        description: "Your pomodoro session has been completed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete session",
        variant: "destructive",
      });
    },
    onSettled: () => {
      refetch();
    },
  });

  return {
    sessions,
    isLoading,
    error,
    refetch,
    createSession: createSessionMutation.mutate,
    completeSession: completeSessionMutation.mutate,
    isCreating: createSessionMutation.isPending,
    isCompleting: completeSessionMutation.isPending,
  };
};

/**
 * Hook for checking server health
 */
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: healthApi.check,
    refetchInterval: 30000, // Check every 30 seconds
    refetchIntervalInBackground: false,
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Hook for optimistic updates on tasks
 */
export const useOptimisticTaskUpdate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const optimisticUpdate = (taskId: string, updates: UpdateTaskRequest) => {
    // Optimistically update the cache
    queryClient.setQueryData<Task[]>(["tasks"], (oldTasks) => {
      if (!oldTasks) return oldTasks;
      
      return oldTasks.map((task) =>
        task._id === taskId
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      );
    });
  };

  const revertOptimisticUpdate = () => {
    // Revert the cache to the server state
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const updateTaskWithOptimism = async (taskId: string, updates: UpdateTaskRequest) => {
    try {
      optimisticUpdate(taskId, updates);
      await taskApi.update(taskId, updates);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error) {
      revertOptimisticUpdate();
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update task",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    updateTaskWithOptimism,
  };
}; 