import { useEffect, useMemo, useState } from 'react'

const RESOURCE = 'leaderboard'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'score', label: 'Score' },
  { key: 'streak', label: 'Streak' },
  { key: 'userId', label: 'User Id' },
]

function getApiRoot() {
  const configuredCodespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  if (configuredCodespaceName) {
    return `https://${configuredCodespaceName}-8000.app.github.dev/api`
  }

  const hostMatch = window.location.hostname.match(/^(.+)-\d+\.app\.github\.dev$/i)
  if (hostMatch) {
    return `https://${hostMatch[1]}-8000.app.github.dev/api`
  }

  return '/api'
}

function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  if (Array.isArray(payload.results)) return payload.results
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.items)) return payload.items

  const firstArrayValue = Object.values(payload).find(Array.isArray)
  return firstArrayValue ?? []
}

function formatValue(value) {
  if (value == null || value === '') return '-'
  if (Array.isArray(value)) return value.map(formatValue).join(', ')
  if (typeof value === 'object') {
    if (value.name) return value.name
    if (value.title) return value.title
    if (value.email) return value.email
    if (value._id) return value._id
    return JSON.stringify(value)
  }
  return String(value)
}

function Leaderboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [meta, setMeta] = useState(null)

  const endpoint = useMemo(() => `${getApiRoot()}/${RESOURCE}/`, [])

  useEffect(() => {
    let cancelled = false

    async function loadLeaderboard() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        if (cancelled) return

        const collection = normalizeCollection(payload)
        setItems(collection)

        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
          setMeta({
            count: payload.count ?? payload.total ?? collection.length,
            next: payload.next ?? null,
            previous: payload.previous ?? null,
          })
        } else {
          setMeta(null)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
          setItems([])
          setMeta(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadLeaderboard()

    return () => {
      cancelled = true
    }
  }, [endpoint])

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-3">Leaderboard</h2>
        <p className="small text-secondary mb-3">Endpoint: {endpoint}</p>

        {loading && <div className="alert alert-light mb-0">Loading leaderboard...</div>}

        {!loading && error && (
          <div className="alert alert-danger mb-0" role="alert">
            Failed to load leaderboard: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {meta && (
              <p className="small text-secondary">
                Count: {meta.count}
                {meta.next ? ' | Has next page' : ''}
                {meta.previous ? ' | Has previous page' : ''}
              </p>
            )}

            {items.length === 0 ? (
              <div className="alert alert-info mb-0">No leaderboard entries found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle mb-0">
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column.key} scope="col">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const rowKey = item._id ?? item.id ?? `${item.name}-${item.score}`
                      return (
                        <tr key={rowKey}>
                          {columns.map((column) => (
                            <td key={column.key}>{formatValue(item[column.key])}</td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Leaderboard
