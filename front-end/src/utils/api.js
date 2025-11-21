import { API } from "../config/api";

/**
 * Fetches all tasks from the backend API, handles the nested response structure,
 * and extracts the array of tasks.
 * * @returns {Promise<Array>} A promise that resolves to an array of task objects.
 */
export async function fetchTasks() {
  try {
    const response = await fetch(API.TASKS);

    if (!response.ok) {
      // If response is not OK, try to read the JSON error body
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    // Parse the full response object
    const fullResponse = await response.json();

    // Check if the expected structure exists
    if (!fullResponse.data || !fullResponse.data.tasks) {
      throw new Error(
        "Invalid API response format: 'data.tasks' array not found."
      );
    }

    // Extract and return ONLY the array of tasks
    const tasks = fullResponse.data.tasks;
    return tasks;
  } catch (error) {
    console.error("API Fetch Error:", error);
    // Re-throw the error so the caller (TaskProvider) can handle it
    throw error;
  }
}

export async function addTasks(taskData) {
  try {
    const response = await fetch(API.TASKS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      // If response is not OK, try to read the JSON error body
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    // Parse the full response object
    const fullResponse = await response.json();

    // Check if the expected structure exists
    if (!fullResponse.data || !fullResponse.data.task) {
      throw new Error(
        "Invalid API response format: 'data.tasks' array not found."
      );
    }

    // Extract and return ONLY the array of tasks
    const tasks = fullResponse.data.task;
    return tasks;
  } catch (error) {
    console.error("API Fetch Error:", error);
    // Re-throw the error so the caller (TaskProvider) can handle it
    throw error;
  }
}

/**
 * Sends a status update for a specific task to the backend API.
 * @param {string} taskId The ID of the task to update.
 * @param {boolean} newStatus The new isCompleted status (true/false).
 * @returns {Promise<object>} A promise that resolves to the server-confirmed, updated task object.
 */
export async function updateTaskStatus(taskId, newStatus) {
  try {
    const response = await fetch(`${API.TASKS}/${taskId}`, {
      method: "PATCH", // Use PATCH for partial updates
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isCompleted: newStatus }), // Send only the field to change
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    // Backend should return the updated task, potentially wrapped
    const fullResponse = await response.json();

    // Assuming your successful response format is: { message: "Success", data: { task: {...} } }
    if (!fullResponse.data || !fullResponse.data.task) {
      throw new Error("Invalid API response format for update task.");
    }

    // Return ONLY the server-confirmed task object
    return fullResponse.data.task;
  } catch (error) {
    console.error("API Update Task Error:", error);
    throw error;
  }
}

/**
 * Sends a DELETE request to remove a specific task.
 * @param {string} taskId The ID of the task to delete.
 * @returns {Promise<string>} A promise that resolves to the ID of the task deleted (on success).
 */
export async function deleteTask(taskId) {
  try {
    const response = await fetch(`${API.TASKS}/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    // A successful DELETE often returns an empty body or a simple success message.
    // For simplicity, we'll return the ID we attempted to delete upon successful 200/204 status.
    return taskId;
  } catch (error) {
    console.error("API Delete Task Error:", error);
    throw error;
  }
}

export async function clearAllTasks() {
  try {
    const response = await fetch(`${API.TASKS}/clear`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    // A successful DELETE often returns an empty body or a simple success message.
    // For simplicity, we'll return the ID we attempted to delete upon successful 200/204 status.
    return true;
  } catch (error) {
    console.error("API Clear All Tasks Error:", error);
    throw error;
  }
}



export async function updateTask(taskId, updates) {
  try {
    const response = await fetch(`${API.TASKS}/${taskId}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates), 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    // Backend should return the updated task, potentially wrapped
    const fullResponse = await response.json();

    // Assuming your successful response format is: { message: "Success", data: { task: {...} } }
    if (!fullResponse.data || !fullResponse.data.task) {
      throw new Error("Invalid API response format for update task.");
    }

    // Return ONLY the server-confirmed task object
    return fullResponse.data.task;
  } catch (error) {
    console.error("API Update Task Error:", error);
    throw error;
  }
}