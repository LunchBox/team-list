import { BASE_URL } from "./base";

export async function createTask(taskData) {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

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
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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
