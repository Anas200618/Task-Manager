// Hardcoded API base URL, as specified in the project requirements.
const API_BASE_URL = "http://localhost:8000";

/**
 * Fetch tasks, optionally filtered by status.
 * @param {string} status - "all" | "pending" | "in_progress" | "done"
 */
export async function fetchTasks(status) {
  const url =
    status && status !== "all"
      ? `${API_BASE_URL}/api/tasks/?status=${encodeURIComponent(status)}`
      : `${API_BASE_URL}/api/tasks/`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    const message =
      (data && (data.error || data.detail)) || "Failed to load tasks.";
    throw new Error(message);
  }

  return data;
}

/**
 * Create a new task.
 * @param {{title: string, description: string}} task
 */
export async function createTask(task) {
  const response = await fetch(`${API_BASE_URL}/api/tasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiValidationError(data);
  }

  return data;
}

/**
 * Update a task's status.
 * @param {number} id
 * @param {string} status
 */
export async function updateTaskStatus(id, status) {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiValidationError(data);
  }

  return data;
}

/**
 * Custom error that carries the parsed DRF validation error payload,
 * e.g. { title: ["This field may not be blank."] }
 */
export class ApiValidationError extends Error {
  constructor(payload) {
    const message = flattenErrorPayload(payload);
    super(message);
    this.name = "ApiValidationError";
    this.payload = payload;
  }
}

function flattenErrorPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "Something went wrong. Please try again.";
  }
  if (payload.error) {
    return payload.error;
  }
  const parts = [];
  for (const [field, messages] of Object.entries(payload)) {
    const text = Array.isArray(messages) ? messages.join(" ") : messages;
    parts.push(`${field}: ${text}`);
  }
  return parts.length > 0 ? parts.join(" | ") : "Something went wrong.";
}
