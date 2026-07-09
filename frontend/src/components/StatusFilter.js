export default function StatusFilter({ value, onChange }) {
  return (
    <div className="filter-row">
      <label htmlFor="status-filter">Filter:</label>
      <select
        id="status-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}
