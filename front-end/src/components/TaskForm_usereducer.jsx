// import { useState, useContext, useRef, useEffect } from "react";
// import { TaskContext } from "../context/TaskContext";

// function TaskForm() {
//   const [taskText, setTaskText] = useState("");
//   const { addTask } = useContext(TaskContext);
//   const inputRef = useRef(null);

//   // Focus the input field when the component mounts
//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, []);

//   const handleInputChange = (event) => {
//     setTaskText(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     if (taskText.trim() === "") return;

//     addTask(taskText);
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
//         onChange={handleInputChange}
//       />
//       <button type="submit">Add Task</button>
//     </form>
//   );
// }

// export default TaskForm;





// UseReducer and Context API Implementation
// TaskForm.jsx

import { useState, useRef, useEffect } from "react";
// Import the custom hook and ActionType
import { useTasks } from "../hooks/useTasks"; 
import { ActionType } from "../constants/taskReducerConstants";

function TaskForm() {
  const [taskText, setTaskText] = useState("");
  // **CHANGE 1: Get dispatch from useTasks hook**
  const { dispatch, state } = useTasks(); 
  const inputRef = useRef(null);

  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // const handleInputChange = (event) => {
  //   setTaskText(event.target.value);
  // };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (taskText.trim() === "") return;

    // Create a new task object with a temporary ID
    const newTask = { 
      id: Date.now(), // Temporary ID until integrated with Node.js
      text: taskText, 
      completed: false 
    };

    // **CHANGE 2: Use dispatch to send an Action Object**
    dispatch({
      type: ActionType.ADD_TASK,
      payload: newTask, // Send the new task data as the payload
    });
    
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
        disabled={state.loading} // Prevent input during network request
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;