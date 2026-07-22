# Octofit Tracker Frontend

## Environment variables

Define `VITE_CODESPACE_NAME` in your local environment file.

Example `.env.local`:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

The React app uses Vite environment variables via `import.meta.env` and builds API endpoints as:

```text
https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

When `VITE_CODESPACE_NAME` is not defined, the app safely falls back to:

```text
http://localhost:8000/api/[component]/
```

This prevents invalid URLs such as `https://undefined-8000.app.github.dev/...`.

## Run locally

```bash
npm install
npm run dev 
```
