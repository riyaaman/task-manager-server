import { useContext } from "react";
import { TaskContext } from "../context/TaskContext"; // Import context from the Provider file

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  // This hook returns the { state, dispatch } object
  return context;
};
