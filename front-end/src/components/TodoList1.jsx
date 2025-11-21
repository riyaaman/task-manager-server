// import React from "react";
// // Import the custom hook and ActionType
// import { useTasks } from "../hooks/useTasks";
// import { ActionType } from "../constants/taskReducerConstants";
// import { deleteTask, updateTaskStatus, clearAllTasks } from "../utils/api";
// import { getVisibleTasks } from "../utils/taskSelectors";

// // Use React.memo for optimization
// function TodoList() {
//   const { state, dispatch } = useTasks();
//   const { tasks, loading, error, filter, sortBy } = state;

//   //  Calculate the tasks to render using the selector
//   const visibleTasks = getVisibleTasks(tasks, filter, sortBy);

//   const completedCount = visibleTasks.filter(
//     (task) => task && task.isCompleted
//   ).length;
//   const hasTasks = visibleTasks && visibleTasks.length > 0;

//   const handleToggleComplete = async (task) => {
//     console.log("Toggling task:", task);
//     //  Update the UI immediately
//     // dispatch({
//     //   type: ActionType.TOGGLE_COMPLETE,
//     //   payload: task,
//     // });

//     try {
//       const newStatus = !task.isCompleted;
//       const updatedTask = await updateTaskStatus(task.id, newStatus);
//       dispatch({
//         type: ActionType.UPDATE_SUCCESS,
//         payload: updatedTask,
//       });
//     } catch (error) {
//       dispatch({
//         type: ActionType.FETCH_ERROR,
//         payload: `Failed to update task status: ${error.message}`,
//       });
//     }
//   }; //  Delete Single Task Handler
//   const handleDeleteTask = async (taskId) => {
//     //  Remove the item from the UI state immediately
//     dispatch({
//       type: ActionType.DELETE_SUCCESS,
//       payload: taskId,
//     });

//     try {
//       //API CALL
//       await deleteTask(taskId);
//     } catch (error) {
//       dispatch({
//         type: ActionType.FETCH_ERROR,
//         payload: `Failed to delete task: ${error.message}`,
//       });
//     }
//   }; //  Clear All Tasks Handler

//   const handleClearAllTasks = async () => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete ALL tasks? This cannot be undone."
//       )
//     )
//       return; // Clear the UI state immediately

//     dispatch({
//       type: ActionType.CLEAR_ALL_TASKS,
//     });

//     try {
//       // API CALL
//       await clearAllTasks();
//     } catch (error) {
//       dispatch({
//         type: ActionType.FETCH_ERROR,
//         payload: `Failed to clear all tasks: ${error.message}`,
//       });
//     }
//   }; // Handle loading and error states

//   if (loading) return <p>⏳ Loading tasks...</p>;
//   if (error)
//     return (
//       <p className="error-message">
//         ⚠️ Error fetching tasks: {error.message || error}
//       </p>
//     );

//   return (
//     <div className="todo-list-display">
//       <header className="list-header">
//         <h2>📋 Task List ({completedCount} Completed)</h2>
//         {hasTasks && (
//           <button
//             className="clear-all-button"
//             onClick={handleClearAllTasks}
//             disabled={loading}
//           >
//             💥 Clear All Tasks
//           </button>
//         )}
//       </header>
//       {/* Conditional Rendering */}
//       {!hasTasks && (
//         <p className="empty-message">🎉 All done! No tasks remaining. 🎉</p>
//       )}
//       <ul className="task-list">
//         {visibleTasks.map((task) => (
//           <li
//             key={task.id}
//             className={`task-item ${task.isCompleted ? "undo" : ""}`}
//           >
//             <span className="task-title">{task?.title} </span>
//             <div className="task-actions">
//               {/* NEW: Toggle Status Button */}
//               <button
//                 className={`toggle-button ${
//                   task.isCompleted ? "undo" : "complete"
//                 }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleToggleComplete(task);
//                 }}
//                 disabled={loading}
//               >
//                 {task.isCompleted ? "↩️ Undo" : "✅ Complete"}
//               </button>
//               {/* Delete Button */}
//               <button
//                 className="delete-button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDeleteTask(task.id);
//                 }}
//                 disabled={loading}
//               >
//                 🗑️
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default React.memo(TodoList);

// src/components/TodoList.jsx

import React from "react";
// Import the custom hook and ActionType
import { useTasks } from "../hooks/useTasks";
import { getVisibleTasks } from "../utils/taskSelectors"; // From Day 16
import EditableTask from "./EditableTask"; // <-- NEW IMPORT

// Use React.memo for optimization
function TodoList() {
  // **Pull the entire state object from the hook**
  const { state } = useTasks();

  // Destructure data needed for rendering and selection
  const { tasks, loading, error, filter, sortBy } = state;

  //  Use Selector: Calculate the tasks to render based on filter/sort state
  const visibleTasks = getVisibleTasks(tasks, filter, sortBy);

  // Calculate completedCount based on the visible tasks
  const completedCount = visibleTasks.filter(
    (task) => task && task.isCompleted
  ).length;

  const hasTasks = visibleTasks && visibleTasks.length > 0;

  // Handle loading and error states
  if (loading) return <p>⏳ Loading tasks...</p>;
  if (error)
    return <p className="error-message">⚠️ Error fetching tasks: {error}</p>;

  return (
    <div className="todo-list-display">
      <h2>Task List ({completedCount} Completed)</h2>

      {/* Conditional Rendering */}
      {!hasTasks && (
        <p className="empty-message">🎉 All done! No tasks remaining. 🎉</p>
      )}

      <ul className="task-list">
        {visibleTasks.map((task) => (
          <li key={task.id} className="task-item">
            {/* 🔑 Render the specialized EditableTask component */}
            <EditableTask task={task} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default React.memo(TodoList);
