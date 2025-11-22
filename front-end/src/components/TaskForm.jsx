import React, { useState, useRef } from "react";
import { useTaskQuery } from "../hooks/useTaskQuery"; // Get mutation logic

function TaskForm() {
  const [taskText, setTaskText] = useState("");
  const { addTask, isAdding } = useTaskQuery(); // Get mutation and its loading state
  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (taskText.trim() === "" || isAdding) return;

    const newTask = { title: taskText, isCompleted: false };

    // Call the mutation function directly
    addTask(newTask);

    setTaskText("");
    inputRef.current.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Enter a new task..."
        ref={inputRef}
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        disabled={isAdding}
      />
      <button type="submit" disabled={isAdding}>
        {isAdding ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;
