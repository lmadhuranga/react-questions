import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import { useGetPostQuery, useUpdatePostMutation } from '../../services/postsApi'

type FormState = { title: string; body: string }

type PostFormProps = {
  initial: FormState
  isSaving: boolean
  cancelHref: string
  onSubmit: (state: FormState) => Promise<void>
}

function PostForm({ initial, isSaving, cancelHref, onSubmit }: PostFormProps) {
  const [form, setForm] = useState<FormState>(initial)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await onSubmit(form)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
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
        <label className="field">
          <span>Body</span>
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            required
          />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save'}
        </button>
        <Link className="secondary" to={cancelHref}>
          Cancel
        </Link>
      </div>
    </form>
  )
}

export function PostEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const postId = Number(id)
  const { data, isLoading } = useGetPostQuery(postId, { skip: Number.isNaN(postId) })
  const [updatePost, { isLoading: isSaving }] = useUpdatePostMutation()

  const handleSubmit = async (state: FormState) => {
    if (Number.isNaN(postId)) return
    await updatePost({ id: postId, ...state })
    navigate(`/posts/${postId}`)
  }

  return (
    <Layout>
      <p className="eyebrow">Posts</p>
      <h1>Edit post</h1>
      {isLoading && <p className="helper">Loading post…</p>}
      {data ? (
        <PostForm
          key={data.id}
          initial={{ title: data.title, body: data.body }}
          isSaving={isSaving}
          cancelHref={`/posts/${postId}`}
          onSubmit={handleSubmit}
        />
      ) : null}
    </Layout>
  )
}
