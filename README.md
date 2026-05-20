# TaskFlow

TaskFlow is a personal productivity dashboard built with React and Vite. It is designed for one person managing daily priorities, upcoming tasks, and personal routines from a calm single-device workspace.

## What it does

- Capture tasks quickly with category, priority, due date, and notes
- Highlight what is due today, upcoming, or overdue
- Track completion progress from a dashboard view
- Keep profile preferences and tasks saved locally in the browser
- Support drag-and-drop reordering in the planner

## Product direction

This version is intentionally a personal productivity app, not a team workspace.

- No login
- No shared boards
- No multi-user task assignment
- No backend required

The app currently stores data in `localStorage`, which makes it a good fit for portfolio work, demos, prototypes, or a lightweight personal planner.

## Screens

- `Dashboard`: daily focus, calendar, progress, and gentle nudges
- `Planner`: full task list with filters and sorting
- `Preferences`: profile details and personal rhythm toggles

## Tech stack

- React
- Vite
- React Router
- Recharts
- CSS with shared theme variables

## Run locally

```bash
npm install
npm run dev
```

## Build and lint

```bash
npm run lint
npm run build
```

## Future ideas

- Add a dedicated `Today` view
- Add recurring tasks and habits
- Add optional cloud sync for multi-device use
- Add authentication only if the product grows beyond single-user local storage
