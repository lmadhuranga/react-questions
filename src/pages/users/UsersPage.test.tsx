import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { UsersPage } from './UsersPage'
import { usersApi, type User } from '../../services/usersApi'

const sampleUsers: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
]

const renderWithStore = () => {
  const store = configureStore({
    reducer: { [usersApi.reducerPath]: usersApi.reducer },
    middleware: (gDM) => gDM().concat(usersApi.middleware),
  })
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/users']}>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('UsersPage', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it(
    'renders initial users after fetch',
    async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify(sampleUsers), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      renderWithStore()
      await new Promise((res) => setTimeout(res, 2200))
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument()
        expect(screen.getByText('Bob')).toBeInTheDocument()
      })
    },
    12000,
  )

  it(
    'optimistically shows new user on submit',
    async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify(sampleUsers), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    )
    const newUser = { id: 99, name: 'Charlie', email: 'charlie@example.com' }
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(newUser), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

      renderWithStore()
      await new Promise((res) => setTimeout(res, 2200))

      fireEvent.change(screen.getByLabelText('Name'), { target: { value: newUser.name } })
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: newUser.email } })
      fireEvent.click(screen.getByText('Add user'))

      // optimistic
      expect(screen.getByText(newUser.name)).toBeInTheDocument()

      await new Promise((res) => setTimeout(res, 2200))
      await waitFor(() => {
        expect(screen.getByText(newUser.email)).toBeInTheDocument()
      })
    },
    12000,
  )
})
