import TaskItem from "./TaskItem";

export default function TaskList({ tasks, loading, error, onStatusUpdated }) {
  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (tasks.length === 0) {
    return <p className="empty-state">No tasks found.</p>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onStatusUpdated={onStatusUpdated} />
      ))}
    </div>
  );
}
