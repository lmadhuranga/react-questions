import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { useLoginMutation } from '../../services/authApi'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthenticated } from '../../features/auth/authSlice'
import { Navigate } from 'react-router-dom'
import type { RootState } from '../../store'

export function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [login, { isLoading, isError, error, data, isSuccess }] = useLoginMutation()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAuthenticated(true))
    }
  }, [dispatch, isSuccess])

  if (isAuthenticated) {
    return <Navigate to="/users" replace />
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await login(form)
  }

  return (
    <Layout>
      <p className="eyebrow">Auth</p>
      <h1>User authentication</h1>
      <p className="lead">Posts credentials to the Beeceptor endpoint.</p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-grid">
          <label className="field">
            <span>Username</span>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
      {isError && <p className="error">Login failed: {('status' in (error ?? {}) && error.status) || 'Error'}</p>}
      {isSuccess && <p className="success">Request sent successfully.</p>}
      {data ? <pre className="response">{JSON.stringify(data, null, 2)}</pre> : null}
    </Layout>
  )
}
