import React from "react";
// Import the custom hook and ActionType
import { useTasks } from "../hooks/useTasks";
import { ActionType } from "../constants/taskReducerConstants";
import { deleteTask, updateTaskStatus, clearAllTasks } from "../utils/api";
// Note: clearAllTasks utility must be created

// Use React.memo for optimization
function TodoList() {
  const { state, dispatch } = useTasks();
  const { tasks, loading, error } = state; // Calculate completedCount

  const completedCount = tasks.filter(
    (task) => task && task.isCompleted
  ).length;
  const hasTasks = tasks && tasks.length > 0; //  Toggle Status Handler

  const handleToggleComplete = async (task) => {
    //  Update the UI immediately
    dispatch({
      type: ActionType.TOGGLE_COMPLETE,
      payload: task.id,
    });

    try {
      const newStatus = !task.isCompleted; // 2. API CALL
      const updatedTask = await updateTaskStatus(task.id, newStatus);
      dispatch({
        type: ActionType.UPDATE_SUCCESS,
        payload: updatedTask,
      });
    } catch (error) {
      dispatch({
        type: ActionType.FETCH_ERROR,
        payload: `Failed to update task status: ${error.message}`,
      });
    }
  }; // --- 2. Delete Single Task Handler (Optimistic Update) ---

  const handleDeleteTask = async (taskId) => {
    // 1. OPTIMISTIC UPDATE: Remove the item from the UI state immediately
    dispatch({
      type: ActionType.DELETE_SUCCESS,
      payload: taskId,
    });

    try {
      //API CALL
      await deleteTask(taskId);
    } catch (error) {
      // 3. API FAILURE: This rollback (re-adding the task) is complex
      // and often handled by refetching data or a dedicated REVERT action.
      dispatch({
        type: ActionType.FETCH_ERROR,
        payload: `Failed to delete task: ${error.message}`,
      });
    }
  }; //  Clear All Tasks Handler

  const handleClearAllTasks = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete ALL tasks? This cannot be undone."
      )
    )
      return; // Clear the UI state immediately

    dispatch({
      type: ActionType.CLEAR_ALL_TASKS,
    });

    try {
      // API CALL
      await clearAllTasks();
    } catch (error) {
      dispatch({
        type: ActionType.FETCH_ERROR,
        payload: `Failed to clear all tasks: ${error.message}`,
      });
    }
  }; // Handle loading and error states

  if (loading) return <p>⏳ Loading tasks...</p>;
  if (error)
    return (
      <p className="error-message">
        ⚠️ Error fetching tasks: {error.message || error}{" "}
      </p>
    );

  return (
    <div className="todo-list-display">
      {" "}
      <header className="list-header">
        <h2>📋 Task List ({completedCount} Completed)</h2>{" "}
        {hasTasks && (
          <button
            className="clear-all-button"
            onClick={handleClearAllTasks}
            disabled={loading}
          >
            💥 Clear All Tasks
          </button>
        )}
      </header>
      {/* Conditional Rendering */}
      {!hasTasks && (
        <p className="empty-message">🎉 All done! No tasks remaining. 🎉</p>
      )}
      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${task.isCompleted ? "completed" : ""}`}
          >
            <span className="task-title">{task?.title} </span>
            <div className="task-actions">
              {/* NEW: Toggle Status Button */}
              <button
                className={`toggle-button ${
                  task.isCompleted ? "undo" : "complete"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleComplete(task);
                }}
                disabled={loading}
              >
                {task.isCompleted ? "↩️ Undo" : "✅ Complete"}
              </button>
              {/* Delete Button */}
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id);
                }}
                disabled={loading}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default React.memo(TodoList);
