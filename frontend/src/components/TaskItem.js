import { useState } from "react";
import { updateTaskStatus } from "../api";

const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

export default function TaskItem({ task, onStatusUpdated }) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    setUpdating(true);
    setError("");
    try {
      const updatedTask = await updateTaskStatus(task.id, newStatus);
      onStatusUpdated(updatedTask);
    } catch (err) {
      setError("Could not update status.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="task-item">
      <div className="task-item-header">
        <div>
          <p className="task-title">{task.title}</p>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>
        <span className={`status-badge status-${task.status}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="field" style={{ maxWidth: 200 }}>
        <label htmlFor={`status-${task.id}`}>Update status</label>
        <select
          id={`status-${task.id}`}
          value={task.status}
          disabled={updating}
          onChange={handleStatusChange}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
}
