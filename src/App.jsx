import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TaskModal from './components/TaskModal'
import Toast from './components/Toast'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
import { fetchTasks, saveTasks } from './api/tasks'

const THEME_KEY = 'taskflow-dashboard-theme'
const PROFILE_KEY = 'taskflow-dashboard-profile'

const defaultProfile = {
  name: 'Ploy',
  title: 'Frontend Developer',
  email: 'ploy@example.com',
  location: 'Bangkok, Thailand',
  github: 'github.com/ploy-dev',
  notifications: {
    dailyPlanning: true,
    weeklyReset: true,
    focusMode: false,
    sound: false,
  },
}

function normalizeNotifications(notifications = {}) {
  return {
    dailyPlanning: notifications.dailyPlanning ?? notifications.email ?? true,
    weeklyReset: notifications.weeklyReset ?? notifications.weekly ?? true,
    focusMode: notifications.focusMode ?? notifications.push ?? false,
    sound: notifications.sound ?? false,
  }
}

function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark'
  } catch {
    return false
  }
}

function loadProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY)
    if (!saved) return defaultProfile

    const parsed = JSON.parse(saved)
    return {
      ...defaultProfile,
      ...parsed,
      notifications: normalizeNotifications(parsed.notifications),
    }
  } catch {
    return defaultProfile
  }
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(() => loadTheme())
  const [profile, setProfile] = useState(() => loadProfile())
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    let mounted = true

    fetchTasks().then((data) => {
      if (!mounted) return
      setTasks(data)
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (loading) return
    saveTasks(tasks).catch((err) => console.error(err))
  }, [tasks, loading])

  useEffect(() => {
    try {
      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({
          ...profile,
          notifications: normalizeNotifications(profile.notifications),
        })
      )
    } catch (err) {
      console.error(err)
    }
  }, [profile])

  useEffect(() => {
    try {
      if (dark) document.documentElement.setAttribute('data-dark', 'true')
      else document.documentElement.removeAttribute('data-dark')

      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
    } catch (err) {
      console.error(err)
    }
  }, [dark])

  useEffect(() => {
    if (!toast) return

    const timer = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
  }

  const openAddModal = () => {
    setEditTask(null)
    setModalOpen(true)
  }

  const openEditModal = (task) => {
    setEditTask(task)
    setModalOpen(true)
  }

  const handleTaskSubmit = (task) => {
    if (editTask) {
      setTasks((current) => current.map((item) => (item.id === editTask.id ? { ...item, ...task } : item)))
      showToast('Task updated successfully')
      return
    }

    setTasks((current) => [{ id: Date.now(), completed: false, ...task }, ...current])
    showToast('Task captured successfully')
  }

  const handleDelete = (taskId) => {
    setTasks((current) => current.filter((task) => task.id !== taskId))
    showToast('Task removed', 'danger')
  }

  const handleToggleComplete = (taskId) => {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    )
    showToast('Task status updated', 'info')
  }

  const handleReorder = (fromId, toId) => {
    setTasks((current) => {
      const items = [...current]
      const fromIndex = items.findIndex((task) => task.id === fromId)
      const toIndex = items.findIndex((task) => task.id === toId)

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return current

      const [moved] = items.splice(fromIndex, 1)
      items.splice(toIndex, 0, moved)
      return items
    })
  }

  const pendingCount = tasks.filter((task) => !task.completed).length

  if (loading) {
    return (
      <BrowserRouter>
        <div className="app-root">
          <Sidebar pendingCount={pendingCount} profile={profile} dark={dark} setDark={setDark} />
          <main className="app-main">
            <div className="page" style={{ minHeight: '80vh', display: 'grid', placeItems: 'center' }}>
              <div className="card">Loading your planner...</div>
            </div>
          </main>
        </div>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <div className="app-root">
        <Sidebar pendingCount={pendingCount} dark={dark} setDark={setDark} profile={profile} />

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  tasks={tasks}
                  profile={profile}
                  onAdd={openAddModal}
                  onToggleComplete={handleToggleComplete}
                />
              }
            />
            <Route
              path="/tasks"
              element={
                <Tasks
                  tasks={tasks}
                  onAdd={openAddModal}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                  onReorder={handleReorder}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  tasks={tasks}
                  profile={{
                    ...profile,
                    notifications: normalizeNotifications(profile.notifications),
                  }}
                  onProfileChange={setProfile}
                  dark={dark}
                  onToggleDark={() => setDark((value) => !value)}
                />
              }
            />
          </Routes>
        </main>
      </div>

      <TaskModal
        key={modalOpen ? (editTask ? `edit-${editTask.id}` : 'new-task') : 'closed'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleTaskSubmit}
        editTask={editTask}
      />

      {toast ? (
        <div className="toast-wrapper">
          <Toast msg={toast.msg} type={toast.type} />
        </div>
      ) : null}
    </BrowserRouter>
  )
}
