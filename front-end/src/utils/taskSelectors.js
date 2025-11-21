// src/utils/taskSelectors.js

/**
 * Applies filtering and sorting logic to the tasks array based on the state.
 * @param {object[]} tasks - The array of task objects.
 * @param {string} filter - The current filter ('ALL', 'ACTIVE', 'COMPLETED').
 * @param {string} sortBy - The current sort setting.
 * @returns {object[]} The filtered and sorted array of tasks.
 */
export const getVisibleTasks = (tasks, filter, sortBy) => {

  //  Filtering Logic
  const filteredTasks = tasks.filter((task) => {
    if (filter === "ACTIVE") {
      return !task.isCompleted;
    }
    if (filter === "COMPLETED") {
      return task.isCompleted;
    }
    return true; // 'ALL' filter
  });

  // sorting Logic (Create a shallow copy to avoid mutating state)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "TITLE_ASC") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "TITLE_DESC") {
      return b.title.localeCompare(a.title);
    }
    // Assuming your task objects have a 'createdAt' property (from timestamps: true)
    if (sortBy === "DATE_ASC") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === "DATE_DESC") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  return sortedTasks;
};
