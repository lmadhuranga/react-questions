import './App.css'
import { useState, type FormEvent } from 'react'
import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useGetTodosQuery,
  useUpdateTodoMutation,
} from './services/todoApi'

function App() {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetTodosQuery()
  const [createTodo, { isLoading: isSubmitting, isError: submitError, error: submitErr }] =
    useCreateTodoMutation()
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation()
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation()
  const [form, setForm] = useState({
    title: '',
    completed: false,
  })
  const [submitted, setSubmitted] = useState<string | null>(null)
  const todos = data ?? []

  const renderError = () => {
    if (!error) return null
    if ('status' in error) {
      const status = typeof error.status === 'number' ? error.status : 'Network error'
      return `Request failed (status: ${status})`
    }
    return error.message ?? 'Something went wrong'
  }

  const renderSubmitError = () => {
    if (!submitErr) return null
    if ('status' in submitErr) {
      const status = typeof submitErr.status === 'number' ? submitErr.status : 'Network error'
      return `Submit failed (status: ${status})`
    }
    return submitErr.message ?? 'Submit failed'
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(null)
    const result = await createTodo(form)
    if ('data' in result) {
      setSubmitted(`Submitted "${form.title}"`)
      setForm({ title: '', completed: false })
      refetch()
    }
  }

  const onToggleCompleted = (id: number, completed: boolean) => {
    updateTodo({ id, completed: !completed })
  }

  const onDelete = (id: number) => {
    deleteTodo(id)
  }

  const onEditTitle = (id: number, current: string) => {
    const nextTitle = window.prompt('Update title', current)
    if (nextTitle && nextTitle.trim()) {
      updateTodo({ id, title: nextTitle.trim() })
    }
  }

  return (
    <main className="app">
      <section className="panel">
        <p className="eyebrow">RTK Query example</p>
        <h1>Todos feed</h1>
        <p className="lead">
          Data is loaded from <code>https://jsonplaceholder.typicode.com/todos</code> using{' '}
          <code>createApi</code> and the generated <code>useGetTodosQuery</code> hook.
        </p>

        <div className="toolbar">
          <span className="status">
            Status:{' '}
            <strong>
              {isLoading ? 'loading' : isFetching ? 'refreshing' : isError ? 'error' : 'idle'}
            </strong>
          </span>
          <button type="button" onClick={() => refetch()} disabled={isFetching || isLoading}>
            {isFetching || isLoading ? 'Fetching…' : 'Refetch'}
          </button>
        </div>

        {isError ? <p className="error">{renderError()}</p> : null}

        <form className="form" onSubmit={onSubmit}>
          <div className="form-grid">
            <label className="field">
              <span>Title</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={form.completed}
                onChange={(e) => setForm({ ...form, completed: e.target.checked })}
              />
              <span>Completed</span>
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit (POST)'}
            </button>
            {submitError ? <p className="error">{renderSubmitError()}</p> : null}
            {submitted ? <p className="success">{submitted}</p> : null}
          </div>
        </form>

        <div className="employee-grid">
          {isLoading ? <p className="helper">Loading todos…</p> : null}
          {!isLoading && todos.length === 0 ? <p className="helper">No todos returned.</p> : null}
          {todos.map((todo) => (
            <article className="employee-card" key={todo.id}>
              <div className="employee-meta">
                <span className="pill">#{todo.id}</span>
                <span className="pill pill--subdued">User {todo.userId}</span>
                <span className={`pill ${todo.completed ? '' : 'pill--subdued'}`}>
                  {todo.completed ? 'Done' : 'Open'}
                </span>
              </div>
              <h3>{todo.title}</h3>
              <div className="card-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => onToggleCompleted(todo.id, todo.completed)}
                  disabled={isUpdating}
                >
                  Toggle complete
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => onEditTitle(todo.id, todo.title)}
                  disabled={isUpdating}
                >
                  Edit title
                </button>
                <button
                  type="button"
                  className="secondary danger"
                  onClick={() => onDelete(todo.id)}
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
