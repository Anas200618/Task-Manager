import { useEffect, useState, useCallback } from "react";
import TaskForm from "./components/TaskForm";
import StatusFilter from "./components/StatusFilter";
import TaskList from "./components/TaskList";
import { fetchTasks } from "./api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async (status) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTasks(status);
      setTasks(data);
    } catch (err) {
      setError(err.message || "Could not load tasks. Is the API running?");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks on mount and whenever the status filter changes.
  useEffect(() => {
    loadTasks(statusFilter);
  }, [statusFilter, loadTasks]);

  function handleTaskCreated() {
    loadTasks(statusFilter);
  }

  function handleStatusUpdated(updatedTask) {
    setTasks((prevTasks) => {
      // If the updated task no longer matches the active filter, drop it
      // from the visible list; otherwise replace it in place.
      if (statusFilter !== "all" && updatedTask.status !== statusFilter) {
        return prevTasks.filter((t) => t.id !== updatedTask.id);
      }
      return prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    });
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <p className="subtitle">Create, view, and update your tasks.</p>

      <TaskForm onTaskCreated={handleTaskCreated} />

      <StatusFilter value={statusFilter} onChange={setStatusFilter} />

      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onStatusUpdated={handleStatusUpdated}
      />
    </div>
  );
}

export default App;
