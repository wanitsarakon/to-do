const icons = {
  success: (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
      <path
        d="M5 12.5L9.5 17L19 7.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  danger: (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
      <path
        d="M8 8L16 16M16 8L8 16"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
      <path
        d="M12 10V17M12 7H12.01"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

export default function Toast({ msg, type = 'info' }) {
  const tone = icons[type] ? type : 'info'

  return (
    <div className={`toast toast-${tone}`} role="status" aria-live="polite">
      <div className="toast-icon">{icons[tone]}</div>
      <span>{msg}</span>
    </div>
  )
}
