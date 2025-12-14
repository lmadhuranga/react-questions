import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import { useAddUserMutation, useDeleteUserMutation, useGetUsersQuery } from '../../services/usersApi'

export function UsersPage() {
  const { data, isLoading, error } = useGetUsersQuery()
  const [addUser, { isLoading: isAdding }] = useAddUserMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
  const [form, setForm] = useState({ name: '', email: '' })

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await addUser(form)
    setForm({ name: '', email: '' })
  }

  return (
    <Layout>
      <header className="page-header">
        <div>
          <p className="eyebrow">Users</p>
          <h1>User directory</h1>
        </div>
      </header>

      <form className="form" onSubmit={onSubmit}>
        <div className="form-grid">
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isAdding}>
            {isAdding ? 'Adding…' : 'Add user'}
          </button>
        </div>
      </form>

      {isLoading && <p className="helper">Loading users…</p>}
      {error && <p className="error">Failed to load users</p>}

      <div className="grid">
        {data?.slice(0, 12).map((user) => (
          <article className="card" key={user.id}>
            <div className="meta">
              <span className="pill">#{user.id}</span>
              <span className="pill pill--subdued">{user.email}</span>
            </div>
            <h3>{user.name}</h3>
            <div className="card-actions">
              <Link className="secondary" to={`/users/${user.id}`}>
                Details
              </Link>
              <Link className="secondary" to={`/users/edit/${user.id}`}>
                Edit
              </Link>
              <button
                type="button"
                className="secondary danger"
                onClick={() => deleteUser(user.id)}
                disabled={isDeleting}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </Layout>
  )
}
