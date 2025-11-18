// taskReducerConstants.js

export const ActionType = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_TASK: 'ADD_TASK',
  TOGGLE_COMPLETE: 'TOGGLE_COMPLETE',
  DELETE_TASK: 'DELETE_TASK',
  UPDATE_SUCCESS: 'UPDATE_SUCCESS',
  DELETE_SUCCESS: 'DELETE_SUCCESS',
  CLEAR_ALL_TASKS: 'CLEAR_ALL_TASKS',
};

export const initialState = {
  tasks: [],
  loading: false,
  error: null,
};