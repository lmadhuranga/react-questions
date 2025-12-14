import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { PostsPage } from './PostsPage'
import { postsApi, type Post } from '../../services/postsApi'

const samplePosts: Post[] = [
  { id: 1, userId: 1, title: 'First', body: 'Body 1' },
  { id: 2, userId: 1, title: 'Second', body: 'Body 2' },
]

const renderWithStore = () => {
  const store = configureStore({
    reducer: { [postsApi.reducerPath]: postsApi.reducer },
    middleware: (gDM) => gDM().concat(postsApi.middleware),
  })
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/posts']}>
        <Routes>
          <Route path="/posts" element={<PostsPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('PostsPage', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it(
    'renders initial posts',
    async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify(samplePosts), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
      }),
    )

    renderWithStore()
      await act(async () => {
        await new Promise((res) => setTimeout(res, 2200))
      })
      await waitFor(() => {
        expect(screen.getByText('First')).toBeInTheDocument()
        expect(screen.getByText('Second')).toBeInTheDocument()
      })
    },
    12000,
  )

  it(
    'optimistically adds a post on submit',
    async () => {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify(samplePosts), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    )
    const newPost = { id: 99, userId: 1, title: 'New Post', body: 'Body new' }
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(newPost), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    renderWithStore()
      await act(async () => {
        await new Promise((res) => setTimeout(res, 2200))
      })

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: newPost.title } })
    fireEvent.change(screen.getByLabelText('Body'), { target: { value: newPost.body } })
    fireEvent.click(screen.getByText('Add post'))

    expect(screen.getByText(newPost.title)).toBeInTheDocument()

      await act(async () => {
        await new Promise((res) => setTimeout(res, 2200))
      })
      await waitFor(() => {
        expect(screen.getByText(newPost.body)).toBeInTheDocument()
      })
    },
    12000,
  )
})
