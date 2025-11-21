// import { useState, useRef, useEffect } from "react";
// // Import the custom hook and ActionType
// import { useTasks } from "../hooks/useTasks";
// import { ActionType } from "../constants/taskReducerConstants";
// import { addTasks } from "../utils/api";

// // Use post api to add task to server
// function TaskForm() {
//   const [taskText, setTaskText] = useState("");
//   const { dispatch } = useTasks();
//   const inputRef = useRef(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Focus the input field when the component mounts
//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, []);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (taskText.trim() === "") return;

//     // Create a new task object with a temporary ID
//     const newTask = {
//       title: taskText,
//       isCompleted: false,
//     };

//     try {
//       const savedTask = await addTasks(newTask);
//       dispatch({
//         type: ActionType.ADD_TASK,
//         payload: savedTask, // Use the task object returned by the server
//       });

//     } catch (error) {
//       //  Handle the error (e.g., show a toast/notification)
//       console.error("Failed to add task:", error);
//       alert(`Error adding task: ${error.message}`); // Simple error display

//       // Optional: Dispatch an error action if you need the provider state to reflect the failure
//       // dispatch({ type: ActionType.FETCH_ERROR, payload: error.message });
//     } finally {
//       setIsSubmitting(false);
//       inputRef.current.focus();
//     }

//     setTaskText("");
//     // Re-focus the input after submission
//     inputRef.current.focus();
//   };

//   return (
//     <form onSubmit={handleSubmit} className="task-form">
//       <input
//         type="text"
//         placeholder="Enter a new task..."
//         ref={inputRef}
//         value={taskText}
//         onChange={(e) => setTaskText(e.target.value)}
//         disabled={isSubmitting} // Prevent input during network request
//       />
//       <button type="submit" disabled={isSubmitting}>
//         {isSubmitting ? "Adding..." : "Add Task"}{" "}
//         {/* Provide submission feedback */}
//       </button>
//     </form>
//   );
// }

// export default TaskForm;

// src/components/TaskForm.jsx (Key changes in handleSubmit)

import { useState, useRef } from "react";
// Import the custom hook and ActionType
import { useTasks } from "../hooks/useTasks";
import { ActionType } from "../constants/taskReducerConstants";
import { addTasks } from "../utils/api";

function TaskForm() {
  const [taskText, setTaskText] = useState("");
  // Pull the state to check the loading ID
  const { state, dispatch } = useTasks();
  const inputRef = useRef(null);

  // Define the unique ID for the form action
  const NEW_TASK_ID = "NEW_TASK";

  // Determine if the form is currently submitting
  const isSubmitting = state.actionLoadingId === NEW_TASK_ID;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (taskText.trim() === "" || isSubmitting) return;

    const newTask = { title: taskText, isCompleted: false };

    try {
      // 1. START: Dispatch action start before the API call
      dispatch({ type: ActionType.ACTION_START, payload: NEW_TASK_ID });

      const savedTask = await addTasks(newTask);

      // 2. SUCCESS: Dispatch task update
      dispatch({ type: ActionType.ADD_TASK, payload: savedTask });

      // 3. END: Dispatch action success to clear loading state
      dispatch({ type: ActionType.ACTION_SUCCESS });

      setTaskText("");
    } catch (error) {
      // 3. END (Error): Dispatch action error to clear loading state and show error
      dispatch({
        type: ActionType.FETCH_ERROR,
        payload: `Error adding task: ${error.message}`,
      });
      dispatch({ type: ActionType.ACTION_ERROR });
    } finally {
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Enter a new task..."
        ref={inputRef}
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        disabled={isSubmitting || state.loading} // Disable during network request
      />
      <button type="submit" disabled={isSubmitting || state.loading}>
        {isSubmitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;
