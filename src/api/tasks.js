import { getTodayKey, shiftDateKey } from '../utils/taskUtils'

const STORAGE_KEY = 'taskflow-dashboard-tasks'

function buildSampleTasks() {
  return [
    {
      id: 1,
      name: 'Choose the top 3 priorities for today',
      notes: 'Keep the list realistic so the day stays calm.',
      cat: 'work',
      priority: 'high',
      due: getTodayKey(),
      completed: false,
    },
    {
      id: 2,
      name: 'Clear the most important email replies',
      notes: 'Aim for 20 focused minutes, not inbox zero.',
      cat: 'work',
      priority: 'med',
      due: shiftDateKey(1),
      completed: false,
    },
    {
      id: 3,
      name: 'Pay the electricity bill',
      notes: 'Finish it before dinner so it stops taking mental space.',
      cat: 'personal',
      priority: 'high',
      due: shiftDateKey(-1),
      completed: false,
    },
    {
      id: 4,
      name: 'Finish one lesson from the React course',
      notes: 'Stop after one lesson and capture key notes.',
      cat: 'study',
      priority: 'med',
      due: shiftDateKey(2),
      completed: false,
    },
    {
      id: 5,
      name: 'Take a 30-minute walk',
      notes: 'Use it as a reset after work.',
      cat: 'health',
      priority: 'low',
      due: getTodayKey(),
      completed: true,
    },
    {
      id: 6,
      name: 'Plan groceries for the weekend',
      notes: 'Check what is already in the fridge first.',
      cat: 'personal',
      priority: 'low',
      due: shiftDateKey(3),
      completed: false,
    },
    {
      id: 7,
      name: 'Write down today’s small wins',
      notes: 'A short reflection helps close the loop.',
      cat: 'personal',
      priority: 'low',
      due: shiftDateKey(-2),
      completed: true,
    },
  ]
}

function normalizeTask(task, index) {
  return {
    id: task.id ?? Date.now() + index,
    name: task.name ?? 'Untitled task',
    notes: task.notes ?? '',
    cat: task.cat ?? 'personal',
    priority: task.priority ?? 'med',
    due: task.due ?? getTodayKey(),
    completed: Boolean(task.completed),
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchTasks() {
  await wait(400)

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    const data = saved ? JSON.parse(saved) : buildSampleTasks()
    return Array.isArray(data) ? data.map(normalizeTask) : buildSampleTasks()
  } catch (error) {
    console.error(error)
    return buildSampleTasks()
  }
}

export async function saveTasks(tasks) {
  await wait(200)

  try {
    const normalized = tasks.map(normalizeTask)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    return normalized
  } catch (error) {
    console.error(error)
    return tasks
  }
}
