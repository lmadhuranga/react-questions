import { configureStore } from '@reduxjs/toolkit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usersApi, type User } from './usersApi'

const sampleUsers: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
]

const createStore = () =>
  configureStore({
    reducer: { [usersApi.reducerPath]: usersApi.reducer },
    middleware: (gDM) => gDM().concat(usersApi.middleware),
  })

describe('usersApi optimistic create', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.useFakeTimers()
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('optimistically adds and then replaces with server response', async () => {
    const store = createStore()
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(sampleUsers), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    const listPromise = store.dispatch(usersApi.endpoints.getUsers.initiate())
    await vi.advanceTimersByTimeAsync(2000)
    await listPromise

    const newUser = { name: 'Charlie', email: 'charlie@example.com' }
    const serverUser = { ...newUser, id: 99 }
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(serverUser), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const createPromise = store.dispatch(usersApi.endpoints.addUser.initiate(newUser))

    const optimistic = usersApi.endpoints.getUsers.select()(store.getState()).data ?? []
    expect(optimistic.some((u) => u.email === newUser.email)).toBe(true)

    await vi.advanceTimersByTimeAsync(2000)
    await createPromise

    const final = usersApi.endpoints.getUsers.select()(store.getState()).data ?? []
    expect(final.some((u) => u.id === serverUser.id && u.email === serverUser.email)).toBe(true)
  })

  it('rolls back optimistic entry on failure', async () => {
    const store = createStore()
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(sampleUsers), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    const listPromise = store.dispatch(usersApi.endpoints.getUsers.initiate())
    await vi.advanceTimersByTimeAsync(2000)
    await listPromise

    fetchMock.mockRejectedValueOnce(new Error('fail'))
    const newUser = { name: 'Dana', email: 'dana@example.com' }
    const createPromise = store.dispatch(usersApi.endpoints.addUser.initiate(newUser))

    expect(usersApi.endpoints.getUsers.select()(store.getState()).data?.some((u) => u.email === newUser.email)).toBe(
      true,
    )

    await vi.advanceTimersByTimeAsync(2000)
    await expect(createPromise.unwrap()).rejects.toThrow()

    const final = usersApi.endpoints.getUsers.select()(store.getState()).data ?? []
    expect(final.some((u) => u.email === newUser.email)).toBe(false)
  })
})
