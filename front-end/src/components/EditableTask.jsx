import React, { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { updateTask, deleteTask } from "../utils/api";
import { ActionType } from "../constants/taskReducerConstants";
import toast from "react-hot-toast";

function EditableTask({ task }) {
  const { state, dispatch } = useTasks();

  // Check if THIS specific task is currently processing an action
  const isProcessing = state.actionLoadingId === task.id;

  // Local State
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);

  // --- API Handlers ---

  // Single-click handler (Status Toggle)
  const handleToggleComplete = async (event) => {
    event.stopPropagation();
    if (isProcessing) return; // Guard against rapid clicks

    try {
      //START: Dispatch action start with task ID
      dispatch({ type: ActionType.ACTION_START, payload: task.id });
      const updates = { isCompleted: !task.isCompleted };
      const serverTask = await updateTask(task.id, updates);

      // SUCCESS: Dispatch update
      dispatch({ type: ActionType.UPDATE_SUCCESS, payload: serverTask });

      // END: Dispatch action success
      dispatch({ type: ActionType.ACTION_SUCCESS });
    } catch (error) {
      //   dispatch({
      //     type: ActionType.FETCH_ERROR,
      //     payload: `Failed to toggle: ${error.message}`,
      //   });
      //   dispatch({ type: ActionType.ACTION_ERROR });

      //  Use the toast function directly
      toast.error(`Failed to toggle status: ${error.message}`);
    }
  };

  // Save Edit handler (Enter/Blur)
  const handleSaveEdit = async () => {
    const trimmedText = editText.trim();
    if (trimmedText === "" || trimmedText === task.title) {
      setIsEditing(false);
      setEditText(task.title);
      return;
    }

    try {
      const updates = { title: trimmedText };
      const serverTask = await updateTask(task.id, updates);

      dispatch({
        type: ActionType.UPDATE_SUCCESS,
        payload: serverTask,
      });

      setIsEditing(false);
    } catch (error) {
      dispatch({
        type: ActionType.FETCH_ERROR,
        payload: `Failed to save edit: ${error.message}`,
      });
    }
  };

  // Delete handler
  // Handler for Deleting Task
  const handleDeleteTask = async (taskId) => {
    if (isProcessing) return;

    try {
      // 1. START: Dispatch action start
      dispatch({ type: ActionType.ACTION_START, payload: taskId });

      await deleteTask(taskId);

      // 2. SUCCESS: Dispatch delete
      dispatch({ type: ActionType.DELETE_SUCCESS, payload: taskId });

      // 3. END: Dispatch action success
      dispatch({ type: ActionType.ACTION_SUCCESS });
    } catch (error) {
      // 3. END (Error): Dispatch action error
      dispatch({
        type: ActionType.FETCH_ERROR,
        payload: `Failed to delete: ${error.message}`,
      });
      dispatch({ type: ActionType.ACTION_ERROR });
    }
  };

  // --- Rendering Logic ---

  if (isEditing) {
    // Edit View (Input field)
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
              setEditText(task.title); // Revert on escape
            }
          }}
          autoFocus
          className="task-edit-input"
        />
      </div>
    );
  }

  // Display View (Standard Look)
  return (
    <div className="task-display-container">
      {/* 1. STATUS CHECKBOX */}
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={handleToggleComplete} // Use the new handler
        className="task-status-checkbox"
        // Disable if the user tries to edit the text while network is busy (Day 17, Part 2 concept)
        // disabled={actionLoadingId === task.id}
      />
      {/* Task Title Area - Handles Toggle (click) and Edit (double-click) */}
      <span
        style={{ opacity: isProcessing ? 0.6 : 1 }}
        onDoubleClick={() => setIsEditing(true)}
        //onClick={handleToggleComplete}
      >
        {task.title}
      </span>

      {/* Delete Button - Needs stopPropagation */}
      <button
        className="delete-button"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteTask(task.id);
        }}
        disabled={isProcessing} // DISABLE BUTTON while processing
      >
        {isProcessing ? "..." : "❌"} {/* Show processing indicator */}
      </button>
    </div>
  );
}

export default EditableTask;
