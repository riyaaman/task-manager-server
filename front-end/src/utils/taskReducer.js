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
        actionLoadingId: null,
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

    case ActionType.UPDATE_SUCCESS:
      // The component must dispatch ACTION_SUCCESS after this completes
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        error: null,
      };

    case ActionType.DELETE_SUCCESS:
      // The component must dispatch ACTION_SUCCESS after this completes
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        error: null,
      };

    case ActionType.CLEAR_ALL_TASKS:
      return {
        ...state,
        tasks: [], // Clear all tasks
      };

    case ActionType.SET_FILTER:
      return {
        ...state,
        filter: action.payload, // payload will be 'ALL', 'ACTIVE', or 'COMPLETED'
      };
    case ActionType.SET_SORT:
      return {
        ...state,
        sortBy: action.payload, // payload will be a sort key like 'TITLE_ASC'
      };

    case ActionType.ACTION_START:
      // Payload is the ID of the task being operated on (or a generic string like 'NEW_TASK')
      return { ...state, actionLoadingId: action.payload, error: null };

    case ActionType.ACTION_SUCCESS:
    case ActionType.ACTION_ERROR: // Handle success or error to clear the loading indicator
      return { ...state, actionLoadingId: null };
    // Update ADD_SUCCESS, UPDATE_SUCCESS, DELETE_SUCCESS to use ACTION_SUCCESS
    // For example:
    case ActionType.ADD_SUCCESS:
      // The component must dispatch ACTION_SUCCESS after this completes
      return { ...state, tasks: [...state.tasks, action.payload], error: null };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
