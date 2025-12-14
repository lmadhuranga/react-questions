import { useEffect, useRef, useState } from 'react'
import {
  decrement,
  fetchCountAsync,
  increment,
  incrementByAmount,
  reset,
} from './features/counter/counterSlice'
import {
  clearEmployees,
  fetchEmployeesAsync,
  selectEmployee,
} from './features/employees/employeesSlice'
import { useAppDispatch, useAppSelector } from './hooks'
import './App.css'

function App() {
  const [amount, setAmount] = useState('5')
  const { value: count, status, error } = useAppSelector((state) => state.counter)
  const {
    items: employees,
    status: employeeStatus,
    error: employeeError,
    selectedId,
  } = useAppSelector((state) => state.employees)
  const dispatch = useAppDispatch()
  const hasFetchedEmployees = useRef(false)

  const parsedAmount = Number(amount) || 0
  const isLoading = status === 'loading'
  const isEmployeeLoading = employeeStatus === 'loading'
  const selectedEmployee = employees.find((employee) => employee.id === selectedId)

  useEffect(() => {
    if (!hasFetchedEmployees.current && employeeStatus === 'idle') {
      dispatch(fetchEmployeesAsync())
      hasFetchedEmployees.current = true
    }
  }, [dispatch, employeeStatus])

  return (
    <main className="app">
      <section className="panel">
        <p className="eyebrow">Redux Toolkit starter</p>
        <h1>Counter slice demo</h1>
        <p className="lead">
          Simple counter wired with <code>@reduxjs/toolkit</code> and the React-Redux provider.
        </p>

        <div className="counter">
          <div className="value">Count: {count}</div>
          <div className="controls">
            <button type="button" onClick={() => dispatch(decrement())} disabled={isLoading}>
              -1
            </button>
            <button type="button" onClick={() => dispatch(increment())} disabled={isLoading}>
              +1
            </button>
            <button type="button" onClick={() => dispatch(reset())} disabled={isLoading}>
              Reset
            </button>
          </div>
        </div>

        <div className="custom-increment">
          <label htmlFor="amount">Increment by</label>
          <div className="stack">
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <button
              type="button"
              onClick={() => dispatch(incrementByAmount(parsedAmount))}
              disabled={!amount || isLoading}
            >
              Add {parsedAmount || 0}
            </button>
          </div>
          <div className="stack">
            <button
              type="button"
              className="secondary"
              onClick={() => dispatch(fetchCountAsync(parsedAmount))}
              disabled={isLoading || !amount}
            >
              {isLoading ? 'Calling API…' : `Add ${parsedAmount || 0} (via API)`}
            </button>
            <p className="status">
              Status: <strong>{status}</strong>
            </p>
          </div>
          {error ? <p className="error">Error: {error}</p> : null}
          <p className="helper">
            API call simulates a network request, updating the counter when the promise resolves.
          </p>
        </div>

        <div className="employees">
          <header className="employees__header">
            <div>
              <p className="eyebrow">Remote data</p>
              <h2>Employees ({employees.length})</h2>
            </div>
            <div className="actions">
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  hasFetchedEmployees.current = false
                  dispatch(clearEmployees())
                }}
                disabled={isEmployeeLoading}
              >
                Clear list
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => dispatch(fetchEmployeesAsync())}
                disabled={isEmployeeLoading}
              >
                {isEmployeeLoading ? 'Fetching...' : 'Refetch'}
              </button>
            </div>
          </header>

          {employeeStatus === 'failed' ? (
            <p className="error">Failed to load employees: {employeeError}</p>
          ) : null}

          <div className="employee-list">
            {employeeStatus === 'loading' && <p className="helper">Loading employees…</p>}
            {employeeStatus === 'succeeded' &&
              employees.map((employee) => (
                <article
                  className={`employee-card ${
                    selectedId === employee.id ? 'employee-card--selected' : ''
                  }`}
                  key={employee.id}
                  onClick={() =>
                    dispatch(selectEmployee(selectedId === employee.id ? null : employee.id))
                  }
                  role="button"
                >
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

          {selectedEmployee ? (
            <p className="helper">
              Selected: <strong>{selectedEmployee.name}</strong> ({selectedEmployee.position})
            </p>
          ) : (
            <p className="helper">Click an employee card to select/deselect.</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
