import React, { useState, useCallback, useMemo } from "react";
import { TaskContext } from "./TaskContext";

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Start learning React", completed: true },
    { id: 2, text: "Master React Hooks", completed: false },
    { id: 3, text: "Build a ToDo App", completed: false },
  ]);
  const [nextId, setNextId] = useState(4);

  // Memoized function to add a task (stabilized by useCallback)
  const addTask = useCallback(
    (text) => {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: nextId, text, completed: false },
      ]);
      setNextId((prevId) => prevId + 1);
    },
    [nextId]
  );

  // Memoized function to toggle task completion (stable dependency array)
  const toggleComplete = useCallback((taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  // Memoized value for a simple calculation (optimized by useMemo)
  const completedCount = useMemo(() => {
    return tasks.filter((t) => t.completed).length;
  }, [tasks]);

  const contextValue = {
    tasks,
    addTask,
    toggleComplete,
    completedCount,
  };

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};
