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

export default function Users() {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const endpoint = useMemo(() => {
    const codespaceName = getCodespaceName()
    return codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api/users/`
      : 'http://localhost:8000/api/users/'
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadUsers() {
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
          setError(requestError.message || 'Failed to load users.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [endpoint])

  return (
    <section>
      <h2 className="h4 mb-3">Users</h2>
      <p className="text-body-secondary small mb-3">Endpoint: {endpoint}</p>

      {loading && <div className="alert alert-info">Loading users...</div>}
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
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Level</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-body-secondary">
                      No users found.
                    </td>
                  </tr>
                )}
                {items.map((user) => (
                  <tr key={user._id || user.id}>
                    <td>{user._id || user.id || 'n/a'}</td>
                    <td>{user.username || user.name || 'n/a'}</td>
                    <td>{user.email || 'n/a'}</td>
                    <td>{user.level || user.fitnessLevel || 'n/a'}</td>
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