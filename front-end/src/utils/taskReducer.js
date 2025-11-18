import { ActionType } from "../constants/taskReducerConstants";

// Move the pure function here
export function taskReducer(state, action) {
  // The reducer is a PURE FUNCTION: it must not mutate the state.
  switch (action.type) {
    // --- API Call Status Actions  ---
    case ActionType.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null, // Clear any previous error
      };

    case ActionType.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: action.payload, // Replace tasks with data from the API
      };

    case ActionType.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload, // Set the error message
      };

    // --- Local Task Management Actions ---
    case ActionType.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload], // Add the new task
      };

    case ActionType.TOGGLE_COMPLETE:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          // action.payload is expected to be the task ID
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };

    case ActionType.DELETE_TASK:
      return {
        ...state,
        // action.payload is expected to be the task ID
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case ActionType.UPDATE_SUCCESS: {
      const updatedTask = action.payload;

      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ),
      };
    }

    case ActionType.DELETE_SUCCESS: {
      // The payload is the ID of the task that was successfully deleted
      const deletedId = action.payload;

      return {
        ...state,
        // Filter out the task that matches the deleted ID
        tasks: state.tasks.filter((task) => task.id !== deletedId),
      };
    }

    case ActionType.CLEAR_ALL_TASKS:
      return {
        ...state,
        tasks: [], // Clear all tasks
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
