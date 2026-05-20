import { useEffect, useId, useRef, useState } from 'react'
import { getTodayKey } from '../utils/taskUtils'

const categoryOptions = [
  {
    value: 'work',
    label: 'Work',
    note: 'Deep work and responsibilities',
    tone: 'work',
    icon: <IconBriefcase />,
  },
  {
    value: 'personal',
    label: 'Life',
    note: 'Home, errands, and personal tasks',
    tone: 'personal',
    icon: <IconSpark />,
  },
  {
    value: 'study',
    label: 'Learning',
    note: 'Study, reading, and practice',
    tone: 'study',
    icon: <IconBook />,
  },
  {
    value: 'health',
    label: 'Wellness',
    note: 'Health, movement, and recovery',
    tone: 'health',
    icon: <IconLeaf />,
  },
]

const priorityOptions = [
  {
    value: 'high',
    label: 'High',
    note: 'Needs attention soon',
    tone: 'high',
    icon: <PriorityGlyph type="high" />,
  },
  {
    value: 'med',
    label: 'Medium',
    note: 'Important and manageable',
    tone: 'med',
    icon: <PriorityGlyph type="med" />,
  },
  {
    value: 'low',
    label: 'Low',
    note: 'Can wait a little',
    tone: 'low',
    icon: <PriorityGlyph type="low" />,
  },
]

function createTaskForm(task) {
  if (!task) {
    return {
      name: '',
      notes: '',
      cat: 'personal',
      priority: 'med',
      due: getTodayKey(),
    }
  }

  return {
    name: task.name ?? '',
    notes: task.notes ?? '',
    cat: task.cat ?? 'personal',
    priority: task.priority ?? 'med',
    due: task.due ?? getTodayKey(),
  }
}

function FancySelect({ label, value, options, open, onToggle, onClose, onChange }) {
  const rootRef = useRef(null)
  const listId = useId()
  const selected = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) onClose()
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return (
    <div className="glass-select" ref={rootRef}>
      <label className="form-label">{label}</label>
      <button
        type="button"
        className={`glass-select-trigger ${open ? 'is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={onToggle}
      >
        <span className="glass-select-leading">
          <span className={`glass-select-icon ${selected.tone}`}>{selected.icon}</span>
          <span className="glass-select-text">
            <span className="glass-select-value">{selected.label}</span>
            <span className="glass-select-note">{selected.note}</span>
          </span>
        </span>
        <SelectCaret open={open} />
      </button>

      {open ? (
        <div className="glass-select-menu" id={listId} role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`glass-select-option ${option.value === value ? 'is-selected' : ''}`}
              onClick={() => {
                onChange(option.value)
                onClose()
              }}
            >
              <span className={`glass-select-icon ${option.tone}`}>{option.icon}</span>
              <span className="glass-select-text">
                <span className="glass-select-value">{option.label}</span>
                <span className="glass-select-note">{option.note}</span>
              </span>
              <span className={`glass-select-check ${option.value === value ? 'is-visible' : ''}`}>
                <IconCheck />
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default function TaskModal({ open, onClose, onSubmit, editTask }) {
  const [form, setForm] = useState(() => createTaskForm(editTask))
  const [activeSelect, setActiveSelect] = useState(null)

  if (!open) return null

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const closeMenus = () => setActiveSelect(null)

  const handleSubmit = () => {
    if (!form.name.trim()) return

    onSubmit({
      ...form,
      name: form.name.trim(),
      notes: form.notes.trim(),
    })
    closeMenus()
    onClose()
  }

  return (
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(6,20,27,.42)',
        backdropFilter: 'blur(12px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'var(--surface-strong)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px 32px',
          width: 520,
          maxWidth: '92vw',
          border: '1px solid rgba(255,255,255,.34)',
          boxShadow: 'var(--shadow-md)',
          backdropFilter: 'blur(22px)',
          animation: 'modalIn .18s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <style>{'@keyframes modalIn{from{transform:translateY(16px) scale(.96);opacity:0}to{transform:none;opacity:1}}'}</style>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
          {editTask ? 'Refine Your Task' : 'Capture a Task'}
        </h2>
        <p style={{ color: 'var(--text3)', marginBottom: 20 }}>
          Keep it simple so your plan stays easy to follow.
        </p>

        <div className="form-group">
          <label className="form-label">Task Name *</label>
          <input
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
            placeholder="What would make today feel lighter?"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            value={form.notes}
            onChange={(event) => setField('notes', event.target.value)}
            rows={2}
            placeholder="Add any details that help you get started..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <FancySelect
            label="Category"
            value={form.cat}
            options={categoryOptions}
            open={activeSelect === 'category'}
            onToggle={() => setActiveSelect((current) => (current === 'category' ? null : 'category'))}
            onClose={closeMenus}
            onChange={(value) => setField('cat', value)}
          />
          <FancySelect
            label="Priority"
            value={form.priority}
            options={priorityOptions}
            open={activeSelect === 'priority'}
            onToggle={() => setActiveSelect((current) => (current === 'priority' ? null : 'priority'))}
            onClose={closeMenus}
            onChange={(value) => setField('priority', value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input type="date" value={form.due} onChange={(event) => setField('due', event.target.value)} />
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'flex-end',
            marginTop: 20,
            paddingTop: 18,
            borderTop: '1px solid var(--border)',
          }}
        >
          <button
            className="btn btn-ghost"
            onClick={() => {
              closeMenus()
              onClose()
            }}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {editTask ? 'Save Changes' : 'Save Task'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SelectCaret({ open }) {
  return (
    <svg
      className={`glass-select-caret ${open ? 'is-open' : ''}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5L9.5 17L19 7.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconBriefcase() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 7V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M4 10h16M6 7h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconSpark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconBook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 5.5A2.5 2.5 0 0 1 8.5 3H19v15h-9.5A2.5 2.5 0 0 0 7 20.5M6 5.5V19A2 2 0 0 0 8 21h11M6 5.5A2.5 2.5 0 0 0 3.5 8V19A2 2 0 0 0 5.5 21H8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLeaf() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19 5C12.5 5 8 8.9 8 14c0 3 1.8 5 4.5 5C17.2 19 20 14.7 20 9V5h-1ZM5 19c1.7-3.7 4.7-6.7 8.5-8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PriorityGlyph({ type }) {
  if (type === 'high') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 6L17 13H7L12 6Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (type === 'low') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 12H17M9 16H15"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 12H17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}
