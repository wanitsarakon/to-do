import { useEffect, useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { parseDateKey } from '../utils/taskUtils'

const defaultPreferences = {
  dailyPlanning: true,
  weeklyReset: true,
  focusMode: false,
  sound: false,
}

export default function Profile({ tasks, profile, onProfileChange, dark, onToggleDark }) {
  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  const open = total - completed
  const streak = Math.min(7, completed)
  const preferences = { ...defaultPreferences, ...(profile.notifications ?? {}) }

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!saved) return

    const timer = window.setTimeout(() => setSaved(false), 2200)
    return () => window.clearTimeout(timer)
  }, [saved])

  const handleChange = (field, value) => {
    onProfileChange({ ...profile, [field]: value, notifications: preferences })
  }

  const handleToggle = (key) => {
    onProfileChange({
      ...profile,
      notifications: {
        ...preferences,
        [key]: !preferences[key],
      },
    })
  }

  const weeklyData = useMemo(() => {
    const week = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    const counts = week.map((day) => ({ name: day, completed: 0 }))

    tasks.forEach((task) => {
      if (!task.completed) return

      const due = parseDateKey(task.due)
      const index = due?.getDay()
      if (typeof index === 'number' && !Number.isNaN(index)) counts[index].completed += 1
    })

    return counts
  }, [tasks])

  return (
    <section className="page profile">
      <div className="topbar">
        <div>
          <h1>Profile and Preferences</h1>
          <p>Shape the way your planner feels every day.</p>
        </div>
      </div>

      <div className="profile-hero">
        <div className="profile-hero-left">
          <div className="profile-avatar">{profile.name.charAt(0).toUpperCase()}</div>
          <div>
            <h2>{profile.name}</h2>
            <p>{profile.title} - {profile.location}</p>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
        </div>
        <div className="profile-stats">
          <div>
            <strong>{open}</strong>
            <span>Open</span>
          </div>
          <div>
            <strong>{completed}</strong>
            <span>Done</span>
          </div>
          <div>
            <strong>{streak}</strong>
            <span>Momentum</span>
          </div>
        </div>
      </div>

      <div className="grid2 profile-grid">
        <div className="card">
          <div className="card-head">
            <span>About You</span>
          </div>
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input value={profile.name} onChange={(event) => handleChange('name', event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Role or Focus</label>
            <input value={profile.title} onChange={(event) => handleChange('title', event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input value={profile.email} onChange={(event) => handleChange('email', event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input value={profile.location} onChange={(event) => handleChange('location', event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Website or GitHub</label>
            <input value={profile.github} onChange={(event) => handleChange('github', event.target.value)} />
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
            onClick={() => setSaved(true)}
          >
            Save Preferences
          </button>
          {saved ? <p style={{ marginTop: 10, color: 'var(--green)' }}>Saved locally on this device.</p> : null}
        </div>

        <div className="card">
          <div className="card-head">
            <span>Personal Rhythm</span>
          </div>
          <div className="tgl-row">
            <div className="tgl-info">
              <p>Dark Mode</p>
              <span>Use a lower-contrast workspace at night</span>
            </div>
            <button className={`tgl ${dark ? 'on' : ''}`} onClick={onToggleDark} type="button" />
          </div>
          <div className="tgl-row">
            <div className="tgl-info">
              <p>Daily Planning Prompt</p>
              <span>Start the day by choosing your top priorities</span>
            </div>
            <button
              className={`tgl ${preferences.dailyPlanning ? 'on' : ''}`}
              onClick={() => handleToggle('dailyPlanning')}
              type="button"
            />
          </div>
          <div className="tgl-row">
            <div className="tgl-info">
              <p>Weekly Reset</p>
              <span>Keep time each week to clear and review tasks</span>
            </div>
            <button
              className={`tgl ${preferences.weeklyReset ? 'on' : ''}`}
              onClick={() => handleToggle('weeklyReset')}
              type="button"
            />
          </div>
          <div className="tgl-row">
            <div className="tgl-info">
              <p>Focus Mode</p>
              <span>Reduce visual clutter while you work through tasks</span>
            </div>
            <button
              className={`tgl ${preferences.focusMode ? 'on' : ''}`}
              onClick={() => handleToggle('focusMode')}
              type="button"
            />
          </div>
          <div className="tgl-row">
            <div className="tgl-info">
              <p>Completion Sounds</p>
              <span>Add a tiny reward when you finish something</span>
            </div>
            <button className={`tgl ${preferences.sound ? 'on' : ''}`} onClick={() => handleToggle('sound')} type="button" />
          </div>
        </div>
      </div>

      <div className="card completion-card">
        <div className="card-head">
          <span>Completion Trend</span>
        </div>
        <div className="chart-card">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 92, 106, 0.2)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text3)' }} />
              <YAxis tick={{ fill: 'var(--text3)' }} />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#253745" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
