import { useMemo, useState } from 'react'
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  formatTaskDate,
  getTodayKey,
  shiftDateKey,
} from '../utils/taskUtils'

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'done', label: 'Done' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Life' },
  { value: 'study', label: 'Learning' },
  { value: 'health', label: 'Wellness' },
]

const sortOptions = ['Newest', 'Oldest', 'Due Soon', 'Priority']

export default function Tasks({ tasks, onAdd, onEdit, onDelete, onToggleComplete, onReorder }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('Due Soon')
  const [dragOverId, setDragOverId] = useState(null)

  const todayKey = getTodayKey()
  const weekAheadKey = shiftDateKey(7)

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const titleMatch = task.name.toLowerCase().includes(query.toLowerCase())

        const filterMatch =
          filter === 'all' ||
          (filter === 'today' && !task.completed && task.due === todayKey) ||
          (filter === 'upcoming' && !task.completed && task.due > todayKey && task.due <= weekAheadKey) ||
          (filter === 'overdue' && !task.completed && task.due < todayKey) ||
          (filter === 'done' && task.completed) ||
          task.cat === filter

        return titleMatch && filterMatch
      })
      .sort((a, b) => {
        if (sortBy === 'Oldest') return a.id - b.id
        if (sortBy === 'Due Soon') return a.due.localeCompare(b.due)

        if (sortBy === 'Priority') {
          const order = { high: 1, med: 2, low: 3 }
          return (order[a.priority] || 99) - (order[b.priority] || 99)
        }

        return b.id - a.id
      })
  }, [tasks, query, filter, sortBy, todayKey, weekAheadKey])

  const openCount = tasks.filter((task) => !task.completed).length
  const dueTodayCount = tasks.filter((task) => !task.completed && task.due === todayKey).length
  const overdueCount = tasks.filter((task) => !task.completed && task.due < todayKey).length

  return (
    <section className="page tasks">
      <div className="topbar">
        <div>
          <h1>Personal Planner</h1>
          <p>{openCount} open tasks, {dueTodayCount} due today, {overdueCount} overdue.</p>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>
          + Capture Task
        </button>
      </div>

      <div className="search-row">
        <input
          className="search-box"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by task name..."
        />
        <select className="sort-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="task-filters">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={filter === option.value ? 'btn btn-primary' : 'btn btn-ghost'}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="task-table">
        <div className="table-head">
          <span>Task</span>
          <span>Category</span>
          <span>Priority</span>
          <span>When</span>
          <span>Actions</span>
        </div>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              draggable="true"
              onDragStart={(event) => {
                event.dataTransfer.setData('text/plain', String(task.id))
                event.dataTransfer.effectAllowed = 'move'
              }}
              onDragOver={(event) => {
                event.preventDefault()
                setDragOverId(task.id)
              }}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(event) => {
                event.preventDefault()
                const fromId = Number(event.dataTransfer.getData('text/plain'))
                if (fromId && fromId !== task.id) onReorder(fromId, task.id)
                setDragOverId(null)
              }}
              className={`table-row ${task.completed ? 'done' : ''} ${dragOverId === task.id ? 'drag-over' : ''}`}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <label className="task-checkbox">
                  <input type="checkbox" checked={task.completed} onChange={() => onToggleComplete(task.id)} />
                  <span />
                </label>
                <div>
                  <strong>{task.name}</strong>
                  <p className="task-subtitle">{task.notes || 'No notes yet.'}</p>
                </div>
              </div>
              <span className={`tag t-${task.cat}`}>{CATEGORY_LABELS[task.cat]}</span>
              <span className={task.priority === 'high' ? 'p-high' : task.priority === 'med' ? 'p-med' : 'p-low'}>
                {PRIORITY_LABELS[task.priority]}
              </span>
              <span>{formatTaskDate(task.due, { month: 'short', day: 'numeric' })}</span>
              <span className="task-actions">
                <button className="btn btn-ghost" onClick={() => onEdit(task)}>
                  Edit
                </button>
                <button className="btn btn-ghost" onClick={() => onDelete(task.id)}>
                  Delete
                </button>
              </span>
            </div>
          ))
        ) : (
          <div className="card" style={{ padding: 22, textAlign: 'center' }}>
            No tasks match that view right now.
          </div>
        )}
      </div>
    </section>
  )
}
