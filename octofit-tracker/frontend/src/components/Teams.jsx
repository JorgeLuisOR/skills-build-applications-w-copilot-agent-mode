import { useEffect, useMemo, useState } from 'react'

function getCodespaceName() {
  const envCodespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const inferredCodespaceName =
    typeof window !== 'undefined'
      ? window.location.hostname.match(/^(.*)-\d+\.app\.github\.dev$/)?.[1] || ''
      : ''
  return envCodespaceName || inferredCodespaceName
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

export default function Teams() {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const endpoint = useMemo(() => {
    const codespaceName = getCodespaceName()
    return codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
      : 'http://localhost:8000/api/teams/'
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadTeams() {
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
          setError(requestError.message || 'Failed to load teams.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTeams()

    return () => {
      isMounted = false
    }
  }, [endpoint])

  return (
    <section>
      <h2 className="h4 mb-3">Teams</h2>
      <p className="text-body-secondary small mb-3">Endpoint: {endpoint}</p>

      {loading && <div className="alert alert-info">Loading teams...</div>}
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
                  <th scope="col">ID</th>
                  <th scope="col">Team</th>
                  <th scope="col">Captain</th>
                  <th scope="col">Members</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-body-secondary">
                      No teams found.
                    </td>
                  </tr>
                )}
                {items.map((team) => (
                  <tr key={team._id || team.id}>
                    <td>{team._id || team.id || 'n/a'}</td>
                    <td>{team.name || team.teamName || 'n/a'}</td>
                    <td>{team.captain?.name || team.captain?.username || team.captain || 'n/a'}</td>
                    <td>{Array.isArray(team.members) ? team.members.length : 0}</td>
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