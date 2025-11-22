import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  fetchTasks,
  addTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../utils/api";

// The key used to identify the tasks list in the Query cache
const TASKS_QUERY_KEY = "tasks";

export const useTaskQuery = () => {
  const queryClient = useQueryClient();

  // --- 1. QUERY: Fetching all tasks ---
  // The tasks list will be stored, cached, and automatically refetched by this hook.
  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [TASKS_QUERY_KEY],
    queryFn: fetchTasks,
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });

  // --- 2. MUTATION: Adding a new task ---
  const addTaskMutation = useMutation({
    mutationFn: addTasks,
    onSuccess: (newTask) => {
      // Invalidate the cache to trigger a background refetch of the list
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      toast.success(`Task '${newTask.title}' added!`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add task.");
    },
  });

  // --- 3. MUTATION: Updating an existing task ---
  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      // Invalidate the cache to trigger a background refetch
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      toast.success("Task updated.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update task.");
    },
  });

  // --- 4. MUTATION: Deleting a task ---
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      // Invalidate the cache to trigger a background refetch
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      toast.success("Task deleted.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete task.");
    },
  });

  // - Updating an existing task status ---
  const updateTaskStatusMutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      // Invalidate the cache to trigger a background refetch
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      toast.success("Task status updated.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update task.");
    },
  });

  return {
    // Query State
    tasks: tasks || [], // Provide an empty array if data hasn't loaded yet
    isLoading,
    isError,

    // Mutations and their loading state
    addTask: addTaskMutation.mutate,
    isAdding: addTaskMutation.isPending,

    updateTask: updateTaskMutation.mutate,
    isUpdating: updateTaskMutation.isPending,

    deleteTask: deleteTaskMutation.mutate,
    isDeleting: deleteTaskMutation.isPending,

    updateTaskStatus: updateTaskStatusMutation.mutate,
  };
};
