export const CATEGORY_LABELS = {
  work: 'Work',
  personal: 'Life',
  study: 'Learning',
  health: 'Wellness',
}

export const PRIORITY_LABELS = {
  high: 'High',
  med: 'Medium',
  low: 'Low',
}

export function getTodayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function shiftDateKey(days, baseDate = new Date()) {
  const nextDate = new Date(baseDate)
  nextDate.setDate(nextDate.getDate() + days)
  return getTodayKey(nextDate)
}

export function parseDateKey(dateKey) {
  if (!dateKey) return null

  const [year, month, day] = dateKey.split('-').map(Number)
  if (!year || !month || !day) return null

  return new Date(year, month - 1, day)
}

export function formatTaskDate(dateKey, options = { month: 'short', day: 'numeric' }) {
  const parsed = parseDateKey(dateKey)
  if (!parsed) return 'No date'
  return parsed.toLocaleDateString(undefined, options)
}
