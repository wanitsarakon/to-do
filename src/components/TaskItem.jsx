export default function TaskItem({ task }) {
  return (
    <div className="task-item">
      <input type="checkbox" checked={task?.completed} readOnly />
      <div className="task-body">
        <div className="task-title">{task?.name || 'Task title'}</div>
        <div className="task-meta">{task?.cat}</div>
      </div>
    </div>
  )
}
