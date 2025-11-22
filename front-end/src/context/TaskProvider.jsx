// import { useEffect, useReducer } from "react";
// import { TaskContext } from "./TaskContext";
// import { ActionType, initialState } from "../constants/taskReducerConstants";
// import { taskReducer } from "../utils/taskReducer";
// import { fetchTasks } from "../utils/api";

// // =================================================================
// // Implement TaskProvider Component
// // =================================================================

// export const TaskProvider = ({ children }) => {
//   // Initialize state using the reducer function and initial state object
//   const [state, dispatch] = useReducer(taskReducer, initialState);

//   //  Fetch tasks from API when the provider mounts
//   useEffect(() => {
//     const loadTasks = async () => {
//       dispatch({ type: ActionType.FETCH_START });

//       try {
//         const tasks = await fetchTasks();

//         // Dispatch success action with fetched tasks
//         dispatch({ type: ActionType.FETCH_SUCCESS, payload: tasks });
//       } catch (error) {
//         dispatch({
//           type: ActionType.FETCH_ERROR,
//           payload: error.message,
//         });
//       }
//     };
//     // Execute the async function
//     loadTasks();

//     // The empty dependency array [] ensures this runs only once on mount
//   }, []);

//   // The value provided to consuming components
//   const contextValue = {
//     // Expose the entire state object {tasks: [], loading: false, error: null}
//     state,
//     // Expose the dispatch function (used by components to request state changes)
//     dispatch,
//   };

//   return (
//     <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
//   );
// };

import { useReducer } from "react";
import { taskReducer } from "../utils/taskReducer";
import { initialState } from "../constants/taskReducerConstants";
import { TaskContext } from "./TaskContext";

export const TaskProvider = ({ children }) => {
  // state now only contains { filter, sortBy }
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};
