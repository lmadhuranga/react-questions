import './App.css'
import { useGetEmployeesQuery } from './services/employeeApi'

function App() {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetEmployeesQuery()
  const employees = data ?? []

  const renderError = () => {
    if (!error) return null
    if ('status' in error) {
      const status = typeof error.status === 'number' ? error.status : 'Network error'
      return `Request failed (status: ${status})`
    }
    return error.message ?? 'Something went wrong'
  }

  return (
    <main className="app">
      <section className="panel">
        <p className="eyebrow">RTK Query example</p>
        <h1>Employees feed</h1>
        <p className="lead">
          Data is loaded from <code>samples.json-format.com</code> using{' '}
          <code>createApi</code> and the generated <code>useGetEmployeesQuery</code> hook.
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

        <div className="employee-grid">
          {isLoading ? <p className="helper">Loading employees…</p> : null}
          {!isLoading && employees.length === 0 ? (
            <p className="helper">No employees returned.</p>
          ) : null}
          {employees.map((employee) => (
            <article className="employee-card" key={employee.id}>
              <div className="employee-meta">
                <span className="pill">{employee.id}</span>
                <span className="pill pill--subdued">{employee.departmentName}</span>
              </div>
              <h3>{employee.name}</h3>
              <p className="employee-role">{employee.position}</p>
              <p className="employee-manager">Manager: {employee.managerName}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
