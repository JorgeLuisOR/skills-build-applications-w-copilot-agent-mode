import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'

function App() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const apiRoot = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : '/api'

  return (
    <div className="app-shell container py-4">
      <header className="mb-4">
        <h1 className="display-6 mb-2">Octofit Tracker</h1>
        <p className="text-secondary mb-3">
          React 19 presentation tier connected to the Express API.
        </p>
        <p className="small mb-2">
          API root: <code>{apiRoot}</code>
        </p>
        {!codespaceName && (
          <div className="alert alert-warning py-2 mb-3" role="alert">
            <strong>VITE_CODESPACE_NAME is not set.</strong> Using relative API
            routes as a safe fallback.
          </div>
        )}

        <nav className="nav nav-pills gap-2 flex-wrap">
          <NavLink className="nav-link" to="/users">
            Users
          </NavLink>
          <NavLink className="nav-link" to="/teams">
            Teams
          </NavLink>
          <NavLink className="nav-link" to="/activities">
            Activities
          </NavLink>
          <NavLink className="nav-link" to="/workouts">
            Workouts
          </NavLink>
          <NavLink className="nav-link" to="/leaderboard">
            Leaderboard
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="*"
            element={
              <div className="alert alert-info" role="alert">
                Page not found. Use the navigation above.
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
