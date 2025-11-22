import React, { useState } from "react";
import { useTaskQuery } from "../hooks/useTaskQuery"; // Imports all mutation logic

function EditableTask({ task }) {
  // Get mutation functions and their respective loading states from React Query
  const { updateTask, deleteTask, isUpdating, isDeleting, updateTaskStatus } =
    useTaskQuery();

  // Local UI State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);

  // Granular Loading Check: The component knows if ANY update/delete mutation is currently running
  const isProcessing = isUpdating || isDeleting;

  // Style for display mode
  const style = {
    textDecoration: task.isCompleted ? "line-through" : "none",
    // Visually fade the text if an action is pending
    opacity: isProcessing ? 0.6 : 1,
  };

  // --- API Handlers (Calls React Query Mutations) ---

  // Handler for Checkbox Change (Status Toggle)
  const handleToggleComplete = (event) => {
    event.stopPropagation();
    if (isProcessing) return;

    // Call the updateTask mutation with the necessary ID and updates object
    updateTaskStatus({ taskId: task.id, newStatus: !task.isCompleted });
  };

  // Handler for Deleting Task
  const handleDeleteTask = (e) => {
    e.stopPropagation();
    if (isProcessing) return;

    // Call the deleteTask mutation
    deleteTask(task.id);
  };

  // Handler for Saving Edits (Enter/Blur)
  const handleSaveEdit = () => {
    const trimmedText = editText.trim();

    // If text is empty, unchanged, or if a mutation is already running, exit edit mode
    if (trimmedText === "" || trimmedText === task.title || isProcessing) {
      setIsEditing(false);
      setEditText(task.title);
      return;
    }

    // Call the updateTask mutation with the new title
    updateTask({ taskId: task.id, updates: { title: trimmedText } });
    setIsEditing(false);
  };

  // --- Rendering Logic ---

  if (isEditing) {
    // Render Edit View (Input field)
    return (
      <div className="task-edit-container">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSaveEdit} // Save when clicking away
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveEdit();
            if (e.key === "Escape") {
              setIsEditing(false);
              setEditText(task.title);
            }
          }}
          autoFocus
          className="task-edit-input"
        />
      </div>
    );
  }

  // Render Display View (Standard Look with Checkbox and Delete Button)
  return (
    <div className="task-display-container">
      {/* 1. STATUS CHECKBOX */}
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={handleToggleComplete}
        className="task-status-checkbox"
        disabled={isProcessing} // Disabled by the granular loading state
      />

      {/* 2. TASK TITLE (Double-click to edit) */}
      <span
        style={style}
        onDoubleClick={() => {
          if (!isProcessing) setIsEditing(true); // Only allow edit if not processing
        }}
        // Note: The click handler for status toggle is now ONLY on the checkbox
      >
        {task.title}
      </span>

      {/* 3. DELETE BUTTON */}
      <button
        className="delete-button"
        onClick={handleDeleteTask}
        disabled={isProcessing} // Disabled by the granular loading state
      >
        {/* Visual feedback changes based on state */}
        {isProcessing ? "..." : "❌"}
      </button>
    </div>
  );
}

export default EditableTask;
