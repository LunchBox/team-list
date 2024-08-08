import { BASE_URL } from "./base";

function getAuthToken() {
  // 這個函數應該返回存儲在客戶端的 JWT token
  return localStorage.getItem("token");
}

export async function fetchTasks() {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const tasks = await response.json();
    console.log("Tasks fetched:", tasks);
    return tasks;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error;
  }
}

export async function createTask(taskData) {
  try {
    console.log("-- create Task");
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(taskData),
    });
    console.log(response);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const createdTask = await response.json();
    console.log("Task created successfully:", createdTask);
    return createdTask;
  } catch (error) {
    console.error("Failed to create task:", error);
    throw error;
  }
}

export async function updateTask(taskId, updatedData) {
  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const updatedTask = await response.json();
    console.log("Task updated successfully:", updatedTask);
    return updatedTask;
  } catch (error) {
    console.error("Failed to update task:", error);
    throw error;
  }
}

export async function deleteTask(taskId) {
  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    console.log("Task deleted successfully");
    return true;
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw error;
  }
}
