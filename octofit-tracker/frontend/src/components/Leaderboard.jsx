import { useEffect, useMemo, useState } from 'react'

function getApiBaseUrl() {
  const envCodespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const inferredCodespaceName =
    typeof window !== 'undefined'
      ? window.location.hostname.match(/^(.*)-\d+\.app\.github\.dev$/)?.[1] || ''
      : ''
  const codespaceName = envCodespaceName || inferredCodespaceName

  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api'
}

function normalizeItems(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.results)) {
    return payload.results
  }

  if (Array.isArray(payload?.items)) {
    return payload.items
  }

  return []
}

function getPaginationMeta(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null
  }

  const page = payload.page ?? payload.currentPage ?? payload.meta?.page ?? null
  const pageSize = payload.pageSize ?? payload.perPage ?? payload.limit ?? payload.meta?.pageSize ?? null
  const total = payload.total ?? payload.totalCount ?? payload.count ?? payload.meta?.total ?? null

  return page || pageSize || total ? { page, pageSize, total } : null
}

export default function Leaderboard() {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const endpoint = useMemo(() => `${getApiBaseUrl()}/leaderboard/`, [])

  useEffect(() => {
    let isMounted = true

    async function loadLeaderboard() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        if (isMounted) {
          setItems(normalizeItems(payload))
          setMeta(getPaginationMeta(payload))
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Failed to load leaderboard.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadLeaderboard()

    return () => {
      isMounted = false
    }
  }, [endpoint])

  return (
    <section>
      <h2 className="h4 mb-3">Leaderboard</h2>
      <p className="text-body-secondary small mb-3">Endpoint: {endpoint}</p>

      {loading && <div className="alert alert-info">Loading leaderboard...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          {meta && (
            <p className="small text-body-secondary">
              Page: {meta.page ?? 'n/a'} | Page size: {meta.pageSize ?? 'n/a'} | Total: {meta.total ?? 'n/a'}
            </p>
          )}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">User</th>
                  <th scope="col">Points</th>
                  <th scope="col">Team</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-body-secondary">
                      No leaderboard data found.
                    </td>
                  </tr>
                )}
                {items.map((entry, index) => (
                  <tr key={entry._id || entry.id || index}>
                    <td>{entry.rank ?? index + 1}</td>
                    <td>{entry.userName || entry.username || entry.userId || 'n/a'}</td>
                    <td>{entry.points ?? entry.score ?? 'n/a'}</td>
                    <td>{entry.teamName || entry.teamId || 'n/a'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}