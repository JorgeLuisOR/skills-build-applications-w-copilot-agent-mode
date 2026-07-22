# Octofit Tracker Frontend

React 19 + Vite presentation tier for the Octofit Tracker application.

## Environment variable

Define `VITE_CODESPACE_NAME` in a local env file such as `.env.local`:

```env
VITE_CODESPACE_NAME=your-codespace-name
```

When set, the frontend calls API endpoints with this format:

```text
https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

Examples:

- `https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
- `https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
- `https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
- `https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
- `https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`

If `VITE_CODESPACE_NAME` is not set, the app safely falls back to relative routes (`/api/...`) to avoid invalid URLs like `https://undefined-8000...`.

## Run

```bash
npm install --prefix octofit-tracker/frontend
npm run dev --prefix octofit-tracker/frontend
```
