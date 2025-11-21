// taskReducerConstants.js

export const ActionType = {
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  ADD_TASK: "ADD_TASK",
  TOGGLE_COMPLETE: "TOGGLE_COMPLETE",
  DELETE_TASK: "DELETE_TASK",
  UPDATE_SUCCESS: "UPDATE_SUCCESS",
  DELETE_SUCCESS: "DELETE_SUCCESS",
  CLEAR_ALL_TASKS: "CLEAR_ALL_TASKS",
  SET_FILTER: "SET_FILTER",
  SET_SORT: "SET_SORT",
  ACTION_START: "ACTION_START",
  ACTION_SUCCESS: "ACTION_SUCCESS",
  ACTION_ERROR: "ACTION_ERROR",
};

export const initialState = {
  tasks: [],
  loading: false, // For initial full fetch
  error: null,
  filter: "ALL",
  sortBy: "TITLE_ASC",
  actionLoadingId: null, // NEW: Tracks the ID of the task being acted upon
};
