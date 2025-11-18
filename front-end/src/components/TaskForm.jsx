import { useState, useRef, useEffect } from "react";
// Import the custom hook and ActionType
import { useTasks } from "../hooks/useTasks";
import { ActionType } from "../constants/taskReducerConstants";
import { addTasks } from "../utils/api";

// Use post api to add task to server
function TaskForm() {
  const [taskText, setTaskText] = useState("");
  const { dispatch } = useTasks();
  const inputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (taskText.trim() === "") return;

    // Create a new task object with a temporary ID
    const newTask = {
      title: taskText,
      isCompleted: false,
    };

    try {
      const savedTask = await addTasks(newTask);
      dispatch({
        type: ActionType.ADD_TASK,
        payload: savedTask, // Use the task object returned by the server
      });
      

    } catch (error) {
      //  Handle the error (e.g., show a toast/notification)
      console.error("Failed to add task:", error);
      alert(`Error adding task: ${error.message}`); // Simple error display

      // Optional: Dispatch an error action if you need the provider state to reflect the failure
      // dispatch({ type: ActionType.FETCH_ERROR, payload: error.message });
    } finally {
      setIsSubmitting(false);
      inputRef.current.focus();
    }

    setTaskText("");
    // Re-focus the input after submission
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
        disabled={isSubmitting} // Prevent input during network request
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Task"}{" "}
        {/* Provide submission feedback */}
      </button>
    </form>
  );
}

export default TaskForm;
