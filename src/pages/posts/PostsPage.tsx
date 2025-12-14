import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import { useAddPostMutation, useDeletePostMutation, useGetPostsQuery } from '../../services/postsApi'

export function PostsPage() {
  const { data, isLoading, error } = useGetPostsQuery()
  const [addPost, { isLoading: isAdding }] = useAddPostMutation()
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()
  const [form, setForm] = useState({ title: '', body: '' })

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await addPost({ title: form.title, body: form.body, userId: 1 })
    setForm({ title: '', body: '' })
  }

  return (
    <Layout>
      <header className="page-header">
        <div>
          <p className="eyebrow">Posts</p>
          <h1>Posts feed</h1>
        </div>
      </header>

      <form className="form" onSubmit={onSubmit}>
        <div className="form-grid">
          <label className="field">
            <span>Title</span>
            <input
              type="text"
              value={form.title}
              required
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Body</span>
            <textarea
              value={form.body}
              required
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isAdding}>
            {isAdding ? 'Adding…' : 'Add post'}
          </button>
        </div>
      </form>

      {isLoading && <p className="helper">Loading posts…</p>}
      {error && <p className="error">Failed to load posts</p>}

      <div className="grid">
        {data?.slice(0, 12).map((post) => (
          <article className="card" key={post.id}>
            <div className="meta">
              <span className="pill">#{post.id}</span>
              <span className="pill pill--subdued">User {post.userId}</span>
            </div>
            <h3>{post.title}</h3>
            <p className="helper">{post.body}</p>
            <div className="card-actions">
              <Link className="secondary" to={`/posts/${post.id}`}>
                Details
              </Link>
              <Link className="secondary" to={`/posts/edit/${post.id}`}>
                Edit
              </Link>
              <button
                type="button"
                className="secondary danger"
                onClick={() => deletePost(post.id)}
                disabled={isDeleting}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </Layout>
  )
}
