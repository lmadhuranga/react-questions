import { Link, useParams } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import { useGetUserQuery } from '../../services/usersApi'

export function UserDetailPage() {
  const { id } = useParams()
  const userId = Number(id)
  const { data, isLoading, error } = useGetUserQuery(userId, { skip: Number.isNaN(userId) })

  return (
    <Layout>
      <p className="eyebrow">Users</p>
      <h1>User details</h1>
      {isLoading && <p className="helper">Loading user…</p>}
      {error && <p className="error">Failed to load user</p>}
      {data && (
        <article className="card">
          <div className="meta">
            <span className="pill">#{data.id}</span>
          </div>
          <h3>{data.name}</h3>
          <p className="helper">{data.email}</p>
          <div className="card-actions">
            <Link className="secondary" to={`/users/edit/${data.id}`}>
              Edit
            </Link>
            <Link className="secondary" to="/users">
              Back to list
            </Link>
          </div>
        </article>
      )}
    </Layout>
  )
}
