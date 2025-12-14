import { configureStore } from '@reduxjs/toolkit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { postsApi, type Post } from './postsApi'

const samplePosts: Post[] = [
  { id: 1, userId: 1, title: 'First', body: 'Body 1' },
  { id: 2, userId: 1, title: 'Second', body: 'Body 2' },
]

const createStore = () =>
  configureStore({
    reducer: { [postsApi.reducerPath]: postsApi.reducer },
    middleware: (gDM) => gDM().concat(postsApi.middleware),
  })

describe('postsApi optimistic create', () => {
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
      new Response(JSON.stringify(samplePosts), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    // seed list
    const listPromise = store.dispatch(postsApi.endpoints.getPosts.initiate())
    await vi.advanceTimersByTimeAsync(2000)
    await listPromise

    const newPost = { title: 'New post', body: 'Body new', userId: 99 }
    const serverPost = { ...newPost, id: 101 }
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(serverPost), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const createPromise = store.dispatch(postsApi.endpoints.addPost.initiate(newPost))

    // optimistic item exists before server resolves
    const optimistic = postsApi.endpoints.getPosts.select()(store.getState()).data ?? []
    expect(optimistic.some((p) => p.title === newPost.title)).toBe(true)

    await vi.advanceTimersByTimeAsync(2000)
    await createPromise

    const final = postsApi.endpoints.getPosts.select()(store.getState()).data ?? []
    expect(final.some((p) => p.id === serverPost.id && p.title === serverPost.title)).toBe(true)
  })

  it('rolls back optimistic entry on failure', async () => {
    const store = createStore()
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(samplePosts), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    const listPromise = store.dispatch(postsApi.endpoints.getPosts.initiate())
    await vi.advanceTimersByTimeAsync(2000)
    await listPromise

    fetchMock.mockRejectedValueOnce(new Error('Network fail'))
    const newPost = { title: 'Fail post', body: 'Body fail', userId: 5 }
    const createPromise = store.dispatch(postsApi.endpoints.addPost.initiate(newPost))

    // optimistic exists
    expect(postsApi.endpoints.getPosts.select()(store.getState()).data?.some((p) => p.title === newPost.title)).toBe(
      true,
    )

    await vi.advanceTimersByTimeAsync(2000)
    await expect(createPromise.unwrap()).rejects.toThrow()

    const final = postsApi.endpoints.getPosts.select()(store.getState()).data ?? []
    expect(final.some((p) => p.title === newPost.title)).toBe(false)
  })
})
