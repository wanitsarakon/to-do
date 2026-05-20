import { NavLink } from 'react-router-dom'

export default function Sidebar({
  dark,
  setDark,
  pendingCount,
  profile = { name: 'Ploy', title: 'Frontend Developer' },
}) {
  const links = [
    { to: '/', label: 'Dashboard', icon: <IconGrid /> },
    { to: '/tasks', label: 'Planner', icon: <IconTasks />, chip: pendingCount },
    { to: '/profile', label: 'Preferences', icon: <IconUser /> },
  ]

  return (
    <aside
      className="sidebar-shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '24px 20px 20px',
          borderBottom: '1px solid var(--shell-active-border)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, rgba(244,246,244,.94), rgba(155,168,171,.72))',
            borderRadius: 12,
            display: 'grid',
            placeItems: 'center',
            color: 'var(--blue2)',
            fontSize: 16,
            fontWeight: 700,
            fontFamily: 'var(--font-head)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.22)',
          }}
        >
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 17, fontWeight: 700, color: 'var(--shell-text)' }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--shell-muted)' }}>{profile.title}</div>
        </div>
      </div>

      <div style={{ padding: '16px 12px', flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '1.2px',
            color: 'var(--shell-muted)',
            textTransform: 'uppercase',
            padding: '0 8px',
            marginBottom: 8,
          }}
        >
          Home Base
        </div>
        {links.map(({ to, label, icon, chip }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: '18px',
              cursor: 'pointer',
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: 'none',
              color: isActive ? 'var(--shell-text)' : 'var(--shell-muted)',
              background: isActive ? 'var(--shell-active-bg)' : 'transparent',
              border: isActive ? '1px solid var(--shell-active-border)' : '1px solid transparent',
              marginBottom: 2,
              position: 'relative',
              transition: 'all var(--anim)',
              backdropFilter: isActive ? 'blur(16px)' : 'none',
            })}
          >
            {icon}
            {label}
            {chip > 0 ? (
              <span
                style={{
                  marginLeft: 'auto',
                  background: 'var(--shell-chip-bg)',
                  color: 'var(--shell-chip-text)',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 99,
                  fontFamily: 'var(--mono)',
                  border: '1px solid var(--shell-active-border)',
                }}
              >
                {chip}
              </span>
            ) : null}
          </NavLink>
        ))}
      </div>

      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--shell-active-border)' }}>
        <button
          type="button"
          onClick={() => setDark((value) => !value)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: '18px',
            border: '1px solid var(--shell-toggle-border)',
            background: 'var(--shell-toggle-bg)',
            color: 'var(--shell-text)',
            cursor: 'pointer',
            fontSize: 13.5,
            fontWeight: 600,
            marginBottom: 12,
            backdropFilter: 'blur(16px)',
          }}
        >
          <span>{dark ? 'Light mode' : 'Dark mode'}</span>
          <span
            style={{
              width: 26,
              height: 14,
              borderRadius: 99,
              background: dark ? 'var(--shell-toggle-track-on)' : 'var(--shell-toggle-track)',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 1,
                left: dark ? '14px' : '2px',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: dark ? 'var(--shell-toggle-thumb-on)' : 'var(--shell-toggle-thumb)',
                transition: 'left .2s ease',
              }}
            />
          </span>
        </button>
        <NavLink
          to="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: '18px',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'background var(--anim)',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = 'var(--shell-active-bg)'
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = 'transparent'
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(244,246,244,.92), rgba(155,168,171,.5))',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--blue2)',
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--shell-text)' }}>{profile.name}</p>
            <span style={{ fontSize: 11, color: 'var(--shell-muted)' }}>{profile.title}</span>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}

function IconGrid() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function IconTasks() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}
