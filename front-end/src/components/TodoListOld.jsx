// import React, { useContext } from "react";
// import { TaskContext } from "../context/TaskContext";

// // Use React.memo for optimization
// function TodoList() {
//   // Pull data and update logic from Context
//   const { tasks, toggleComplete, completedCount } = useContext(TaskContext);

//   const hasTasks = tasks && tasks.length > 0;

//   return (
//     <div className="todo-list-display">
//       <h2>Task List ({completedCount} Completed)</h2>

//       {/* Conditional Rendering */}
//       {!hasTasks && (
//         <p className="empty-message">🎉 All done! No tasks remaining. 🎉</p>
//       )}

//       <ul className="task-list">
//         {/* List Rendering with map() and Keys */}
//         {tasks.map((task) => (
//           <li
//             key={task.id}
//             style={{
//               textDecoration: task.completed ? "line-through" : "none",
//             }}
//             onClick={() => toggleComplete(task.id)}
//           >
//             {task.text}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default React.memo(TodoList);

// TodoList.jsx

// import React from "react";
// // Import the custom hook and ActionType
// import { useTasks } from "../hooks/useTasks";
// import { ActionType } from "../constants/taskReducerConstants";
// import { deleteTask, updateTaskStatus } from "../utils/api";

// // Use React.memo for optimization
// function TodoList() {
//   // **CHANGE 1: Pull the entire state object and dispatch from the hook**
//   const { state, dispatch } = useTasks();

//   // Destructure data from the state object
//   const { tasks, loading, error } = state;

//   // Calculate completedCount within the component
//   const completedCount = tasks.filter(
//     (task) => task && task.isCompleted // <-- Defensive check added here
//   ).length;

//   const hasTasks = tasks && tasks.length > 0;

//   // NEW: Async handler for toggling completion status
//   const handleToggleComplete = async (task) => {
//     // Optimistically update the UI status immediately (optional but common)
//     // dispatch({
//     //     type: ActionType.TOGGLE_COMPLETE,
//     //     payload: task.id
//     // });

//     try {
//       const newStatus = !task.isCompleted;

//       //  Call the API to update the status in the database
//       const serverTask = await updateTaskStatus(task.id, newStatus);

//       // Dispatch success with the server-confirmed task
//       dispatch({
//         type: ActionType.UPDATE_SUCCESS,
//         payload: serverTask,
//       });
//     } catch (error) {
//       //Dispatch an error action
//       dispatch({
//         type: ActionType.FETCH_ERROR,
//         payload: `Failed to update task: ${error.message}`,
//       });
//       // Optional: If you used optimistic update (step above), dispatch a REVERT action here
//     }
//   };

//   const handleDeleteTask = async (taskId) => {
//     try {
//       // 1. Call the API to delete the task
//       const deletedId = await deleteTask(taskId);

//       // 2. Dispatch success with the ID of the deleted task
//       dispatch({
//         type: ActionType.DELETE_SUCCESS,
//         payload: deletedId,
//       });
//     } catch (error) {
//       // 3. Dispatch an error action
//       dispatch({
//         type: ActionType.FETCH_ERROR,
//         payload: `Failed to delete task: ${error.message}`,
//       });
//     }
//   };

//   // Handle loading and error states (Phase II readiness)
//   if (loading) return <p>⏳ Loading tasks...</p>;
//   if (error)
//     return (
//       <p className="error-message">
//         ⚠️ Error fetching tasks: {error.message || error}
//       </p>
//     );

//   return (
//     <div className="todo-list-display">
//       <h2>Task List ({completedCount} Completed)</h2>

//       {/* Conditional Rendering */}
//       {!hasTasks && (
//         <p className="empty-message">🎉 All done! No tasks remaining. 🎉</p>
//       )}

//       <ul className="task-list">
//         {tasks.map((task) => (
//           <li key={task.id} className="task-item">
//             {" "}
//             {/* Added class for styling */}
//             {/* Task Title and Toggle Logic */}
//             <span
//               style={{
//                 textDecoration:
//                   task && task.isCompleted ? "line-through" : "none",
//               }}
//               onClick={() => handleToggleComplete(task)} // Assuming handleToggleComplete exists
//             >
//               {task?.title}
//             </span>
//             {/* 4. Delete Button */}
//             <button
//               className="delete-button"
//               onClick={(e) => {
//                 e.stopPropagation(); // Prevent the toggle handler on the <li> from firing
//                 handleDeleteTask(task.id);
//               }}
//               disabled={loading} // Disable during any ongoing API operations
//             >
//               ❌
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default React.memo(TodoList);

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
  const hasTasks = tasks && tasks.length > 0; // --- 1. Toggle Status Handler (Optimistic Update) ---

  const handleToggleComplete = async (task) => {
    // 1. OPTIMISTIC UPDATE: Update the UI immediately
    // dispatch({
    //   type: ActionType.TOGGLE_COMPLETE,
    //   payload: task.id,
    // });

    try {
      const newStatus = !task.isCompleted; // 2. API CALL
      const updatedTask = await updateTaskStatus(task.id, newStatus);
      dispatch({
        type: ActionType.UPDATE_SUCCESS,
        payload: updatedTask
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
      // 2. API CALL
      await deleteTask(taskId);
    } catch (error) {
      // 3. API FAILURE: This rollback (re-adding the task) is complex
      // and often handled by refetching data or a dedicated REVERT action.
      dispatch({
        type: ActionType.FETCH_ERROR,
        payload: `Failed to delete task: ${error.message}`,
      });
    }
  }; // --- 3. Clear All Tasks Handler (Optimistic Update) ---

  const handleClearAllTasks = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete ALL tasks? This cannot be undone."
      )
    )
      return; // 1. OPTIMISTIC UPDATE: Clear the UI state immediately

    const currentTasks = [...tasks]; // Save tasks for potential rollback
    dispatch({
      type: ActionType.CLEAR_ALL_TASKS, 
    });

    try {
      // 2. API CALL
      await clearAllTasks();
    } catch (error) {
      // 3. API FAILURE: Revert UI state by restoring saved tasks
      dispatch({
        type: ActionType.RESTORE_TASKS, // Requires new action type in reducer
        payload: currentTasks,
      });
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
            💥 Clear All Tasks{" "}
          </button>
        )}{" "}
      </header>
      {/* Conditional Rendering */}{" "}
      {!hasTasks && (
        <p className="empty-message">🎉 All done! No tasks remaining. 🎉</p>
      )}{" "}
      <ul className="task-list">
        {" "}
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${task.isCompleted ? "completed" : ""}`}
          >
            {" "}
            <span className="task-title">{task?.title} </span>{" "}
            <div className="task-actions">
              {/* NEW: Toggle Status Button */}{" "}
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
                {task.isCompleted ? "↩️ Undo" : "✅ Complete"}{" "}
              </button>
              {/* Delete Button */}{" "}
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id);
                }}
                disabled={loading}
              >
                🗑️{" "}
              </button>{" "}
            </div>{" "}
          </li>
        ))}{" "}
      </ul>{" "}
    </div>
  );
}

export default React.memo(TodoList);
