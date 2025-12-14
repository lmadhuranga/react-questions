import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import { useGetUserQuery, useUpdateUserMutation } from '../../services/usersApi'

type FormState = { name: string; email: string }

type UserFormProps = {
  initial: FormState
  isSaving: boolean
  onSubmit: (state: FormState) => Promise<void>
  cancelHref: string
}

function UserForm({ initial, isSaving, onSubmit, cancelHref }: UserFormProps) {
  const [form, setForm] = useState<FormState>(initial)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await onSubmit(form)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save'}
        </button>
        <Link className="secondary" to={cancelHref}>
          Cancel
        </Link>
      </div>
    </form>
  )
}

export function UserEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const userId = Number(id)
  const { data, isLoading } = useGetUserQuery(userId, { skip: Number.isNaN(userId) })
  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation()

  const handleSubmit = async (state: FormState) => {
    if (Number.isNaN(userId)) return
    await updateUser({ id: userId, ...state })
    navigate(`/users/${userId}`)
  }

  return (
    <Layout>
      <p className="eyebrow">Users</p>
      <h1>Edit user</h1>
      {isLoading && <p className="helper">Loading user…</p>}
      {data ? (
        <UserForm
          key={data.id}
          initial={{ name: data.name, email: data.email }}
          isSaving={isSaving}
          onSubmit={handleSubmit}
          cancelHref={`/users/${userId}`}
        />
      ) : null}
    </Layout>
  )
}
