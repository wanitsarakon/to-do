import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  formatTaskDate,
  getTodayKey,
  parseDateKey,
  shiftDateKey,
} from '../utils/taskUtils'

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const insightColors = ['#06141B', '#253745', '#4A5C6A', '#9BA8AB']
const pieColors = ['#06141B', '#253745', '#4A5C6A', '#9BA8AB']

function getCalendarDays(year, month) {
  const date = new Date(year, month, 1)
  const firstDay = date.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7

  return Array.from({ length: totalCells }).map((_, index) => {
    const day = index - firstDay + 1
    return day > 0 && day <= daysInMonth ? day : null
  })
}

function getGreeting(hour) {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function sortPendingTasks(a, b) {
  const priorityOrder = { high: 0, med: 1, low: 2 }

  if (a.due !== b.due) return a.due.localeCompare(b.due)
  return (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
}

export default function Dashboard({ tasks, profile, onAdd, onToggleComplete }) {
  const [today] = useState(() => new Date())
  const [calendarYear] = useState(() => today.getFullYear())
  const [calendarMonth] = useState(() => today.getMonth())
  const [selectedDay, setSelectedDay] = useState(() => today.getDate())

  const todayKey = getTodayKey(today)
  const weekAheadKey = shiftDateKey(7, today)
  const greeting = getGreeting(today.getHours())
  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  const completedRate = total ? Math.round((completed / total) * 100) : 0
  const dueTodayCount = tasks.filter((task) => !task.completed && task.due === todayKey).length
  const overdueCount = tasks.filter((task) => !task.completed && task.due < todayKey).length
  const upcomingCount = tasks.filter(
    (task) => !task.completed && task.due > todayKey && task.due <= weekAheadKey
  ).length

  const dateLabel = today.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const focusTasks = useMemo(() => {
    const pending = tasks.filter((task) => !task.completed).sort(sortPendingTasks)
    const dueToday = pending.filter((task) => task.due === todayKey)
    return (dueToday.length > 0 ? dueToday : pending).slice(0, 5)
  }, [tasks, todayKey])

  const categoryTotals = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        acc[task.cat] = (acc[task.cat] || 0) + 1
        return acc
      },
      { work: 0, personal: 0, study: 0, health: 0 }
    )
  }, [tasks])

  const chartData = useMemo(() => {
    const values = weekDays.map((label) => ({ name: label, completed: 0 }))

    tasks.forEach((task) => {
      if (!task.completed) return

      const due = parseDateKey(task.due)
      const index = due?.getDay()
      if (typeof index === 'number' && !Number.isNaN(index)) values[index].completed += 1
    })

    return values
  }, [tasks])

  const taskCountsByDay = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const due = parseDateKey(task.due)
      if (due && due.getFullYear() === calendarYear && due.getMonth() === calendarMonth) {
        const day = due.getDate()
        acc[day] = (acc[day] || 0) + 1
      }
      return acc
    }, {})
  }, [tasks, calendarYear, calendarMonth])

  const dayTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const due = parseDateKey(task.due)
        return (
          due &&
          due.getFullYear() === calendarYear &&
          due.getMonth() === calendarMonth &&
          due.getDate() === selectedDay
        )
      })
      .sort(sortPendingTasks)
  }, [tasks, calendarYear, calendarMonth, selectedDay])

  const taskDistribution = useMemo(() => {
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name: CATEGORY_LABELS[name] ?? name,
        value,
      }))
      .filter((item) => item.value > 0)
  }, [categoryTotals])

  const insights = useMemo(() => {
    const pending = tasks.filter((task) => !task.completed).sort(sortPendingTasks)
    const items = []

    if (dueTodayCount > 0) {
      items.push({
        title: `${dueTodayCount} task${dueTodayCount === 1 ? '' : 's'} due today`,
        note: 'Protect a focused block for the most important one first.',
      })
    }

    if (overdueCount > 0) {
      items.push({
        title: `${overdueCount} task${overdueCount === 1 ? '' : 's'} need a reset`,
        note: 'Clearing one overdue item can make the rest of the week feel lighter.',
      })
    }

    if (pending[0]) {
      items.push({
        title: `Next up: ${pending[0].name}`,
        note: `${PRIORITY_LABELS[pending[0].priority]} priority - due ${formatTaskDate(pending[0].due)}`,
      })
    }

    if (completed > 0) {
      items.push({
        title: `${completed} task${completed === 1 ? '' : 's'} already completed`,
        note: 'Momentum counts, especially on busy weeks.',
      })
    }

    return items.slice(0, 4)
  }, [tasks, dueTodayCount, overdueCount, completed])

  const calendarDays = getCalendarDays(calendarYear, calendarMonth)
  const monthLabel = new Date(calendarYear, calendarMonth, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  return (
    <section className="page dashboard">
      <div className="hero-banner">
        <div>
          <h1>{greeting}, {profile.name}</h1>
          <p>{dateLabel}</p>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>
          + Capture Task
        </button>
      </div>

      <div className="hero-row">
        <div className="hero-card">
          <div>
            <p className="card-head">A calmer plan for today</p>
            <h2>
              {dueTodayCount > 0
                ? `You have ${dueTodayCount} task${dueTodayCount === 1 ? '' : 's'} due today.`
                : 'No urgent tasks due today. Use the space well.'}
            </h2>
          </div>
          <span className="hero-badge">{completedRate}%</span>
        </div>
      </div>

      <div className="grid2 stats-grid">
        <div className="card small-card">
          <div className="card-head">Due Today</div>
          <div className="stat-value">{dueTodayCount}</div>
          <p className="stat-detail">tasks asking for attention now</p>
        </div>
        <div className="card small-card">
          <div className="card-head">Upcoming</div>
          <div className="stat-value">{upcomingCount}</div>
          <p className="stat-detail">due in the next 7 days</p>
        </div>
        <div className="card small-card">
          <div className="card-head">Overdue</div>
          <div className="stat-value">{overdueCount}</div>
          <p className="stat-detail">worth resetting soon</p>
        </div>
        <div className="card small-card">
          <div className="card-head">Completed</div>
          <div className="stat-value">{completed}</div>
          <p className="stat-detail">finished and off your mind</p>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-head">
            <span>Today's Focus</span>
            <Link to="/tasks" className="btn btn-ghost">
              Open Planner
            </Link>
          </div>
          <div className="task-list">
            {focusTasks.length > 0 ? (
              focusTasks.map((task) => (
                <div key={task.id} className={`task-row task-row-list ${task.completed ? 'done' : ''}`}>
                  <label className="task-checkbox">
                    <input type="checkbox" checked={task.completed} onChange={() => onToggleComplete(task.id)} />
                    <span />
                  </label>
                  <div>
                    <strong>{task.name}</strong>
                    <span className="task-subtitle">
                      {task.notes || `${PRIORITY_LABELS[task.priority]} priority`}
                    </span>
                  </div>
                  <div className={`tag t-${task.cat}`}>{CATEGORY_LABELS[task.cat]}</div>
                  <div className={task.priority === 'high' ? 'p-high' : task.priority === 'med' ? 'p-med' : 'p-low'}>
                    {PRIORITY_LABELS[task.priority]}
                  </div>
                </div>
              ))
            ) : (
              <p className="stat-detail">Nothing pending right now. A good time to plan ahead.</p>
            )}
          </div>
        </div>

        <div className="card calendar-card">
          <div className="card-head">
            <span>{monthLabel}</span>
            <button className="btn btn-ghost" onClick={() => setSelectedDay(today.getDate())}>
              Today
            </button>
          </div>
          <div className="calendar-grid">
            {weekDays.map((day) => (
              <div key={day} className="calendar-day header">
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => {
              const eventCount = day ? taskCountsByDay[day] : 0
              return (
                <div
                  key={index}
                  className={`calendar-day ${day === selectedDay ? 'selected' : ''} ${day == null ? 'empty' : ''} ${eventCount ? 'has-event' : ''}`}
                  onClick={() => day && setSelectedDay(day)}
                >
                  <span>{day || ''}</span>
                  {eventCount ? <span className="calendar-dot" /> : null}
                </div>
              )
            })}
          </div>
          <div className="calendar-summary">
            <div className="calendar-summary-head">
              <span>
                {dayTasks.length} task{dayTasks.length === 1 ? '' : 's'} on{' '}
                {formatTaskDate(
                  `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`,
                  { month: 'long', day: 'numeric' }
                )}
              </span>
              <span className={`tag ${dayTasks.length ? 't-work' : 't-health'}`}>
                {dayTasks.length ? 'Planned' : 'Open'}
              </span>
            </div>
            {dayTasks.length > 0 ? (
              dayTasks.map((task) => (
                <div
                  key={task.id}
                  className="task-row task-row-list"
                  style={{ padding: '10px 0', borderBottom: '1px solid rgba(17,33,45,.08)' }}
                >
                  <div style={{ display: 'grid', gap: 4 }}>
                    <strong>{task.name}</strong>
                    <span className="task-subtitle">{task.notes || `${PRIORITY_LABELS[task.priority]} priority`}</span>
                  </div>
                  <div className={`tag t-${task.cat}`}>{CATEGORY_LABELS[task.cat]}</div>
                </div>
              ))
            ) : (
              <p className="stat-detail" style={{ marginTop: 8 }}>
                No tasks planned for this day.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid31">
        <div className="card">
          <div className="card-head">
            <span>Completion Rhythm</span>
            <Link to="/tasks" className="btn btn-ghost">
              Review Tasks
            </Link>
          </div>
          <div className="chart-card">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData} margin={{ top: 8, right: 20, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 92, 106, 0.2)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text3)' }} />
                <YAxis tick={{ fill: 'var(--text3)' }} />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#253745" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <span>Life Balance</span>
          </div>
          <div className="progress-block">
            <div className="progress-row">
              <span>Work</span>
              <span>{categoryTotals.work} tasks</span>
            </div>
            <div className="prog-bar">
              <div className="prog-fill pf-blue" style={{ width: `${Math.min(100, categoryTotals.work * 10)}%` }} />
            </div>
            <div className="progress-row">
              <span>Life</span>
              <span>{categoryTotals.personal} tasks</span>
            </div>
            <div className="prog-bar">
              <div className="prog-fill pf-purple" style={{ width: `${Math.min(100, categoryTotals.personal * 10)}%` }} />
            </div>
            <div className="progress-row">
              <span>Learning</span>
              <span>{categoryTotals.study} tasks</span>
            </div>
            <div className="prog-bar">
              <div className="prog-fill pf-amber" style={{ width: `${Math.min(100, categoryTotals.study * 10)}%` }} />
            </div>
            <div className="progress-row">
              <span>Wellness</span>
              <span>{categoryTotals.health} tasks</span>
            </div>
            <div className="prog-bar">
              <div className="prog-fill pf-green" style={{ width: `${Math.min(100, categoryTotals.health * 10)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid31">
        <div className="card">
          <div className="card-head">
            <span>Task Mix</span>
          </div>
          <div className="chart-card" style={{ minHeight: 260, display: 'grid', placeItems: 'center' }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={taskDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} paddingAngle={3}>
                  {taskDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <span>Gentle Nudges</span>
          </div>
          <div className="activity-list">
            {insights.map((item, index) => (
              <div key={item.title} className="activity-item">
                <span className="activity-dot" style={{ background: insightColors[index % insightColors.length] }} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
