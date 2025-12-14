import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { configureStore } from '@reduxjs/toolkit'
import { todoApi } from './services/todoApi'
import { Provider } from 'react-redux'

const sampleTodos = [
  { id: 1, title: 'First todo', completed: false, userId: 1 },
  { id: 2, title: 'Second todo', completed: true, userId: 1 },
]

const renderWithProvider = () => {
  const testStore = configureStore({
    reducer: { [todoApi.reducerPath]: todoApi.reducer },
    middleware: (gDM) => gDM().concat(todoApi.middleware),
  })
  return render(
    <Provider store={testStore}>
      <App />
    </Provider>,
  )
}

describe('App', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(sampleTodos), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
    vi.stubGlobal('fetch', fetchMock)
  })

  it('renders todo titles from the query', async () => {
    renderWithProvider()
    expect(screen.getByText('Todos feed')).toBeInTheDocument()
    expect(screen.getByText(/Status:/)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('First todo')).toBeInTheDocument()
      expect(screen.getByText('Second todo')).toBeInTheDocument()
    })
  })

  it('calls the todos API and renders data', async () => {
    renderWithProvider()
    await waitFor(() => {
      expect(screen.getByText('First todo')).toBeInTheDocument()
    })
    expect(fetchMock).toHaveBeenCalled()
  })
})
