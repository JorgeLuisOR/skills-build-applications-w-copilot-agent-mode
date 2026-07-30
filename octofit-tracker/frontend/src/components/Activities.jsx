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

export default function Activities() {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const endpoint = useMemo(() => {
    const codespaceName = getCodespaceName()
    return codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
      : 'http://localhost:8000/api/activities/'
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadActivities() {
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
          setError(requestError.message || 'Failed to load activities.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadActivities()

    return () => {
      isMounted = false
    }
  }, [endpoint])

  return (
    <section>
      <h2 className="h4 mb-3">Activities</h2>
      <p className="text-body-secondary small mb-3">Endpoint: {endpoint}</p>

      {loading && <div className="alert alert-info">Loading activities...</div>}
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
                  <th scope="col">User</th>
                  <th scope="col">Type</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Description</th>
                  <th scope="col">Schedule</th>
                  <th scope="col">Max Attendance</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-body-secondary">
                      No activities found.
                    </td>
                  </tr>
                )}
                {items.map((activity) => (
                  <tr key={activity._id || activity.id}>
                    <td>{activity._id || activity.id || 'n/a'}</td>
                    <td>
                      {activity.userId?.name || activity.userId?.username || activity.userId || 'n/a'}
                    </td>
                    <td>{activity.activityType || activity.type || 'n/a'}</td>
                    <td>{activity.durationMinutes ?? activity.duration ?? 'n/a'}</td>
                    <td>{activity.description || 'n/a'}</td>
                    <td>{activity.schedule || 'n/a'}</td>
                    <td>{activity.maxAttendance ?? 'n/a'}</td>
                    <td>{activity.date ? new Date(activity.date).toLocaleString() : 'n/a'}</td>
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